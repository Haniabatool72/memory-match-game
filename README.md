# Memory Card Game

A card-matching game built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Features

- Three levels: Easy (4x3), Medium (4x4), Hard (6x5)
- Move counter and timer
- Best score saved per level (localStorage)
- Card flip animation
- Works on mobile and desktop
- Keyboard accessible, respects reduced-motion settings

## How to play

1. Click a card to flip it.
2. Click a second card.
3. If the two match, they stay face up. If not, they flip back.
4. Match every pair using as few moves as you can.

## Run locally

```bash
git clone https://github.com/YOUR-USERNAME/memory-card-game.git
cd memory-card-game
```

Then open `index.html` in your browser.

## Deploy with GitHub Pages

1. Push the project to GitHub.
2. Go to **Settings > Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder.
4. Save. Your game will be live at `https://Haniabatool72.github.io/memory-card-game/`.

## Project structure

```
memory-card-game/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Ideas to extend it

- Add a "pairs found" counter
- Add sound effects
- Add themes (animals, flags, food)
- Add a two-player mode

## License

MIT
