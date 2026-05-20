/* Pangu v2 — App: hash router + tweaks panel wiring */

const { useState: useStateA, useEffect: useEffectA } = React;

// Hash-based routing
function useHashRoute() {
  const [route, setRoute] = useStateA(() => {
    const h = window.location.hash.slice(1);
    return h || '/';
  });

  useEffectA(() => {
    const onChange = () => {
      const h = window.location.hash.slice(1);
      setRoute(h || '/');
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return [route, navigate];
}

function matchRoute(route) {
  if (route === '/' || route === '') return { name: 'dashboard', params: {} };
  let m;
  if ((m = route.match(/^\/campaign\/([^/]+)$/))) return { name: 'campaign-detail', params: { id: m[1] } };
  if ((m = route.match(/^\/session\/([^/]+)$/))) return { name: 'session', params: { id: m[1] } };
  if ((m = route.match(/^\/world-builder\/([^/]+)$/))) return { name: 'world-builder', params: { id: m[1] } };
  if ((m = route.match(/^\/world\/([^/]+)$/))) return { name: 'world-detail', params: { id: m[1] } };
  if ((m = route.match(/^\/character\/([^/]+)$/))) return { name: 'character-detail', params: { id: m[1] } };
  if (route === '/campaigns') return { name: 'campaigns', params: {} };
  if (route === '/characters') return { name: 'characters', params: {} };
  if (route === '/worlds') return { name: 'worlds', params: {} };
  if (route === '/atlas') return { name: 'world', params: {} };
  if (route === '/bestiary') return { name: 'bestiary', params: {} };
  if (route === '/settings') return { name: 'settings', params: {} };
  return { name: 'dashboard', params: {} };
}

// ═══════════════════════════════════════════════════════════════════
//  TWEAK DEFAULTS
// ═══════════════════════════════════════════════════════════════════
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "violet",
  "density": "standard",
  "starfield": "subtle",
  "grain": true,
  "uppercaseDisplay": true,
  "heroLayout": "split",
  "diceStyle": "tumble"
}/*EDITMODE-END*/;

// ═══════════════════════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════════════════════
function App() {
  const [route, navigate] = useHashRoute();
  const matched = matchRoute(route);
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to root
  useEffectA(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', t.accent);
    root.setAttribute('data-density', t.density);
    root.setAttribute('data-grain', t.grain ? 'on' : 'off');
    root.setAttribute('data-uppercase', t.uppercaseDisplay ? 'on' : 'off');
  }, [t.accent, t.density, t.grain, t.uppercaseDisplay]);

  let page;
  switch (matched.name) {
    case 'dashboard': page = <Dashboard navigate={navigate} />; break;
    case 'worlds': page = <WorldsOverview navigate={navigate} />; break;
    case 'world-detail': page = <WorldDetail navigate={navigate} params={matched.params} />; break;
    case 'campaigns': page = <CampaignsOverview navigate={navigate} />; break;
    case 'campaign-detail': page = <CampaignDetail navigate={navigate} params={matched.params} />; break;
    case 'session': page = <SessionView navigate={navigate} params={matched.params} />; break;
    case 'world-builder': page = <WorldBuilder navigate={navigate} params={matched.params} />; break;
    case 'characters': page = <CharactersOverview navigate={navigate} />; break;
    case 'character-detail': page = <CharacterDetail navigate={navigate} params={matched.params} />; break;
    case 'world': page = <WorldPage navigate={navigate} />; break;
    case 'bestiary': page = <Bestiary navigate={navigate} />; break;
    case 'settings': page = <SettingsPage />; break;
    default: page = <Dashboard navigate={navigate} />;
  }

  return (
    <>
      <div className="starfield-bg"/>
      <Starfield density={t.starfield}/>
      <div className="grain"/>
      <div className="shell">
        <Navigation route={route} navigate={navigate}/>
        <main className="shell-main">
          {page}
        </main>
      </div>
      <PanguTweaks t={t} setTweak={setTweak}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  WORLD PAGE (cross-campaign atlas)
// ═══════════════════════════════════════════════════════════════════
function WorldPage({ navigate }) {
  const { LOCATIONS, CAMPAIGNS } = window.PANGU_DATA;
  const [campaign, setCampaign] = useStateA('phandelver');
  const [selected, setSelected] = useStateA(null);
  const locs = LOCATIONS.filter(l => l.campaignId === campaign);

  return (
    <div className="page-enter page-max" data-screen-label="World">
      <PageHeader
        eyebrow="Atlas of the kingdoms"
        title="The World"
        description="Where your stories live. Every star is a place; every line, a road or a rumour."
        action={<button className="btn btn-primary btn-lg"><Icon name="plus" size={14}/> Add Location</button>}
      />

      {/* Campaign tabs */}
      <div className="tab-bar mb-8" style={{ maxWidth: 720 }}>
        {CAMPAIGNS.map(c => (
          <button key={c.id} className="tab" aria-selected={campaign === c.id} onClick={() => { setCampaign(c.id); setSelected(null); }}>
            {c.name.split(' ').slice(0, 3).join(' ')}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 32 }}>
        <ConstellationMap locations={locs} height={560} selectedId={selected?.id} onSelect={setSelected}/>
        <div className="surface" style={{ padding: 24 }}>
          {selected ? (
            <div className="fade-in">
              <span className="badge badge-violet">{selected.type}</span>
              <h3 className="display mt-3" style={{ fontSize: 24 }}>{selected.name}</h3>
              <div className="micro mt-1">{selected.region}</div>
              <p className="quote mt-4">"{selected.desc}"</p>
              <div className="grid mt-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><div className="micro">Population</div><div className="heading mt-1">{selected.population}</div></div>
                <div><div className="micro">Climate</div><div className="heading mt-1">{selected.climate}</div></div>
              </div>
              {selected.notes && <div className="mt-5 small" style={{ padding: 12, background: 'var(--void-2)', borderRadius: 'var(--r-xs)', borderLeft: '2px solid var(--gold)' }}>{selected.notes}</div>}
            </div>
          ) : (
            <>
              <div className="eyebrow eyebrow-muted">{locs.length} locations</div>
              <p className="small mt-2 mb-4">Tap a star on the map.</p>
              <div className="flex flex-col gap-2">
                {locs.map(l => (
                  <button key={l.id} className="forge-history" onClick={() => setSelected(l)}>
                    <Icon name="map-pin" size={14}/>
                    <span style={{ flex: 1, textAlign: 'left' }}>{l.name}</span>
                    <span className="micro">{l.type}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <OrnateDivider label="All Locations"/>

      <div className="locations-grid">
        {locs.map(l => (
          <button key={l.id} className="loc-mini clickable" onClick={() => setSelected(l)} style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', width: '100%', textAlign: 'left' }}>
            <div className="loc-mini-art">
              <CosmicImg glyph={l.name[0]} ratio="3/2"/>
              <span className="badge badge-violet" style={{ position: 'absolute', top: 10, left: 10 }}>{l.type}</span>
            </div>
            <div className="loc-mini-body">
              <div className="heading">{l.name}</div>
              <div className="micro mt-1">{l.region}</div>
              <p className="small mt-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TWEAKS PANEL
// ═══════════════════════════════════════════════════════════════════
function PanguTweaks({ t, setTweak }) {
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle, TweakSelect } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Identity">
        <TweakColor label="Accent" value={t.accent}
          options={[
            { value: 'violet', color: '#9b8aff' },
            { value: 'teal', color: '#3ecfb2' },
            { value: 'gold', color: '#f5c842' },
            { value: 'azure', color: '#6ba7ff' },
            { value: 'crimson', color: '#ff6b6b' },
          ]}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakToggle label="Uppercase display headings" value={t.uppercaseDisplay} onChange={(v) => setTweak('uppercaseDisplay', v)} />
      </TweakSection>

      <TweakSection title="Cosmos">
        <TweakRadio label="Starfield" value={t.starfield} options={['off', 'subtle', 'full']} onChange={(v) => setTweak('starfield', v)} />
        <TweakToggle label="Film grain" value={t.grain} onChange={(v) => setTweak('grain', v)} />
      </TweakSection>

      <TweakSection title="Layout">
        <TweakRadio label="Density" value={t.density} options={['compact', 'standard', 'cozy']} onChange={(v) => setTweak('density', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Render
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
