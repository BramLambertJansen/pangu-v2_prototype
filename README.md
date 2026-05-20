# Pangu — Sanctum Design System

A cosmic-manuscript design system for **Pangu**, a Dungeon Master's tool for keeping worlds, campaigns, and sessions. The visual DNA blends the **cradle-of-stars cosmos** (deep voids, violet nebulae, gold pinpricks) with the **illuminated manuscript** (carved display serifs, ornate dividers, ornamental flourishes, italic quotes). Every surface is a piece of starcharted vellum.

---

## The product

**Pangu** is a single-DM application for running tabletop role-playing games (D&D 5e is the primary system). Its information model is a strict three-level hierarchy:

> **World → Campaign → Session**

Plus a fourth, parallel form: **Oneshots** — standalone sessions that live outside any world.

The app surfaces this with a Home dashboard (resume last session, pick a world, pick a campaign, pick a oneshot), a Worlds atlas, Campaigns, Characters, a Bestiary, an AI-powered Lore Forge, and a live Session view.

### Source

- HTML/JSX prototype in this project: see `Pangu v2.html` and the JSX/CSS files alongside it.
- Component library: `ui_kits/pangu/`.

---

## CONTENT FUNDAMENTALS — how Pangu writes

The voice is **a lectern, not a chat window**. Copy reads as if a learned narrator — half scholar, half bard — is whispering over your shoulder.

- **Tense**: present, often imperative. *"Where shall we wander?"* not *"What would you like to do today?"*
- **Person**: addresses **you**, but speaks of **the party** (third person). Never first-person plural.
- **Register**: mildly archaic and ornamented, never stiff. *"A pact carved in dwarven stone"* over *"A campaign about dwarves."*
- **Mottos & quotes**: every campaign and world has a short italic motto in quotation marks. Mottos are the cover of the book.
- **Tone shift by surface**:
  - **Section eyebrows** are reverent: *"Your saga begins here"*, *"The cradle of every story"*.
  - **Section titles** are commanding: *Campaigns. Worlds. The World Builder.*
  - **Empty states** are an invitation, never an apology: *"Awaiting the kosmos"*, *"A blank kosmos awaits."*
  - **Buttons** are verbs, often archaic: *Forge a World. Summon a World. Run Session. Roll the bones.*
  - **Errors / not-found** are dry, never panicked: *"World not found"* — no exclamation, no smiley.
- **Casing**: display headings are **UPPERCASE** with extra letter-spacing; body copy is sentence case. Eyebrows and labels are UPPERCASE + tracked, gold.
- **Emoji**: **none**. The system uses unicode glyphs sparingly as ornamental marks (✦ ❀ ☾ ❦ ⚒) — never as iconography for actions.
- **Numbers**: chapter counts use **Roman numerals** for ceremony (CHAPTER IV); everything else (HP, level, sessions) is Arabic.
- **Capitalization of proper nouns**: world names, campaign names, NPC names, and place names are always title-cased. *Sword Coast · Forgotten Realms*. The middle-dot (·) is the system's preferred separator.

Specific examples from the live app:

| Surface | Example copy |
|---|---|
| Greeting | *"Welcome back, Dungeon Master · Where shall we wander?"* |
| Continue card eyebrow | *"● WHERE WE LEFT OFF"* (with live-pulse dot) |
| Empty world | *"Empty. Begin where you like."* |
| Lore forge prompt | *"e.g. 'A rumour the bartender tells when the candles burn low'"* |
| AI generating | *"Consulting the cosmos…"* |
| Oneshot tagline | *"Three hours below sea level"* |
| About blurb | *"Built for Dungeon Masters who would rather tell stories than keep score."* |

---

## VISUAL FOUNDATIONS

### Color — Sanctum Cosmic Dark

The palette has one law: **a deep cosmic void, lit by two warm lights** — **violet (the nebula)** as the primary surface accent, and **gold (the candle)** as the ceremonial accent. Everything else is teal/crimson/azure status indicators used sparingly.

