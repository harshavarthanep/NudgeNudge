# Nudge Nudge

A companion that remembers what you tell it, reminds you on time, keeps reminding until it's done, and protects your focus. Built by H24 Creationz.

| Folder | What it is |
|---|---|
| `index.html` | Product and download page, with the demo videos |
| `app/` | The web app (installable, works offline). The desktop and Android apps are built from this same app. |
| `media/` | Demo videos, posters and screenshots used on the page |
| `native/desktop/` | Windows, Mac and Linux app |
| `native/mobile/` | Android app, including the home-screen widget |
| `native/shared/` | Copies the web app into the desktop and Android apps when they're built |
| `.github/workflows/build-apps.yml` | Builds every app and publishes the downloads |

## First-time setup (about 10 minutes, once)

1. Create a **public** repository named `NudgeNudge` on GitHub.
2. Upload everything in this folder, including the hidden `.github` folder (see the tip below), then Commit changes.
3. Turn on the website: Settings, Pages, Source "Deploy from a branch", Branch `main`, folder `/ (root)`, Save.
   The page will be at `https://harshavarthanep.github.io/NudgeNudge/` and the app at `.../NudgeNudge/app/`.
4. Add the 4 Android signing secrets from the separate PRIVATE zip (never upload that zip):
   Settings, Secrets and variables, Actions, New repository secret. Follow `GITHUB-SECRETS-READ-ME.txt`.
5. Build the apps: Actions, "Build NudgeNudge apps", Run workflow, version `1.0.0`, Run workflow.
   After about 15 to 20 minutes a Release appears with every download, and the download page switches from "Available soon" to real download buttons automatically.

> **Tip: the `.github` folder.** Mac and Windows hide folders that start with a dot. If it didn't upload, on GitHub choose
> Add file, Create new file, type the name `.github/workflows/build-apps.yml`, paste the contents of that file, and commit.

## Optional: live Google Calendar sync on the website

File import and export work without this. To let people sign in with Google and pull in their events:

1. Open console.cloud.google.com and create a project called Nudge Nudge.
2. APIs & Services, Library: enable **Google Calendar API**.
3. OAuth consent screen: choose External, fill in the app name and your email, add the scope `.../auth/calendar.readonly`, and publish the app (or add testers' emails while testing).
4. Credentials, Create credentials, OAuth client ID, type **Web application**. Under Authorized JavaScript origins add `https://harshavarthanep.github.io`.
5. Copy the Client ID. In `app/index.html`, find `window.NN_GOOGLE_CLIENT_ID = window.NN_GOOGLE_CLIENT_ID || '';` near the top and paste it between the quotes. Commit.

Until Google verifies the app, people see an "unverified app" notice and can continue through Advanced. Live sync is for the website; in the desktop and Android apps people use the file import.

## Building the apps for every device (step by step)

You never build on your own computer. GitHub builds every app for you, for free, on its own Windows, Mac and Linux machines.

1. Make sure the 4 Android secrets are added (step 4 above). Use the **same** key every time, the one in your saved `NudgeNudge-PRIVATE-android-key` folder. Never make a new one.
2. Open your repository on GitHub, then the **Actions** tab. If GitHub asks, click "I understand my workflows, go ahead and enable them".
3. Click **Build NudgeNudge apps** on the left, then **Run workflow** on the right.
4. Type a version number higher than the last one (first time `1.0.0`, then `1.0.1`, `1.0.2`…) and press the green **Run workflow** button.
5. Wait 15 to 20 minutes. Five jobs run: windows, mac, linux, android, then release. When all are green, open **Releases** (right side of the repo page). You'll see:
   - `NudgeNudge-Setup-x64.exe` and `NudgeNudge-Setup-arm64.exe` (Windows installers), `NudgeNudge-Portable.exe`
   - `NudgeNudge-Mac.dmg` (Apple silicon and Intel)
   - `NudgeNudge-Linux.AppImage` and `NudgeNudge-Linux.deb`
   - `NudgeNudge-Android.apk`
6. The download page updates itself and starts offering these files. Nothing else to change.
7. iPhone and iPad: there's no file to build. People open the web app in Safari and choose Share, then Add to Home Screen.

If a job turns red, open it, copy the last 30 lines of the red step, and send them to me.

## Releasing an update

1. Replace the files you changed (usually `app/index.html`) and commit.
2. Actions, "Build NudgeNudge apps", Run workflow, with a **higher** version (for example `1.0.1`).

## Notes for each platform

- **Windows:** first run may show "Windows protected your PC". Choose More info, then Run anyway. This appears because the app isn't signed with a paid certificate.
- **Mac:** first open: System Settings, Privacy & Security, Open Anyway. Removing this step needs an Apple Developer account.
- **Linux:** `.deb` for Ubuntu, Debian and Mint, `.AppImage` for everything else.
- **Android:** keep the signing key safe. Updates only install over the old version when they're signed with the same key.
- **iPhone and iPad:** Apple only allows App Store apps, so iPhone users add the web app to their Home Screen from Safari.
