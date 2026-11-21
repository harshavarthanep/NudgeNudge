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

## Releasing an update

1. Replace the files you changed (usually `app/index.html`) and commit.
2. Actions, "Build NudgeNudge apps", Run workflow, with a **higher** version (for example `1.0.1`).

## Notes for each platform

- **Windows:** first run may show "Windows protected your PC". Choose More info, then Run anyway. This appears because the app isn't signed with a paid certificate.
- **Mac:** first open: System Settings, Privacy & Security, Open Anyway. Removing this step needs an Apple Developer account.
- **Linux:** `.deb` for Ubuntu, Debian and Mint, `.AppImage` for everything else.
- **Android:** keep the signing key safe. Updates only install over the old version when they're signed with the same key.
- **iPhone and iPad:** Apple only allows App Store apps, so iPhone users add the web app to their Home Screen from Safari.