- **Voids & surfaces** (`--void`, `--void-2`, `--surface`, `--surface-2`, `--surface-3`) — five steps of near-black tinted with violet, used to layer depth.
- **Violet** (`#9b8aff`) — the primary interactive accent. CTA backgrounds, focus rings, active-tab pills, glows around hovered cards.
- **Gold** (`#f5c842`) — the ceremonial accent, used for eyebrows, accent lines (1px gold rule before every eyebrow), badges of honour ("active" status, current chapter), and the gold-crosshair stars in the starfield. Never used as a primary CTA except in `btn-gold` for second-tier ceremonial actions ("Lore Forge").
- **Status semantics**: teal = alive/active/positive; crimson = danger/critical-HP/enemy; azure = informational.
- **Ink scale**: `--ink` (high-emphasis paper), `--ink-soft` (body), `--muted` (labels/eyebrows), `--subtle` (disabled/future).
- **Hairlines**: every border is a low-opacity violet (`rgba(155,138,255,0.14)` or `0.28`), never a solid grey line.

### Typography — Manuscript meets cosmos

- **Display**: **Cinzel** (carved-stone serif). Used for titles, screen headings, numerals on chapter stamps, level badges, dice results. Always tracked (letter-spacing 0.02–0.06em) and frequently `text-transform: uppercase`.
- **Body**: **Manrope**. The workhorse. Body copy, labels, button labels, navigation, form inputs.
- **Quote**: **Cormorant Garamond Italic**. Used *only* for mottos, AI-generated lore output, character backstories, and `"…"`-wrapped quotations. Italic always. Pulls readers into a different reading mode — slower, more reverent.
- **Mono**: **JetBrains Mono**. Numbers, dice values, session-clock, treasure counts (`184 gp`), code-like accents.

A 1px gold horizontal rule preceding every eyebrow (`<div style="width:36px; height:1px; background:gold"/>` + eyebrow) is a signature — it's the lectern's underline.

### Spacing & radii

A strict 4-point scale (`--sp-1` 4px … `--sp-20` 80px). Three density modes — **compact**, **standard**, **cozy** — re-scale `--sp-4..--sp-8` only. Radii follow `xs/sm//md/lg/xl/full` (4 / 8 / 12 / 16 / 20 / 28 / 9999).

### Backgrounds & layering

Every screen sits on a **three-layer cosmic backdrop**:

1. `.starfield-bg` — a fixed radial gradient (violet glow top, gold whisper bottom-right) over `--void`.
2. `.starfield-stars` — an inline SVG sprinkle of ~80 stars (subtle) to ~220 (full), 6% of which are gold "crosshair" stars (a circle with two intersecting line segments) for ceremony.
3. `.grain` — an SVG fractal-noise overlay at 4% opacity, `mix-blend-mode: overlay`. Adds film-grain warmth without darkening.

Surfaces float on top with `position: relative; z-index: 3;`. Cards are always **solid** (not transparent) over this backdrop — the backdrop is felt, not seen through panels.

### Cards

- **Border**: 1px hairline violet (low opacity). Rarely outlined in strong colour — instead, on hover the border becomes the card's accent.
- **Radius**: `--r` (12px) for inline cards, `--r-md` (16px) for hero/feature cards.
- **Shadow**: cards in their rest state are nearly shadow-less; **hover** is the moment for elevation: `0 24px 56px rgba(0,0,0,0.4)` paired with a coloured `0 0 32px color-mix(in oklab, var(--accent) 25%, transparent)` glow.
- **Inner highlight**: feature cards often carry `inset 0 1px 0 rgba(255,255,255,0.03)` to fake a top-lit bevel.

### Hover, press, focus

- **Hover** on cards: `translateY(-3 to -4px)` + accent-coloured border + coloured glow.
- **Hover** on buttons: lighten the fill (`btn-primary` → `--violet-soft`), `translateY(-1px)`, slightly brighter shadow.
- **Hover** on icons / ghost: subtle violet wash background (`rgba(155,138,255,0.06–0.1)`).
- **Press**: no extra scale-down — buttons rely on the slight upward translate releasing.
- **Focus** (inputs): `border-color: var(--violet)` + `box-shadow: 0 0 0 3px rgba(155,138,255,0.15)` — a violet halo.
- **Transitions**: `180–280ms` with `cubic-bezier(.2,.7,.2,1)` (default for cards) or stock `ease-out` for buttons. Animations are **subtle by default** — no bouncing, no overshoot. The exception: the **dice tumble** (`d20-tumble` — 0.7s preserve-3d rotation) and the **chapter-spine pulse** ring on the current node.

### Borders & dividers

