# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project

**Pangu** is een AI-ondersteund campaign management platform voor tabletop RPGs (PWA). Een Dungeon Master (DM) bouwt een levende wereld met locaties, NPCs, lore en avonturen; een AI-agent genereert consistente nieuwe content. Spelers beheren hun eigen karakter en inventaris.

De repository bevat twee lagen:
- **Design system prototype** (huidige staat) — browser-based JSX prototype zonder build step, als visuele en structurele referentie
- **Productie-app** (te bouwen) — React + Vite + TypeScript + Supabase PWA op basis van het design system

**Taal:** UI en code-communicatie is in het **Nederlands**. Console logs, code comments, variabelenamen en TypeScript zijn in het **Engels**.

---

## PWA-criteria (hard, geen uitzonderingen)

Dit zijn de drie harde eisen voor elke versie van de app:

1. **Installeerbaar** — Web App Manifest + Service Worker aanwezig; app is downloadbaar via browser install prompt op zowel desktop als mobiel
2. **Mobiel en desktop** — werkt op beide schermformaten; navigatie adapteert: 240px left rail op desktop, 64px bottom bar < 900px
3. **Offline capable** — shell en statische assets worden gecachet via service worker

---

## Design system prototype (huidige repo-inhoud)

Het prototype is de **blauwdruk** voor de productie-app. Alle visuele en interactieve beslissingen zijn hier uitgewerkt. Lees dit altijd voordat je nieuwe features bouwt.

### Bestanden

| Bestand | Inhoud |
|---|---|
| `index.html` | Entry point; laadt CDN React 18.3.1 + Babel Standalone + alle JSX modules |
| `app.jsx` | Hash router (`useHashRoute`), root `App`, tweak state wiring |
| `data.jsx` | Mock data: `WORLDS`, `CAMPAIGNS`, `CHARACTERS`, `SESSIONS`, `BESTIARY` |
| `shell.jsx` | UI primitives: `Starfield`, `Navigation`, `Modal`, `CosmicImg`, `Icon`, `OrnateDivider`, `CompassRose`, `PageHeader` |
| `widgets.jsx` | Specialistische components: `InitiativeWheel`, `ChapterSpine`, `ConstellationMap`, `DiceRoller`, `PartyTile`, `QuestList`, `NpcCard` |
| `tweaks-panel.jsx` | Runtime thema-tweaks panel (accent, density, starfield, grain) |
| `pages-1.jsx` | Campaigns: `CampaignsOverview`, `CampaignDetail`, `NewCampaignModal` |
| `pages-2.jsx` | `CharactersOverview`, `CharacterDetail`, `WorldBuilder`, `Bestiary`, `SettingsPage` |
| `pages-dashboard.jsx` | `Dashboard`, `WorldsOverview`, `WorldDetail`, `SessionView` |
| `colors_and_type.css` | Alle design tokens als CSS custom properties |
| `styles.css` | Globale stijlen, layout, starfield background, grain overlay |
| `components.css` | Component-level stijlen |
| `pages.css` | Pagina/screen stijlen |
| `assets/logo.svg` | Pangu mark |
| `assets/icons.svg` | Icon sprite (30+ line icons, 24×24, stroke 1.6) |
| `preview/` | 17 zelfstandige HTML design-system preview kaarten |
| `ui_kits/pangu/` | Volledige kopie van het prototype; gebruik als vertrekpunt voor productie-componenten |

### Script-laadvolgorde (index.html)

```
data.jsx → tweaks-panel.jsx → shell.jsx → widgets.jsx → pages-1.jsx → pages-2.jsx → pages-dashboard.jsx → app.jsx
```

### Hash routes (prototype)

