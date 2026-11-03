# Zakopane Christmas 2026: family trip app

A small offline-capable web app (PWA) with everything for the trip in one place. No build step, no accounts, free to host on GitHub Pages.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `trip-data.js` | All trip content: days, stays, bookings, lists, links | **Yes, this is the only file you normally edit** |
| `app.js` | Renders the tabs, weather, checklists | Only for new features |
| `styles.css` | Look and feel (auto light/dark) | Rarely |
| `sw.js` | Offline caching | Bump `VERSION` after each change |
| `index.html`, `manifest.webmanifest`, `icon*` | App shell and home-screen icon | Rarely |

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765

## Publish on GitHub Pages

1. Create a new repo on GitHub, e.g. `zakopane-2026`. Make it **private** only if you have GitHub Pro (Pages on private repos needs a paid plan). Otherwise public, so **don't put passport numbers or booking PINs in it**.
2. In this folder:
   ```bash
   git init && git add . && git commit -m "Trip app v1"
   git branch -M main
   git remote add origin git@github.com:<your-user>/zakopane-2026.git
   git push -u origin main
   ```
3. On GitHub: Settings → Pages → Source: *Deploy from a branch* → `main` / `root` → Save.
4. After about a minute the app is live at `https://<your-user>.github.io/zakopane-2026/`.

## Share with the family

- Send the link in the family WhatsApp group.
- iPhone: open in Safari → Share → **Add to Home Screen**.
- Android: open in Chrome → menu → **Install app** / Add to Home screen.
- Open it once on Wi-Fi before departure so the offline copy is saved.

## Updating

1. Edit `trip-data.js` (for example change a booking `status` to `"booked"` and add the `ref`, `checkIn`, `phone`).
2. Bump `VERSION` in `sw.js` (`"v1"` → `"v2"`).
3. Commit and push. Phones pick up the change next time they open the app online.

## Shared editing

Checklist ticks are saved per phone. For things everyone edits (expenses, notes, who brings what), create a Google Sheet and/or Splitwise group and paste the links into `links` in `trip-data.js`.

## Reusing for another trip

Copy the folder, rewrite `trip-data.js`, change the name in `manifest.webmanifest`, push to a new repo.

## Privacy

The site is public to anyone with the link. Keep passport numbers, full booking PINs and payment details out of this repo. Keep them in the private Google Sheet instead.
