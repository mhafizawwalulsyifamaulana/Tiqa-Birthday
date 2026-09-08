# Happy 21st Birthday Tiqa

Static, vanilla HTML/CSS/JavaScript birthday surprise website.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server.

## Assets

Put the exact files here:

- `images/portrait-1.jpg`
- `images/portrait-2.jpg`
- `images/portrait-3.jpg`
- `images/landscape-1.jpg`
- `images/landscape-2.jpg`
- `images/landscape-3.jpg`
- `images/background.jpg`
- `images/cake.png`
- `images/shark.png`
- `audio/happy-birthday.mp3`
- `audio/jatuh-suka.mp3`
- `video/birthday.mp4`

If extensions differ, edit the paths in `index.html` / `script.js` in the asset section.

## Deploy to Vercel

This is a static site with no build step. Import the folder/repository into Vercel and use the default static deployment settings. `index.html` is the entry point.

## Notes

- Browser autoplay restrictions are handled with the `Tap to Begin` fallback.
- The birthday audio is the page background audio.
- `Jatuh Suka — Tulus` has its own HTML5 Audio player.
- The video uses Intersection Observer and muted inline autoplay.
- Celebration confetti uses canvas-confetti from jsDelivr CDN.