| Hash | Component | Bestand |
|---|---|---|
| `#/` | Dashboard | pages-dashboard.jsx |
| `#/worlds` | WorldsOverview | pages-dashboard.jsx |
| `#/world/:id` | WorldDetail | pages-dashboard.jsx |
| `#/campaigns` | CampaignsOverview | pages-1.jsx |
| `#/campaign/:id` | CampaignDetail | pages-1.jsx |
| `#/session/:id` | SessionView | pages-dashboard.jsx |
| `#/world-builder/:id` | WorldBuilder | pages-2.jsx |
| `#/characters` | CharactersOverview | pages-2.jsx |
| `#/character/:id` | CharacterDetail | pages-2.jsx |
| `#/atlas` | WorldPage | app.jsx |
| `#/bestiary` | Bestiary | pages-2.jsx |
| `#/settings` | SettingsPage | pages-2.jsx |

---

## Informatie model

```
World ──┬─ Campaign ── Session
        └─ Campaign ── Session
Oneshot ─────────────── Session   (parallel, geen World-parent)
```

De app heeft één DM per wereld. Spelers hebben toegang tot campaigns binnen die wereld.

---

## Productie tech stack

### Commands

```bash
npm run dev          # Vite dev server only — /api/* routes unavailable
npm run dev:full     # vercel dev — includes serverless functions at /api/*
npm run build        # tsc + vite build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src --ext ts,tsx
npm run test         # vitest
npm run preview      # preview production build
```

> Gebruik `npm run dev:full` bij alles wat `/api/agent` aanroept (AI features). `npm run dev` geeft 404 op die routes.

### Tech stack

