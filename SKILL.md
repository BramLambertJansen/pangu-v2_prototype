---
name: pangu-design
description: Use this skill to generate well-branded interfaces and assets for Pangu (a Dungeon Master's tool), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and a full UI kit for prototyping.
user-invocable: true
---

# Pangu — Sanctum Design System

Read [`README.md`](README.md) first — it covers brand voice, visual foundations, iconography, and the strict three-level information model (**World → Campaign → Session**, with Oneshots as a parallel form).

## Foundations

- Tokens live in [`colors_and_type.css`](colors_and_type.css). Import once at the root.
- Logo: [`assets/logo.svg`](assets/logo.svg). Icon sprite: [`assets/icons.svg`](assets/icons.svg).
- Preview cards in [`preview/`](preview/) — each one is a self-contained HTML snippet you can lift to seed a new design.

## UI Kit

The full app prototype lives in [`ui_kits/pangu/`](ui_kits/pangu/). Open [`ui_kits/pangu/index.html`](ui_kits/pangu/index.html) to see every screen wired together with hash routing. The kit's README maps each route to its source file.

## When invoked

- For **visual artifacts** (slides, mocks, throwaway prototypes), copy the assets you need out of this folder into a new HTML file. Import `colors_and_type.css` so tokens work.
- For **production code**, lift components from `ui_kits/pangu/*.jsx` — they are React function components with no build step, well-factored, and ready to be hardened.
- Stay in the cosmic-manuscript voice (see README §CONTENT FUNDAMENTALS). The lectern, not the chat window. Cinzel for headings (uppercase, tracked). Cormorant Italic for mottos and AI-generated text. Manrope for everything else.
- Two-light palette: violet (the nebula) for interaction, gold (the candle) for ceremony. Status colours (teal · crimson · azure) only for semantics.
- Real imagery is preferred; use `<CosmicImg>` as a placeholder when none is available — never hand-draw illustrations.
- Emoji are not used. Unicode ornaments (`✦ ❀ ☾ ❦ ⚒`) are decorative only, never as action icons.

If invoked without specifics, ask the user what they want to build (a new screen? a marketing page? a slide? a tweak to an existing screen?), then act as an expert Pangu designer.
