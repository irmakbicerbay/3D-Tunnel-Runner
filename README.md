# 3D Tunnel Runner

A lightweight Three.js dodging game: steer a small ship down a tunnel, avoid meteor-like obstacles, and chase a high score. Built with vanilla HTML/CSS/JS and served as a static page.

## Play
- Move: `A/D` or `← / →`
- Start/Restart: `Space`
- Avoid the orange meteors. Collision ends the run and updates your best score (localStorage).

## Run locally
1. Serve the folder (any static server works):
   - Python: `python3 -m http.server 8000`
   - Node (serve): `npx serve .`  
   Then open `http://localhost:8000/task1-threejs-game/`
2. Or double-click `index.html` (may be blocked by CORS on some browsers; a local server is recommended).

## Files
- `index.html` – Canvas + HUD shell.
- `style.css` – Fullscreen layout and HUD styling.
- `main.js` – Three.js scene (camera, lights), player ship/UFO model, obstacles, input, and game loop.

## Tech notes
- Three.js from CDN (`unpkg`).
- Persists best score in `localStorage` under `ata3d_best`.
- Uses `WebGLRenderer` with ACES tonemapping and sRGB output.

## Tweaks
- Adjust difficulty: in `main.js`, `spawnEvery` and obstacle speed (`speed`) inside `animate()`.
- Change ship look: edit the player mesh block near the top of `main.js`.
- Colors/HUD: edit `style.css` variables and HUD block.