| Laag | Technologie |
|---|---|
| UI | React 19 + Vite 6, TypeScript strict mode |
| Styling | TailwindCSS v4 + CSS custom properties uit design system |
| PWA | vite-plugin-pwa (generateSW strategie) |
| Routing | react-router-dom v7 |
| Auth + data | Supabase (Auth, Postgres, RLS) |
| Client state | Zustand (persisted) |
| Server state | TanStack Query v5 (mutations + cache invalidation) |
| Validatie | Zod (schema's genereren TS types via `z.infer<>`) |
| Forms | react-hook-form + Zod resolver |
| Toasts | Sonner |
| AI | `@anthropic-ai/sdk` — server-side only via `api/agent.ts` |
| Afbeeldingen | react-easy-crop — crop/resize voor avatars en banners |
| Path alias | `@/` → `src/` |

### PWA setup

`vite-plugin-pwa` configureert:
- **`manifest.webmanifest`** — `name: "Pangu"`, `theme_color: "#0a0a14"`, `background_color: "#0a0a14"`, `display: "standalone"`, iconen op 192px en 512px
- **Service worker** (`generateSW`) — precachet shell + statische assets; runtime caching voor Google Fonts
- **Offline fallback** — laadt gecachte shell wanneer netwerk niet beschikbaar is

### `api/agent.ts` — Vercel serverless function

De enige backend functie. Proxiet naar Anthropic. Nooit direct vanuit de frontend aanroepen — altijd via `fetch('/api/agent', ...)`.

- Accepteert POST only (405 anders)
- Input: `messages[]`, `apiKey`, `model` (default: `claude-sonnet-4-6`), `language` (`nl`/`en`)
- Gebruikt `apiKey` uit request body (BYOK) of valt terug op `process.env.ANTHROPIC_API_KEY`
- Geeft 400 terug als geen API key beschikbaar, 401 bij ongeldige key

### Supabase

Auth en alle data gaan via Supabase. De data-toegang loopt via een **database abstraction layer** in `src/lib/db/`:

- `db-provider.ts` — `DbProvider` interface (abstract contract)
- `db.ts` — factory die de actieve provider teruggeeft
- `providers/supabase-provider.ts` — Supabase-implementatie

`seeds/supabase-setup.sql` bevat het volledige schema met tabelstructuur en Row Level Security (RLS) policies.

### App shell layout

Alle non-login routes zitten in `AppShell` (`src/components/AppShell.tsx`):
- Vaste `Sidebar`/`Navigation` links — 240px op desktop, 64px bottom bar op mobiel (< 900px)
- Scrollbaar main content rechts (`flex-1 overflow-y-auto`)

### Feature structuur

```
src/features/[feature]/
  components/     # Presentationele en form componenten
  hooks/          # Mutation hooks (useCreate*, useUpdate*, useDelete*)
  pages/          # Route-level componenten
  schemas/        # Zod validatieschema's
  services/       # Supabase CRUD
  types.ts        # TypeScript types voor dit domein
  [name].store.ts # Zustand store (indien nodig)
```

### Data access patroon

```
Page/Component
  → mutation hook (useCreateX, useUpdateX)
    → service function (createX, updateX in *.service.ts)
      → DbProvider → Supabase
```

---

## Design system

### Kleurpalet — Sanctum Cosmic Dark

Één wet: **een diepe kosmische void, verlicht door twee warme lichten** — violet (de nevel) als primaire interactie-accent, goud (de kaars) als ceremonieel accent.

| Token | Waarde | Gebruik |
|---|---|---|
| `--void` | `#0a0a14` | App background |
| `--void-2` | `#0f0e1c` | Subtiele lagen |
| `--surface` | `#15142a` | Kaart-achtergrond |
| `--surface-2` | `#1c1a35` | Verhoogde kaarten |
| `--surface-3` | `#252243` | Hover-staat |
| `--violet` | `#9b8aff` | Primair interactie-accent: CTA, focus rings, actieve tabs |
| `--gold` | `#f5c842` | Ceremonieel accent: eyebrows, badges, divider-glyphs |
| `--teal` | `#3ecfb2` | Status: alive / actief / positief |
| `--crimson` | `#ff6b6b` | Status: gevaar / kritiek HP |
| `--azure` | `#6ba7ff` | Status: informationeel |
| `--ink` | `#f0ecf7` | Hoge nadruk tekst |
| `--ink-soft` | `#c8c2dc` | Body tekst |
| `--muted` | `#8079a0` | Labels, eyebrows |
| `--subtle` | `#4a4565` | Uitgeschakeld, toekomstig |
| `--hairline` | `rgba(155,138,255,0.14)` | Standaard borders |
| `--hairline-strong` | `rgba(155,138,255,0.28)` | Sterkere borders |

**Accentvarianten** — via `data-accent` attribuut op `:root`:
- `violet` (default) · `teal` · `gold` · `azure` · `crimson`

**Densiteitsmodi** — via `data-density` op `:root`:
- `standard` (default) · `compact` · `cozy`

### Typografie

| Lettertype | Gebruik |
|---|---|
| **Cinzel** | Display headings, titels, hoofdletters, tracked — de "gesneden steen" |
| **Manrope** | Body copy, labels, knoppen, navigatie, formuliervelden |
| **Cormorant Garamond Italic** | Motto's, AI-gegenereerde lore, quotes — altijd italics |
| **JetBrains Mono** | Getallen, dobbelsteenwaarden, sessie-klok, schatten |

Een 1px gouden horizontale lijn vóór elke eyebrow is een systeem-handtekening: `<div style="width:36px;height:1px;background:var(--gold)"/>`.

### 3-laagse achtergrond

Elk scherm heeft:
1. `.starfield-bg` — vaste radiale gradient (violet gloed boven, goud rechtsonder) over `--void`
2. `.starfield-stars` — inline SVG met 80–220 sterren (6% gouden "kruisdraad" sterren)
3. `.grain` — SVG fractal-noise overlay op 4% opacity, `mix-blend-mode: overlay`

Kaarten zijn altijd **opaque** (nooit transparant) — de achtergrond wordt gevoeld, niet doorgezien.

### Spacing & radii

Strikte 4-punt schaal: `--sp-1` (4px) t/m `--sp-20` (80px).  
Radii: `--r-xs` (4px) · `--r-sm` (8px) · `--r` (12px) · `--r-md` (16px) · `--r-lg` (20px) · `--r-xl` (28px) · `--r-full` (9999px).

---

## Shell components (blauwdruk voor productie)

Alle componenten in `shell.jsx` zijn de visuele referentie. Bouw productie-versies in TypeScript + Tailwind op basis hiervan.

| Component | Props / gebruik | Beschrijving |
|---|---|---|
| `<Starfield density="subtle\|full\|off" />` | — | SVG sterrenveld (80–220 sterren), fixed achtergrondlaag |
| `<CosmicImg glyph label ratio accent />` | — | Algoritmische nevel-placeholder voor afwezig artwork; altijd gebruiken in plaats van lege ruimte of hand-getekende illustraties |
| `<Navigation route navigate />` | — | 240px left rail op desktop; 64px bottom bar < 900px |
| `<Icon name size stroke />` | `name`: één van 30+ glyphs | Inline SVG lijn-icoon, 24×24, stroke 1.6, `currentColor` |
| `<OrnateDivider label glyph />` | — | Systeem-handtekening sectie-breuk: gradient lijn + pill-label in goud (`✦ Label ✦`) |
| `<CompassRose size opacity />` | — | SVG versiering voor hero-secties en lege staten |
| `<Modal title onClose />` | — | Dialog met `rgba(10,10,20,0.7)` backdrop + `backdrop-filter: blur(8px)` |
| `<PageHeader eyebrow title description action />` | — | Consistente paginatop met 1px gouden regel vóór eyebrow |

### Beschikbare iconen (`<Icon name="…" />`)

`home` · `users` · `compass` · `compass-alt` · `skull` · `cog` · `sparkles` · `plus` · `search` · `arrow-left` · `arrow-right` · `chevron-right` · `chevron-down` · `play` · `pause` · `heart` · `shield` · `swords` · `dice` · `map-pin` · `book` · `edit` · `trash` · `check` · `x` · `sun` · `moon` · `send` · `zap` · `crown` · `feather` · `eye` · `globe` · `pen`

---

## Widgets (specialistische componenten)

| Component | Beschrijving |
|---|---|
| `InitiativeWheel` | Radiaal combat-volgorde wiel |
| `ChapterSpine` | Verticale hoofdstuk-progressie indicator |
| `ConstellationMap` | Interactieve sterrenkaart van locaties |
| `DiceRoller` | d20 roller met animatie (`d20-tumble`, 0.7s preserve-3d rotatie) |
| `PartyTile` | Karakter-kaart in party-overzicht |
| `QuestList` | Quest samenvatting/tracker |
| `NpcCard` | NPC portret + details |

---

## Design regels

### Voice — de katheder, niet het chatvenster

Copy klinkt als een geleerde verteller die over je schouder fluistert.

- **Tijd**: tegenwoordige tijd, vaak imperatief. *"Waar zullen we zwerven?"* niet *"Wat wil je doen?"*
- **Register**: licht archaïsch en versierd, nooit stijf. *"Een pact gesneden in dwergsteen"* over *"Een campagne over dwergen."*
- **Motto's**: elke campaign en wereld heeft een korte cursieve motto. Motto's zijn de kaft van het boek.
- **Lege staten**: een uitnodiging, nooit een verontschuldiging. *"Een leeg kosmos wacht."*
- **Knoppen**: werkwoorden, soms archaïsch. *"Smeed een Wereld. Roep op. Voer Sessie Uit."*
- **Hoofdletters**: display headings zijn HOOFDLETTERS met extra letter-spacing; body copy is zin-hoofd. Eyebrows en labels zijn HOOFDLETTERS + tracked, goud.

### Wat nooit gebruikt wordt

- **Geen emoji** — gebruik unicode-ornamenten spaarzaam als versiering (`✦ ❀ ☾ ❦ ⚒`), nooit als actiepictogrammen
- **Geen hardcoded hex-waarden** in componenten — altijd via CSS custom properties (`var(--violet)`, `var(--gold)`)
- **Geen illustraties** — gebruik `<CosmicImg>` als placeholder totdat echte artwork beschikbaar is

### Kleuren correct toepassen

- **Violet** → primaire interactie (CTA-achtergronden, focus rings, actieve tabs, hover-glows)
- **Goud** → ceremonieel (eyebrows, badges, dividers, `OrnateDivider`)
- **Teal / crimson / azure** → uitsluitend voor status-semantiek
- **Borders** → altijd `var(--hairline)` (laag-opacity violet), nooit grijze lijnen

---

## Kwaliteitsstandaarden

### TypeScript

- Strict mode altijd aan — geen `any`, geen `@ts-ignore` zonder uitleg
- Alle props en return types expliciet getypeerd
- Zod schema's genereren de TypeScript types via `z.infer<>`
- Services exporteren types uit `types.ts`, niet inline

### Componenten

- Max ~150 regels per component — splits grotere componenten op
- Geen business logica in presentationele componenten — gebruik hooks
- Geen directe Supabase-calls in componenten — altijd via service
- Geen conditionele hook calls (React rules of hooks)

### Forms

Gebruik altijd `Field` van `src/components/Field.tsx`:

```tsx
import { Field, inputClass } from '@/components/Field'

<Field label="Naam" error={errors.name?.message ?? null} required>
  <input {...register('name')} className={inputClass(!!errors.name)} />
</Field>
```

- Validatie via Zod schema + `react-hook-form`
- Disabled state op submit knop tijdens `isSubmitting`
- Foutmeldingen via `aria-describedby` (geregeld door `Field`)

### Logging

```typescript
// Formaat: [Module/ComponentName] beschrijving, { relevante: data }
console.log('[WorldService] createWorld aangeroepen', { name, userId })
console.log('[WorldService] createWorld geslaagd', { worldId: result.id })
console.error('[WorldService] createWorld mislukt', error, { name, userId })
```

- Services loggen bij aanvang, succes én fout van elke operatie
- **Nooit** wachtwoorden, tokens, API keys of volledige PII loggen — alleen IDs

### Toasts

```typescript
import { toast } from 'sonner'
toast.success('Opgeslagen')
toast.error('Mislukt', { description: err.message })
toast.promise(asyncOp(), { loading: '…', success: '…', error: '…' })
```

### A11Y

Elke feature moet deze checklist halen:

- [ ] Tekstcontrast ≥ 4.5:1; UI component contrast ≥ 3:1 (WCAG 1.4.11)
- [ ] Focus ring zichtbaar op alle interactieve elementen
- [ ] Semantisch HTML (`nav`, `main`, `header`, `section`, `button` etc.)
- [ ] Forms: velden gekoppeld via `htmlFor`/`id`; fouten via `aria-describedby`
- [ ] Icon-only knoppen hebben `aria-label`; decoratieve SVGs hebben `aria-hidden="true"`
- [ ] Touch targets ≥ 44×44px; `prefers-reduced-motion` gerespecteerd
- [ ] Modals hebben `role="dialog"` + `aria-modal="true"` + focus trap

---

## Environment variabelen

Kopieer `.env.example` naar `.env.local` (nooit gecommit).

| Variabele | Kant | Notities |
|---|---|---|
| `VITE_SUPABASE_URL` | client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | client | Supabase anon/public key |
| `VITE_API_BASE_URL` | client | Default `http://localhost:3000` in dev |
| `ANTHROPIC_API_KEY` | server only | Fallback voor `api/agent.ts` |

---

## Implementatie-status

### Aanwezig (design system prototype)

- Volledig uitgewerkt visueel systeem: kleuren, typografie, spacing, iconen, componenten
- Alle hoofdschermen als clickable prototype: Dashboard, Worlds, Campaigns, Characters, Session, Bestiary, Settings
- Combat tracker (InitiativeWheel, live HP tracking)
- ConstellationMap voor locaties
- Tweaks panel (accent, density, starfield, grain)
- Mock data voor D&D 5e werelden, campaigns, NPCs, monsters

### Te bouwen (productie-app)

- [ ] Vite + TypeScript project setup (`src/` directory structuur)
- [ ] vite-plugin-pwa configuratie (manifest + service worker)
- [ ] Supabase auth (login, sessie, RLS)
- [ ] Database schema + migrations
- [ ] Feature implementaties: Worlds, Campaigns, Sessions, Characters, NPCs, Quests, Lore, Combat
- [ ] AI-integratie via `api/agent.ts`
- [ ] Productie-versies van shell components in TypeScript
