# CLAUDE.md

## Project

Static single-page site that teaches Binaro (binary puzzle) strategies, from beginner to expert. No build step — plain HTML, CSS, and vanilla JS (ES modules). Hosted on GitHub Pages.

## Structure

```
index.html          — entire site (single page, multiple sections/chapters)
css/
  base.css          — variables, reset, typography
  layout.css        — page layout and spacing
  components.css    — UI components (cards, nav, etc.)
  puzzle.css        — puzzle grid and cell styles
js/
  main.js           — entry point, imports and inits all modules
  navigation.js     — navbar, scroll tracking, mobile menu
  animations.js     — scroll-triggered animations
  walkthrough.js    — step-by-step puzzle walkthroughs
  practice.js       — interactive practice puzzles
  grid.js           — shared grid rendering utilities
```

## Development

No install or build required. Open `index.html` in a browser or use any static file server.

## Deployment

- **Main site** deploys to `gh-pages` branch on push to `main` (`.github/workflows/deploy.yml`)
- **PR previews** deploy automatically via `rossjrw/pr-preview-action` (`.github/workflows/pr-preview.yml`)
- Live at: `https://vincentpeters.github.io/Binaro-guide/`
