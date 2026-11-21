// Run after "npx cap add android" (the GitHub workflow does this for you).
// Adds: notification/alarm/microphone permissions, the home-screen widget,
// a ringing alarm sound, the status-bar icon and the version number.
// Usage: node android-extras.mjs 1.0.0
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const version = (process.argv[2] || process.env.APP_VERSION || '1.0.0').replace(/^v/, '');
const appDir = resolve(here, 'android/app');
const mainDir = join(appDir, 'src/main');
const pkgDir = join(mainDir, 'java/com/h24creationz/nudgenudge');
if (!existsSync(mainDir)) { console.error('Run "npx cap add android" first.'); process.exit(1); }

// 1. Manifest: permissions, package visibility for speech services, widget receiver
const mf = join(mainDir, 'AndroidManifest.xml');
let m = readFileSync(mf, 'utf8');
const perms = ['android.permission.POST_NOTIFICATIONS', 'android.permission.SCHEDULE_EXACT_ALARM', 'android.permission.RECEIVE_BOOT_COMPLETED', 'android.permission.VIBRATE', 'android.permission.RECORD_AUDIO', 'android.permission.WAKE_LOCK'];
const add = perms.filter((p) => !m.includes('"' + p + '"')).map((p) => '    <uses-permission android:name="' + p + '" />').join('\n');
const queries = m.includes('android.speech.RecognitionService') ? '' : '    <queries>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n    </queries>\n';
m = m.replace(/<application/, (add ? add + '\n' : '') + queries + '    <application');
if (!m.includes('.NNWidget')) {
  m = m.replace('</application>', '        <receiver android:name=".NNWidget" android:exported="false" android:label="Nudge Nudge">\n            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>\n            <meta-data android:name="android.appwidget.provider" android:resource="@xml/nn_widget_info" />\n        </receiver>\n    </application>');
}
writeFileSync(mf, m);

// 2. Java: widget, widget plugin, main activity that registers the plugin
mkdirSync(pkgDir, { recursive: true });
for (const f of ['NNWidget.java', 'NNWidgetPlugin.java', 'MainActivity.java']) cpSync(join(here, 'android-files/java', f), join(pkgDir, f));

// 3. Resources: widget layout, widget info, drawables, strings
cpSync(join(here, 'android-files/res'), join(mainDir, 'res'), { recursive: true });

// 4. Alarm sound (res/raw/nn_alarm.wav): three rising beeps, about 2.4 seconds
mkdirSync(join(mainDir, 'res/raw'), { recursive: true });
const rate = 22050, secs = 2.4, n = Math.floor(rate * secs), data = Buffer.alloc(n * 2);
const beeps = [[0, .22, 880], [.3, .22, 880], [.6, .35, 1175], [1.2, .22, 880], [1.5, .22, 880], [1.8, .35, 1175]];
for (let i = 0; i < n; i++) {
  const t = i / rate; let v = 0;
  for (const [s, d, f] of beeps) if (t >= s && t < s + d) { const k = t - s; const env = Math.min(1, k / .01) * Math.min(1, (s + d - t) / .03); v += Math.sin(2 * Math.PI * f * k) * .55 * env + Math.sin(4 * Math.PI * f * k) * .12 * env; }
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), i * 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
writeFileSync(join(mainDir, 'res/raw/nn_alarm.wav'), Buffer.concat([h, data]));

// 5. Version from the release
const gradle = join(appDir, 'build.gradle');
let g = readFileSync(gradle, 'utf8');
const [a, b, c] = version.split('.').map((x) => parseInt(x, 10) || 0);
g = g.replace(/versionCode \d+/, 'versionCode ' + (a * 10000 + b * 100 + c)).replace(/versionName "[^"]*"/, 'versionName "' + version + '"');
writeFileSync(gradle, g);

console.log('Android extras applied (version ' + version + ').');
