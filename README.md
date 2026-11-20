# Nudge Nudge

A companion that remembers what you tell it, reminds you on time, keeps reminding until it's done, and protects your focus.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | Product and download page, with the demo videos |
| `app/` | The web app (installable, works offline) |
| `app/sw.js` | Offline support and notification buttons (Done / Snooze) |
| `media/` | Demo videos, posters and app screenshots used on the page |

## Put it live on GitHub Pages

1. Create a public repository named `Nudge-Nudge`.
2. Upload everything in this folder (keep the folder structure, including `.nojekyll`).
3. Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
4. After a minute it's live at `https://harshavarthanep.github.io/Nudge-Nudge/` and the app at `/Nudge-Nudge/app/`.

If you use a different repository name, the page and app still work, but the web address shown at the end of the demo videos will be wrong.

## When the phone and desktop apps are built

Open `index.html`, find `const RELEASES = {` near the bottom, and paste each download link. Empty links show "Coming soon".

## How reminders work on the web

The web app checks reminders every few seconds while it's open in a tab or installed window, and sends real system notifications with Done and Snooze buttons. Browsers pause websites in the background (especially on phones), so for alarms that ring with the screen locked, use the native apps.
