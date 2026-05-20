# Pangu — UI Kit

A click-thru prototype of the full Pangu DM tool. Every screen is reachable from the home dashboard or the left rail.

## Entry point

[`index.html`](index.html) boots the app at the Home dashboard. Use the left rail (or hash routes) to navigate:

| Route | Screen | File |
|---|---|---|
| `#/` | Home dashboard — "Where shall we wander?" + Continue + Worlds + Chronicles + Oneshots | [`pages-dashboard.jsx`](pages-dashboard.jsx) |
| `#/worlds` | Worlds overview grid | [`pages-dashboard.jsx`](pages-dashboard.jsx) |
| `#/world/:id` | World detail — hero, chronicles inside, atlas | [`pages-dashboard.jsx`](pages-dashboard.jsx) |
| `#/campaigns` | Campaigns overview | [`pages-1.jsx`](pages-1.jsx) |
| `#/campaign/:id` | Campaign hero + Story Arc / Party / NPCs / Quests / Lore tabs | [`pages-1.jsx`](pages-1.jsx) |
| `#/session/:id` | Live session view — clock, party hex strip, initiative wheel, dice, log, AI summarise | [`pages-2.jsx`](pages-2.jsx) |
| `#/world-builder/:id` | AI Lore Forge | [`pages-2.jsx`](pages-2.jsx) |
| `#/characters` · `#/character/:id` | Character roster + character detail with stats/spells/inventory tabs | [`pages-2.jsx`](pages-2.jsx) |
| `#/bestiary` | Monster catalogue | [`pages-2.jsx`](pages-2.jsx) |
| `#/settings` | Settings: Profile · Preferences · About | [`pages-2.jsx`](pages-2.jsx) |

## File map

| File | What's in it |
|---|---|
| [`index.html`](index.html) | Shell HTML; loads fonts + CSS + JSX |
| [`styles.css`](styles.css) | Tokens, base type/buttons/badges/surfaces, navigation, modals |
| [`components.css`](components.css) | InitiativeWheel · ChapterSpine · ConstellationMap · DiceRoller · PartyTile · QuestList · NpcCard |
| [`pages.css`](pages.css) | Page-level layouts: dashboard, world detail, campaign hero, session view, bestiary, etc. |
| [`data.jsx`](data.jsx) | Mock data: WORLDS · CAMPAIGNS · CHARACTERS · LOCATIONS · NPCS · QUESTS · CHAPTERS · MONSTERS |
| [`shell.jsx`](shell.jsx) | Reusable shell: Starfield, CosmicImg, Navigation, Icon set, OrnateDivider, CompassRose, Modal, PageHeader |
| [`widgets.jsx`](widgets.jsx) | InitiativeWheel · ChapterSpine · ConstellationMap · DiceRoller · PartyTile · QuestList · NpcCard |
| [`pages-1.jsx`](pages-1.jsx) | CampaignsOverview · CampaignBigCard · NewCampaignModal · CampaignDetail · ChapterDetail · LocationMini |
| [`pages-2.jsx`](pages-2.jsx) | SessionView · WorldBuilder · CharactersOverview · CharacterDetail · Bestiary · SettingsPage |
| [`pages-dashboard.jsx`](pages-dashboard.jsx) | Dashboard · ContinueCard · WorldCard · ChronicleRow · OneshotCard · WorldsOverview · WorldDetail |
| [`app.jsx`](app.jsx) | Hash router, App entry, Tweaks panel wiring |
| [`tweaks-panel.jsx`](tweaks-panel.jsx) | Tweaks framework: TweaksPanel + TweakColor / TweakRadio / TweakToggle / TweakSelect |

## Information model (the law of the land)

```
World ──┬─ Campaign ── Session
        └─ Campaign ── Session
Oneshot ─────────────── Session   ← lives outside any world
```

The Home dashboard is the canonical entry — pick where you are in this tree, never start cold.

## Visual primitives used everywhere

- **`<CosmicImg glyph accent ratio>`** — algorithmic placeholder art with nebula + stars + a Cinzel glyph. Stand-in until real imagery arrives.
- **`<Starfield density>`** — the fixed cosmic backdrop.
- **`<OrnateDivider label glyph>`** — section separators between major regions.
- **`<CompassRose size>`** — flourish for hero sections and empty states.
- **`<Icon name>`** — line icons (24×24, stroke 1.6).
- **`<PageHeader eyebrow title description action>`** — every screen's top.

## Building new screens

Always start with `<PageHeader>` for the screen, then group sections with `<OrnateDivider>`. Cards live in CSS grids with `auto-fill, minmax(<lower>, 1fr)` so density scales fluidly.

For the colour of a card or interactive element, set `style={{ '--accent': someColor }}` on the card root — the hover glow and border-on-hover auto-derive from `--accent` via `color-mix(in oklab, var(--accent) 25%, transparent)`.
