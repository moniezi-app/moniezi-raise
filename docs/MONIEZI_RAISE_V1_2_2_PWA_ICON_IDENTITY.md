# MONIEZI Raise V1.2.2 — PWA Icon Identity Hotfix

This source-only hotfix separates the installed MONIEZI Raise app identity from the base/previous app identity.

## Changes

- Replaced the installed PWA icon set with the same visual identity used by the MONIEZI Raise header mark: a blue/indigo rounded square with a white landmark-style raise/funding symbol.
- Updated favicons, Apple touch icon, and Android/Chrome PWA icons.
- Updated the web app manifest short name to `Raise`.
- Updated the manifest ID to a Raise-specific identity.
- Updated the browser title to `MONIEZI Raise V1.2.2`.
- Bumped the service-worker cache so Android/Chrome can pick up the new assets.

## Notes

The icon shown inside the header does not automatically become the installed app icon. Android, Chrome, and iOS use the manifest icon files, favicons, and Apple touch icon. This version makes those installed-app assets match the MONIEZI Raise header mark.