- `border: 1px solid var(--hairline)` is the default rule.
- `<OrnateDivider label="…" />` — the system's signature section break: a thin horizontal gradient line on each side of a pill-shaped label glyph in gold (`✦ Label ✦`), padded `40px 0`. Use this between **major** sections, not subsections.
- `<CompassRose />` — a 56–80px SVG flourish (concentric circles + crosshair + needle) — appears at the start of major hero sections and on empty states.

### Imagery — Cosmic placeholders

The system **does not ship illustrations**. In place of real art it generates an algorithmic placeholder (`<CosmicImg>`): a nebula radial gradient + concentric rings + scattered tiny SVG stars + a large display-serif glyph (the first letter of the entity, or `✦`). This is the look used for campaign covers, world art, character portraits, and bestiary entries until real art arrives.

Real imagery should follow the same brief: **cool void backgrounds, warm violet/gold light sources, no human faces shown, painterly rather than photographic**.

### Iconography

See [ICONOGRAPHY](#iconography) below — line icons only, no fills (except the play triangle and pause bars).

### Layout

- A **240px persistent left rail** on desktop, collapsing to a **64px bottom bar** below 900px.
- Main content is centered in `max-width: 1320px` (`.page-max`) with generous outer padding (`var(--sp-12)` at desktop).
- Hero sections use a 2-column grid (art left, content right) at desktop; stack at 900px.
- Card grids use `auto-fill, minmax(<lower>, 1fr)` so density fluidly matches viewport.

### Transparency & blur

Used judiciously — **only over imagery or modal scrim**:

- Modal backdrops: `rgba(10,10,20,0.7)` + `backdrop-filter: blur(8px)`.
- Map legend / world card stamps: `rgba(15,14,28,0.7-0.8)` + `backdrop-filter: blur(4-6px)`.
- Card resting surfaces are always **opaque**.

---

## ICONOGRAPHY

Pangu ships **inline SVG line icons**, hand-curated for theme. They live in `shell.jsx` as a single `<Icon name="…" size={n} stroke={1.6}/>` switch. All icons share:

- **24×24 viewBox**, **stroke-based**, no fills (exceptions: play / pause / sneak-attack glyphs).
- **Stroke width** 1.6 by default. Buttons and small contexts often pass 1.4.
- **Round caps & joins**.
- **`currentColor`** stroke so they tint with their container.
- **No bicoloured glyphs**, no gradient strokes.

Available glyphs include: `home, users, compass, compass-alt, skull, cog, sparkles, plus, search, arrow-left, arrow-right, chevron-right, chevron-down, play, pause, heart, shield, swords, dice, map-pin, book, edit, trash, check, x, sun, moon, send, zap, crown, feather, eye, globe, pen`. The full set is in [`assets/icons.svg`](assets/icons.svg).

**Unicode glyphs as ornament** are used for non-functional flourishes only: `✦` (default star), `❀` (party / heart sections), `☾` (oneshot/night sections), `❦` (ranger / nature), `⚒` (dwarf / fighter), `☉`. Never used as buttons; only as decorative dividers or character-class glyphs.

**Emoji are not used.**

---

## Index

| File | Purpose |
|---|---|
| [`README.md`](README.md) | This file — brand context, tone, foundations. |
| [`SKILL.md`](SKILL.md) | Agent-skill manifest. Read when invoked. |
| [`colors_and_type.css`](colors_and_type.css) | All tokens — colors, type, spacing, radii, shadows. Import to use. |
| [`assets/icons.svg`](assets/icons.svg) | Full icon set as a single SVG sprite. |
| [`assets/logo.svg`](assets/logo.svg) | The Pangu mark. |
| [`preview/`](preview/) | Design-system card files (rendered in the Design System tab). |
| [`ui_kits/pangu/`](ui_kits/pangu/) | Pangu app UI kit — full click-thru prototype + reusable components. |

---

## Caveats

- **Fonts are loaded from Google Fonts** (Cinzel, Manrope, Cormorant Garamond, JetBrains Mono). No `.ttf`/`.woff` files are bundled. If you need to use these offline or in production, download from Google Fonts or substitute equivalents.
- The system does not yet define **a light theme**. Sanctum Cosmic Dark is the only theme; the `:root[data-accent="…"]` overrides re-tint the primary accent only.
- **No real imagery** — all artwork is placeholder. When real art arrives, the `<CosmicImg>` component should accept an `src` prop and fall back to the algorithmic placeholder when missing.
