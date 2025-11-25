# Task: Update Cypher Game UI to Rune Aesthetic

You are working in the `cypher` repository.

The goal is to:
1. Update the game UI to match the visual style used in `elements.html`.
2. Add the new logo/sigil from `splash01.html` onto the main app screen.
3. Keep all game logic and puzzle behavior intact – this is a **UI/UX refactor**, not a gameplay change.

---

## 1. Understand Current Structure

1. Inspect the repo structure and identify:
   - The **main game screen** HTML file (most likely `index.html`, but confirm by reading the file and seeing where the core game UI is rendered).
   - The **splash screen** file: `splash01.html` (this should contain the new rune logo/sigil).
   - The **UI reference sheet**: `elements.html` (this contains the aesthetic we want to adopt).
   - Existing CSS files, e.g.:
     - `styles.css`
     - `landing.css`
     - Any other relevant stylesheets.

2. Do **not** change any JS game logic files (e.g. `game.js`, `puzzles.js`, `runes.js`, `codex.js`) beyond minimal DOM selector tweaks that might be needed after markup changes.

---

## 2. Extract a Shared UI Theme

We want to centralize the rune/aesthetic styles (sigil, HUD bar, panels, buttons, etc.) into a reusable theme.

1. Find the CSS that powers:
   - The rune sigil logo and animated rings/smoke (currently used in `splash01.html`).
   - The elements in `elements.html`:
     - `.sigil`, `.sigil-layer`, smoke and ring animations
     - `.btn`, `.btn--ghost`, `.btn--warn`
     - `.panel`, `.panel-title`, `.panel-meta`
     - `.hud-bar`, `.control-strip`, `.code-input`, etc.

2. Create a shared stylesheet in the repo root (if it doesn’t already exist for this purpose), for example:

   - `ui-theme.css`

3. Move or copy all reusable UI styles from inline `<style>` blocks in `splash01.html` and `elements.html` into `ui-theme.css`. These should include:

   - Color variables (if present) and base background.
   - Sigil component styles:
     - `.sigil`, `.sigil-layer`
     - `@keyframes` for spin and smoke
   - Button styles:
     - `.btn`, `.btn--ghost`, `.btn--warn`
   - Panel/log styles:
     - `.panel`, `.panel-title`, `.panel-meta`, `.panel-separator`
   - HUD and footer controls:
     - `.hud-bar`, `.control-strip`, `.control-label`, etc.
   - Input field:
     - `.code-input`

4. Ensure both `elements.html` and `splash01.html` now reference `ui-theme.css` (and remove any duplicate inline CSS that has been moved):

   ```html
   <link rel="stylesheet" href="ui-theme.css">
