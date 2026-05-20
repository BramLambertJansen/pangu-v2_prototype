/* Pangu v2 — Dashboard landing, Worlds overview, World detail */

const { useState: useStateD, useMemo: useMemoD } = React;

// ════════════════════════════════════════════════════════════════════
//  DASHBOARD — landing
//  "Where shall we wander?"  Continue · Worlds · Chronicles · Oneshots
// ════════════════════════════════════════════════════════════════════
function Dashboard({ navigate }) {
  const { WORLDS, CAMPAIGNS, CHARACTERS } = window.PANGU_DATA;

  // The "continue" target — the active campaign with most recent play.
  // For mock-data, use Phandelver (chapter 4, current).
  const lastCampaign = CAMPAIGNS.find(c => c.id === 'phandelver');
  const lastWorld = WORLDS.find(w => w.id === lastCampaign.worldId);
  const lastParty = CHARACTERS.filter(ch => ch.campaignId === lastCampaign.id);

  const oneshots = CAMPAIGNS.filter(c => c.type === 'oneshot');
  const ongoing = CAMPAIGNS.filter(c => c.type !== 'oneshot');

  return (
    <div className="page-enter page-max" data-screen-label="Dashboard">
      {/* Greeting */}
      <header className="dash-greeting">
        <div className="flex items-center gap-3 mb-4">
          <div style={{ height: 1, width: 36, background: 'var(--gold)' }}/>
          <div className="eyebrow">Welcome back, Dungeon Master</div>
        </div>
        <h1 className="display-xl" style={{ textTransform: 'uppercase', marginBottom: 14 }}>Where shall we wander?</h1>
        <p className="body-lg" style={{ maxWidth: 620 }}>
          {WORLDS.length} worlds, {ongoing.length} open chronicles, {oneshots.length} one-night tale awaiting a first roll.
        </p>
      </header>

      {/* CONTINUE — hero resume card */}
      <ContinueCard campaign={lastCampaign} world={lastWorld} party={lastParty} navigate={navigate} />

      {/* WORLDS */}
      <OrnateDivider label="Your Worlds"/>

      <div className="dash-section-head">
        <div>
          <div className="eyebrow eyebrow-violet">The cradle of every story</div>
          <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Pick a world</h2>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/worlds')}>
          All worlds <Icon name="arrow-right" size={13}/>
        </button>
      </div>

      <div className="worlds-grid mt-6">
        {WORLDS.map(w => (
          <WorldCard key={w.id} world={w} campaigns={CAMPAIGNS.filter(c => c.worldId === w.id)} onClick={() => navigate(`/world/${w.id}`)} navigate={navigate} />
        ))}
        <button className="world-card world-card-forge clickable" onClick={() => navigate('/worlds')}>
          <div className="forge-orb">
            <CompassRose size={56} opacity={0.7}/>
          </div>
          <div className="title mt-5" style={{ fontSize: 13, letterSpacing: '0.24em', color: 'var(--gold)' }}>FORGE A WORLD</div>
          <div className="small mt-2">A blank kosmos awaits.</div>
        </button>
      </div>

      {/* OPEN CHRONICLES */}
      <OrnateDivider label="Open Chronicles" glyph="❀"/>

      <div className="dash-section-head">
        <div>
          <div className="eyebrow eyebrow-violet">Stories you keep</div>
          <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Or pick up a campaign</h2>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')}>
          All campaigns <Icon name="arrow-right" size={13}/>
        </button>
      </div>

      <div className="dash-chronicle-grid mt-6">
        {ongoing.map(c => (
          <ChronicleRow key={c.id} campaign={c} world={WORLDS.find(w => w.id === c.worldId)} navigate={navigate} />
        ))}
      </div>

      {/* ONESHOTS */}
      {oneshots.length > 0 && (
        <>
          <OrnateDivider label="One-Night Tales" glyph="☾"/>

          <div className="dash-section-head">
            <div>
              <div className="eyebrow eyebrow-violet">Standalone stories</div>
              <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>A single sitting</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')}>
              <Icon name="plus" size={13}/> New oneshot
            </button>
          </div>

          <div className="dash-oneshot-grid mt-6">
            {oneshots.map(c => (
              <OneshotCard key={c.id} campaign={c} navigate={navigate} />
            ))}
            <button className="oneshot-card oneshot-card-add clickable" onClick={() => navigate('/campaigns')}>
              <Icon name="plus" size={20}/>
              <div className="title mt-3" style={{ fontSize: 12, letterSpacing: '0.22em' }}>NEW ONESHOT</div>
              <div className="small mt-1">One sitting, one tale.</div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  ContinueCard — big hero resume
// ────────────────────────────────────────────────────────────────────
function ContinueCard({ campaign, world, party, navigate }) {
  const c = campaign;
  const progress = Math.round((c.chapter / c.chapterTotal) * 100);
  return (
    <section className="continue-card mt-10" style={{ '--accent': c.accent }}>
      <div className="continue-card-art">
        <CosmicImg glyph={c.glyph} accent={c.accent} ratio="3/2"/>
        <div className="continue-card-overlay"/>
        <div className="continue-card-stamp">
          <div className="micro" style={{ color: 'var(--gold)' }}>CHAPTER</div>
          <div className="font-display" style={{ fontSize: 36, color: 'var(--gold)', lineHeight: 1 }}>{toRomanD(c.chapter)}</div>
          <div className="micro" style={{ color: 'var(--ink-soft)', marginTop: 4 }}>of {toRomanD(c.chapterTotal)}</div>
        </div>
      </div>

      <div className="continue-card-body">
        <div className="continue-card-eyebrow">
          <span className="badge badge-teal" style={{ animation: 'pulse-glow 2.4s infinite' }}>● WHERE WE LEFT OFF</span>
          <span className="micro" style={{ color: 'var(--muted)' }}>{c.lastPlayedLabel}</span>
        </div>

        <div className="flex items-center gap-2 mt-5" style={{ flexWrap: 'wrap' }}>
          <button className="micro-link" onClick={() => navigate(`/world/${world.id}`)}>
            <span style={{ width: 8, height: 8, background: world.accent, borderRadius: 999, display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}/>
            {world.name}
          </button>
          <span className="micro" style={{ color: 'var(--muted)' }}>›</span>
          <span className="micro" style={{ color: 'var(--ink-soft)' }}>{c.setting}</span>
        </div>

        <h2 className="display-lg mt-3" style={{ textTransform: 'uppercase' }}>{c.name}</h2>
        <div className="kicker mt-2" style={{ color: 'var(--gold)' }}>Chapter {c.chapter} · {c.chapterName}</div>

        {c.lastNote && (
          <p className="quote mt-5" style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 560 }}>"{c.lastNote}"</p>
        )}

        <div className="continue-card-meta mt-6">
          <div>
            <div className="micro">Sessions</div>
            <div className="heading mt-1" style={{ fontSize: 18 }}>{c.sessionCount}</div>
          </div>
          <div>
            <div className="micro">Playtime</div>
            <div className="heading mt-1" style={{ fontSize: 18 }}>{c.playtimeHours}h</div>
          </div>
          <div>
            <div className="micro">Party</div>
            <div className="heading mt-1" style={{ fontSize: 18 }}>{party.length}</div>
          </div>
          <div>
            <div className="micro">Next session</div>
            <div className="heading mt-1" style={{ fontSize: 14, color: 'var(--gold)' }}>{c.nextSession}</div>
          </div>
        </div>

        <div className="continue-card-bar mt-6">
          <div className="flex justify-between" style={{ marginBottom: 6 }}>
            <span className="micro">Progress</span>
            <span className="micro" style={{ color: 'var(--gold)' }}>{progress}%</span>
          </div>
          <div className="campaign-card-bar"><div className="campaign-card-bar-fill" style={{ width: `${progress}%` }}/></div>
        </div>

        <div className="flex gap-3 mt-8 flex-wrap">
          <button className="btn btn-primary btn-lg" onClick={() => navigate(`/session/${c.id}`)}>
            <Icon name="play" size={14}/> Resume Session
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate(`/campaign/${c.id}`)}>
            <Icon name="book" size={14}/> Open Chronicle
          </button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
//  WorldCard
// ────────────────────────────────────────────────────────────────────
function WorldCard({ world, campaigns, onClick, navigate }) {
  const w = world;
  const isEmpty = campaigns.length === 0;
  return (
    <div className="world-card" style={{ '--accent': w.accent }}>
      {/* Art banner — klikbaar, navigeert naar world detail */}
      <div className="world-card-art clickable" onClick={onClick}>
        <CosmicImg glyph={w.glyph} accent={w.accent} ratio="2/1"/>
        <div className="world-card-art-fade"/>
        <span className="badge badge-solid-gold world-card-year">{w.yearLabel}</span>
      </div>

      {/* Gecentreerde content */}
      <div className="world-card-body">
        {/* Eyebrow met gouden lijnen aan beide kanten */}
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)', flexShrink: 0 }}/>
          <span className="eyebrow eyebrow-violet" style={{ fontSize: 10 }}>{w.eraName}</span>
          <div style={{ width: 24, height: 1, background: 'var(--gold)', flexShrink: 0 }}/>
        </div>

        <h3 className="display clickable" style={{ fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }} onClick={onClick}>{w.name}</h3>

        <p className="quote" style={{ fontSize: 14, marginBottom: 12 }}>"{w.motto}"</p>
        <p className="small" style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 22 }}>{w.description}</p>

        <div style={{ height: 1, background: 'var(--hairline)', marginBottom: 20, width: '100%' }}/>

        {/* Stats */}
        <div className="world-card-stats">
          <div className="world-card-stat">
            <div className="font-display" style={{ fontSize: 26, lineHeight: 1 }}>{campaigns.length}</div>
            <div className="micro mt-2">CHRONICLES</div>
          </div>
          <div className="world-card-stat-sep"/>
          <div className="world-card-stat">
            <div className="font-display" style={{ fontSize: 26, lineHeight: 1 }}>{w.locations}</div>
            <div className="micro mt-2">LOCATIONS</div>
          </div>
          <div className="world-card-stat-sep"/>
          <div className="world-card-stat">
            <div className="font-display" style={{ fontSize: 26, lineHeight: 1 }}>{w.npcs}</div>
            <div className="micro mt-2">LIVING CAST</div>
          </div>
        </div>

        {/* Knoppen */}
        <div className="flex gap-3 mt-6 items-center justify-center flex-wrap">
          <button className="btn btn-primary world-card-btn" onClick={e => { e.stopPropagation(); onClick(); }}>
            <Icon name="plus" size={13}/> New Chronicle
          </button>
          <button className="btn btn-ghost world-card-btn world-card-lore-btn" onClick={e => e.stopPropagation()}>
            <Icon name="sparkles" size={13} style={{ color: 'var(--gold)' }}/> Lore Forge
          </button>
          <button className="btn btn-ghost world-card-edit-btn" aria-label="Edit world" onClick={e => e.stopPropagation()}>
            <Icon name="edit" size={15}/>
          </button>
        </div>

        {/* Active Chronicles — links uitgelijnd binnen gecentreerde body */}
        {!isEmpty && (
          <div className="mt-6" style={{ width: '100%' }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: 20, height: 1, background: 'var(--hairline-strong)', flexShrink: 0 }}/>
              <span className="eyebrow eyebrow-muted" style={{ fontSize: 10 }}>ACTIVE CHRONICLES</span>
              <div style={{ width: 20, height: 1, background: 'var(--hairline-strong)', flexShrink: 0 }}/>
            </div>
            {campaigns.slice(0, 3).map(c => (
              <button
                key={c.id}
                className="world-card-chronicle-row clickable"
                onClick={e => { e.stopPropagation(); navigate ? navigate(`/campaign/${c.id}`) : onClick(); }}
              >
                <span className="world-card-chronicle-dot" style={{ background: c.accent }}/>
                <span className="world-card-chronicle-name">{c.name}</span>
                <Icon name="chevron-right" size={14}/>
              </button>
            ))}
          </div>
        )}

        {isEmpty && (
          <p className="mt-5 small" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Een leeg kosmos wacht.</p>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
//  ChronicleRow — open campaign, compact
// ────────────────────────────────────────────────────────────────────
function ChronicleRow({ campaign, world, navigate }) {
  const c = campaign;
  const progress = Math.round((c.chapter / c.chapterTotal) * 100);
  return (
    <button className="chronicle-row clickable" onClick={() => navigate(`/campaign/${c.id}`)} style={{ '--accent': c.accent }}>
      <div className="chronicle-row-art">
        <CosmicImg glyph={c.glyph} accent={c.accent} ratio="1/1"/>
      </div>
      <div className="chronicle-row-body">
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {world && (
            <span className="chip chip-bullet" style={{ '--bullet': world.accent }}>{world.name}</span>
          )}
          <span className="micro" style={{ color: 'var(--muted)' }}>{c.lastPlayedLabel}</span>
          <span className={`badge ${c.status === 'active' ? 'badge-teal' : 'badge-outline'}`} style={{ marginLeft: 'auto' }}>{c.status}</span>
        </div>
        <h3 className="display mt-2" style={{ fontSize: 22 }}>{c.name}</h3>
        <div className="kicker mt-1" style={{ fontSize: 11, color: 'var(--gold)' }}>CH. {c.chapter} · {c.chapterName}</div>

        <div className="campaign-card-bar mt-4"><div className="campaign-card-bar-fill" style={{ width: `${progress}%` }}/></div>

        <div className="flex items-center gap-4 mt-4" style={{ flexWrap: 'wrap' }}>
          <div className="flex items-center gap-1 micro"><Icon name="users" size={12}/> {c.playerCount}</div>
          <div className="flex items-center gap-1 micro"><Icon name="book" size={12}/> {c.sessionCount} sessions</div>
          <div className="flex items-center gap-1 micro"><Icon name="map-pin" size={12}/> {c.locations} locs</div>
        </div>
      </div>
      <div className="chronicle-row-cta">
        <span className="btn-icon-arrow"><Icon name="arrow-right" size={16}/></span>
      </div>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────
//  OneshotCard
// ────────────────────────────────────────────────────────────────────
function OneshotCard({ campaign, navigate }) {
  const c = campaign;
  return (
    <button className="oneshot-card clickable" onClick={() => navigate(`/campaign/${c.id}`)} style={{ '--accent': c.accent }}>
      <div className="oneshot-card-header">
        <span className="badge badge-outline" style={{ borderColor: c.accent, color: c.accent }}>ONESHOT</span>
        <span className="micro" style={{ color: 'var(--gold)' }}>{c.nextSession}</span>
      </div>
      <div className="oneshot-card-glyph" style={{ color: c.accent }}>{c.glyph}</div>
      <h3 className="display" style={{ fontSize: 20, marginTop: 12 }}>{c.name}</h3>
      <p className="quote mt-2" style={{ fontSize: 14 }}>"{c.motto}"</p>
      <div className="micro mt-4" style={{ color: 'var(--ink-soft)' }}>{c.setting}</div>
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
//  WORLDS OVERVIEW — all worlds, grid
// ════════════════════════════════════════════════════════════════════
function WorldsOverview({ navigate }) {
  const { WORLDS, CAMPAIGNS } = window.PANGU_DATA;
  return (
    <div className="page-enter page-max" data-screen-label="Worlds">
      <PageHeader
        eyebrow="The cradle of every story"
        title="Worlds"
        description="A world is where everything lives — the cities, the lonely roads, the people, and the beasts. Choose one to enter."
        action={
          <button className="btn btn-primary btn-lg">
            <Icon name="plus" size={14}/> Forge a World
          </button>
        }
      />

      <OrnateDivider label="Known Worlds"/>

      <div className="worlds-grid">
        {WORLDS.map(w => (
          <WorldCard key={w.id} world={w} campaigns={CAMPAIGNS.filter(c => c.worldId === w.id)} onClick={() => navigate(`/world/${w.id}`)} navigate={navigate} />
        ))}
        <button className="world-card world-card-forge clickable">
          <div className="forge-orb">
            <CompassRose size={56} opacity={0.7}/>
          </div>
          <div className="title mt-5" style={{ fontSize: 13, letterSpacing: '0.24em', color: 'var(--gold)' }}>FORGE A WORLD</div>
          <div className="small mt-2">A blank kosmos awaits.</div>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  WORLD DETAIL — one world's atlas + campaigns inside it
// ════════════════════════════════════════════════════════════════════
function WorldDetail({ navigate, params }) {
  const { WORLDS, CAMPAIGNS, LOCATIONS, NPCS } = window.PANGU_DATA;
  const w = WORLDS.find(x => x.id === params.id);
  const [selected, setSelected] = useStateD(null);

  if (!w) {
    return (
      <div className="page-max page-enter text-center" style={{ paddingTop: 80 }}>
        <h1 className="display">World not found</h1>
        <button className="btn btn-ghost mt-6" onClick={() => navigate('/worlds')}>← Back to worlds</button>
      </div>
    );
  }

  const camps = CAMPAIGNS.filter(c => c.worldId === w.id);
  const campIds = new Set(camps.map(c => c.id));
  const locs = LOCATIONS.filter(l => campIds.has(l.campaignId));
  const npcs = NPCS.filter(n => campIds.has(n.campaignId));

  return (
    <div className="page-enter page-max" data-screen-label="World Detail">
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate('/worlds')}>
        <Icon name="arrow-left" size={14}/> All worlds
      </button>

      {/* World hero */}
      <section className="world-hero" style={{ '--accent': w.accent, '--accent-2': w.secondary }}>
        <div className="world-hero-art">
          <CosmicImg glyph={w.glyph} accent={w.accent} ratio="3/2"/>
          <div className="world-hero-overlay"/>
        </div>
        <div className="world-hero-body">
          <div className="campaign-hero-eyebrow">
            <span className="kicker">{w.eraName}</span>
            <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
            <span className="badge badge-solid-gold">{w.yearLabel}</span>
          </div>

          <h1 className="display-xl glow-violet" style={{ textTransform: 'uppercase', marginBottom: 16 }}>{w.name}</h1>
          <div className="campaign-hero-motto"><span>"</span>{w.motto}<span>"</span></div>
          <p className="body-lg mt-6" style={{ maxWidth: 680 }}>{w.description}</p>

          <div className="world-hero-meta mt-8">
            <div>
              <div className="micro">Chronicles</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--gold)', marginTop: 2 }}>{camps.length}</div>
            </div>
            <div>
              <div className="micro">Locations</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 2 }}>{w.locations}</div>
            </div>
            <div>
              <div className="micro">Living cast</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 2 }}>{w.npcs}</div>
            </div>
            <div>
              <div className="micro">Last visited</div>
              <div className="font-display" style={{ fontSize: 18, color: 'var(--gold)', marginTop: 6 }}>{w.lastVisited}</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-8">
            <button className="btn btn-primary btn-lg">
              <Icon name="plus" size={14}/> New Chronicle in {w.name}
            </button>
            <button className="btn btn-gold btn-lg">
              <Icon name="sparkles" size={14}/> Lore Forge
            </button>
            <button className="btn btn-ghost btn-lg"><Icon name="edit" size={14}/> Edit World</button>
          </div>
        </div>
      </section>

      {/* Chronicles inside this world */}
      <OrnateDivider label="Chronicles in this World" glyph="❀"/>

      {camps.length === 0 ? (
        <div className="surface text-center" style={{ padding: 60 }}>
          <CompassRose size={64} opacity={0.4}/>
          <h3 className="display mt-6" style={{ fontSize: 22 }}>No chronicles yet</h3>
          <p className="small mt-2" style={{ maxWidth: 380, margin: '8px auto 0' }}>This world is empty. Begin the first chronicle to plant a seed.</p>
          <button className="btn btn-primary mt-6">
            <Icon name="plus" size={14}/> Begin a chronicle
          </button>
        </div>
      ) : (
        <div className="dash-chronicle-grid">
          {camps.map(c => (
            <ChronicleRow key={c.id} campaign={c} world={w} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Atlas — locations as constellation */}
      {locs.length > 0 && (
        <>
          <OrnateDivider label="The Atlas" glyph="✦"/>

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
        </>
      )}
    </div>
  );
}

function toRomanD(num) {
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let result = ''; for (const [r, v] of map) { while (num >= v) { result += r; num -= v; } } return result || '0';
}

Object.assign(window, { Dashboard, WorldsOverview, WorldDetail });
