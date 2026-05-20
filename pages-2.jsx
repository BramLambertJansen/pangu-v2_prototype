/* Pangu v2 — Pages: Session, WorldBuilder, Characters, CharacterDetail, Bestiary, Settings */

const { useState: useStateP2, useEffect: useEffectP2, useMemo: useMemoP2 } = React;

// ════════════════════════════════════════════════════════════════════
//  SESSION VIEW — live play / DM dashboard
// ════════════════════════════════════════════════════════════════════
function SessionView({ navigate, params }) {
  const { CAMPAIGNS, CHARACTERS, NPCS } = window.PANGU_DATA;
  const c = CAMPAIGNS.find(x => x.id === params.id);
  const chars = CHARACTERS.filter(x => x.campaignId === params.id);
  const npcs = NPCS.filter(x => x.campaignId === params.id);

  const [time, setTime] = useStateP2(0);
  const [running, setRunning] = useStateP2(true);
  const [notes, setNotes] = useStateP2('The party tracks the Cragmaw raid east, into the pines. Lyria has identified the glow on the recovered map as a moon-marked dwarven rune-key.\n\nKael argues for haste; Thokk for caution. Elowen says the wood is too quiet.\n');
  const [aiSummary, setAiSummary] = useStateP2(null);
  const [summarizing, setSummarizing] = useStateP2(false);

  useEffectP2(() => {
    if (!running) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const doSummarize = () => {
    setSummarizing(true);
    setTimeout(() => {
      setAiSummary('The party broke camp at dawn, tracking the Cragmaw raiders east into the Neverwinter Wood. Lyria identified the glow on the recovered map as moonlit rune-keys of pre-Sundering make. A quiet woodline made Elowen nervous. They have not yet drawn steel today.');
      setSummarizing(false);
    }, 1400);
  };

  if (!c) return null;

  return (
    <div className="page-enter page-max" data-screen-label="Session">
      {/* Top bar */}
      <div className="session-topbar mb-8">
        <div>
          <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(`/campaign/${params.id}`)}>
            <Icon name="arrow-left" size={14}/> Leave Session
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="badge badge-teal" style={{ animation: 'pulse-glow 2s infinite' }}>● LIVE</span>
            <h1 className="display" style={{ fontSize: 30 }}>{c.name}</h1>
            <span className="chip">Session #{c.sessionCount + 1}</span>
          </div>
        </div>
        <div className="session-clock">
          <div>
            <div className="micro">Playtime</div>
            <div className="font-mono" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 700, letterSpacing: '0.04em', marginTop: 2 }}>{fmt(time)}</div>
          </div>
          <div className="session-clock-divider"/>
          <div className="flex gap-2">
            <button className={`btn-icon ${running ? '' : 'pulse-glow'}`} onClick={() => setRunning(!running)}
              style={{ width: 44, height: 44, background: running ? 'transparent' : 'var(--gold)', color: running ? 'var(--ink)' : 'var(--void)', borderRadius: '50%' }}>
              <Icon name={running ? 'pause' : 'play'} size={18}/>
            </button>
            <button className="btn btn-ghost"><Icon name="check" size={14}/> Save</button>
          </div>
        </div>
      </div>

      <div className="grid session-grid">
        {/* LEFT: Party + Notes */}
        <div className="flex flex-col gap-6" style={{ minWidth: 0 }}>
          {/* Party hex strip */}
          <div className="surface" style={{ padding: 20 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="title" style={{ fontSize: 14, letterSpacing: '0.22em' }}>THE PARTY</div>
              <span className="micro">{chars.length} heroes</span>
            </div>
            <div className="party-grid">
              {chars.map(ch => <PartyTile key={ch.id} character={ch} onClick={() => navigate(`/character/${ch.id}`)} />)}
            </div>
          </div>

          {/* Session log */}
          <div className="surface" style={{ padding: 24 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="title" style={{ fontSize: 14, letterSpacing: '0.22em' }}>SESSION LOG</div>
                <div className="small mt-1">Write the story as it unfolds.</div>
              </div>
              <button className="btn btn-violet-soft btn-sm" onClick={doSummarize} disabled={summarizing || !notes}>
                <Icon name="sparkles" size={13}/> {summarizing ? 'Weaving…' : 'AI Chronicle'}
              </button>
            </div>
            <textarea className="textarea session-log" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Notes — what the party did, said, feared, found…"/>

            {aiSummary && (
              <div className="ai-summary mt-5 fade-in">
                <div className="eyebrow eyebrow-violet">AI Chronicle</div>
                <p className="quote mt-2">"{aiSummary}"</p>
                <div className="flex gap-2 mt-4">
                  <button className="btn btn-gold btn-sm">Append to log</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setAiSummary(null)}>Discard</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Initiative Wheel + Dice + NPC */}
        <div className="flex flex-col gap-6" style={{ minWidth: 0 }}>
          <InitiativeWheel/>
          <DiceRoller/>

          <div className="surface" style={{ padding: 16 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="title" style={{ fontSize: 13, letterSpacing: '0.22em' }}>NPCS ON STAGE</div>
              <button className="btn-icon"><Icon name="plus" size={14}/></button>
            </div>
            <div className="flex flex-col gap-2">
              {npcs.slice(0, 3).map(n => <NpcCard key={n.id} npc={n} />)}
            </div>
          </div>

          <div className="surface" style={{ padding: 16, background: 'linear-gradient(180deg, var(--surface), var(--surface-2))', border: '1px solid rgba(245,200,66,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="zap" size={14} stroke={2}/>
              <div className="title" style={{ fontSize: 12, letterSpacing: '0.24em', color: 'var(--gold)' }}>DM QUICK ACTIONS</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {['Random Loot', 'Random Name', 'Weather', 'Random Encounter', 'Background Music', 'Rumour'].map(a => (
                <button key={a} className="btn btn-ghost btn-sm" style={{ fontSize: 10, letterSpacing: '0.12em', padding: '8px 6px' }}>{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  WORLD BUILDER
// ════════════════════════════════════════════════════════════════════
function WorldBuilder({ navigate, params }) {
  const { CAMPAIGNS, LOCATIONS } = window.PANGU_DATA;
  const c = CAMPAIGNS.find(x => x.id === params.id);
  const locs = LOCATIONS.filter(x => x.campaignId === params.id);

  const [prompt, setPrompt] = useStateP2('');
  const [generating, setGenerating] = useStateP2(false);
  const [output, setOutput] = useStateP2(null);
  const [history, setHistory] = useStateP2([]);
  const [selectedLoc, setSelectedLoc] = useStateP2(null);

  const samples = {
    location: { type: 'LOCATION', title: 'The Crystal Hollow of Zil\'mar', body: 'A hidden cave below the bones of the Sword Mountains. Crystals grow from the walls in colours the surface world has no name for. They sing — not loud, but constant, like a memory of music.\n\nIt is watched. An old wyrm of the underdark calls this place its hoard. The crystals are not its treasure; they are its eggs.' },
    npc: { type: 'NPC', title: 'Theron, the Quiet Herbalist', body: 'A halfling of soft voice and softer footfall. Theron runs a kruidenwinkel from a leaning house in Phandalin\'s alley. He knows every secret in town and sells them in three grades: the polite one, the true one, and the one that gets you killed.\n\nHe was, in a former life, the chief alchemist of the Mistral Court. He left when he found out what they were brewing.' },
    quest: { type: 'QUEST', title: 'The Missing Scroll of Oghma', body: 'An aged sage in Phandalin\'s sole library claims a scroll has gone missing — Oghma\'s Catechism of Binding, half-forgotten and twice-locked. Its disappearance was noticed only because a candle in the locked case did not go out.\n\nReward: 500 gp and any one magic item from the sage\'s case.\nLeads: A grey-cloaked figure was seen by the harbour, three nights running.' },
    twist: { type: 'TWIST', title: 'Sildar wears a borrowed face.', body: 'Sildar Hallwinter was killed in the goblin ambush. The Sildar the party walks with is a doppelganger sent by the Black Spider to learn the location of Wave Echo Cave.\n\nIt has learned to mimic him perfectly — except that the real Sildar always spoke of his wife in present tense. This one does not.' },
    rumour: { type: 'RUMOUR', title: 'A rumour the bartender will not share twice.', body: '"The miners up at the Foaming Mug saw the same dwarf twice in one week. Once on Tuesday, drinking and laughing, paying with shaved coin. Once on Sunday, buried in the south churchyard, three years dead."' },
    loot: { type: 'LOOT', title: 'The Marked Coin', body: 'A copper piece with a Zhentarim mark scratched into the rim. Worth nothing. Buys silence in Phandalin from those who know the mark. Buys a knife in the dark from those who fear it.' },
  };

  const generate = (kind) => {
    setGenerating(true);
    setTimeout(() => {
      const data = samples[kind] || { type: 'NOTE', title: 'A new thread', body: `Based on: "${prompt}"\n\nThe stars consult themselves. A new thread is offered for your tapestry.` };
      setOutput(data);
      setHistory(h => [data, ...h].slice(0, 6));
      setGenerating(false);
      setPrompt('');
    }, 1400);
  };

  if (!c) return null;

  return (
    <div className="page-enter page-max" data-screen-label="World Builder">
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate(`/campaign/${c.id}`)}>
        <Icon name="arrow-left" size={14}/> Back to {c.name}
      </button>

      <div className="flex items-center gap-5 mb-12">
        <CompassRose size={72} opacity={0.85}/>
        <div>
          <div className="eyebrow eyebrow-violet">LORE FORGE · {c.name}</div>
          <h1 className="display-lg mt-1" style={{ textTransform: 'uppercase' }}>The World Builder</h1>
          <p className="body mt-2" style={{ maxWidth: 520 }}>Consult the kosmos. Ask for what your story needs. Add it to your world with a touch.</p>
        </div>
      </div>

      <div className="grid worldbuilder-grid">
        {/* Left — input */}
        <div className="flex flex-col gap-6">
          <div className="surface-glow" style={{ padding: 28 }}>
            <div className="eyebrow eyebrow-violet">Forge new lore</div>
            <h3 className="display mt-3" style={{ fontSize: 22 }}>Ask, and the stars answer.</h3>
            <textarea className="textarea mt-5" value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. 'A dungeon built into the ribcage of a dead god'"/>
            <button className="btn btn-primary w-full mt-4" onClick={() => generate('custom')} disabled={!prompt || generating}>
              {generating ? <><Icon name="sparkles" size={14}/> Consulting the cosmos…</> : <><Icon name="sparkles" size={14}/> Generate</>}
            </button>
          </div>

          <div>
            <div className="eyebrow eyebrow-muted mb-3">Shortcuts</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { k: 'location', l: 'Location', ic: 'map-pin' },
                { k: 'npc', l: 'NPC', ic: 'users' },
                { k: 'quest', l: 'Quest', ic: 'book' },
                { k: 'twist', l: 'Twist', ic: 'sparkles' },
                { k: 'rumour', l: 'Rumour', ic: 'feather' },
                { k: 'loot', l: 'Loot', ic: 'crown' },
              ].map(s => (
                <button key={s.k} className="lore-shortcut" onClick={() => generate(s.k)} disabled={generating}>
                  <Icon name={s.ic} size={18}/><span>{s.l}</span>
                </button>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <div className="eyebrow eyebrow-muted mb-3">Recent forgings</div>
              <div className="flex flex-col gap-2">
                {history.map((h, i) => (
                  <button key={i} className="forge-history" onClick={() => setOutput(h)}>
                    <span className="badge badge-violet">{h.type}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{h.title}</span>
                    <Icon name="chevron-right" size={14}/>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — output */}
        <div>
          {output ? (
            <div className="surface-glow forge-output fade-in">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge badge-solid-violet">{output.type}</span>
                    <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
                  </div>
                  <h2 className="display-lg" style={{ textTransform: 'uppercase' }}>{output.title}</h2>
                </div>
                <div className="forge-stamp">
                  <Icon name="sparkles" size={22} stroke={1.4}/>
                </div>
              </div>

              <div className="forge-body">
                <p className="quote" style={{ fontSize: 18, lineHeight: 1.65 }}>
                  {output.body.split('\n\n').map((para, i) => (
                    <React.Fragment key={i}>
                      {para}
                      {i < output.body.split('\n\n').length - 1 && <><br/><br/></>}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--hairline)' }}>
                <button className="btn btn-gold" style={{ flex: 1 }}>Save to {c.name.split(' ').slice(0, 2).join(' ')}</button>
                <button className="btn btn-ghost" onClick={() => generate(output.type.toLowerCase())}>
                  <Icon name="sparkles" size={14}/> Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div className="forge-empty">
              <CompassRose size={80} opacity={0.25}/>
              <h3 className="display mt-6" style={{ fontSize: 22 }}>Awaiting the kosmos</h3>
              <p className="body mt-2" style={{ maxWidth: 380 }}>Pick a shortcut, or describe what you need. The stars are patient.</p>
            </div>
          )}
        </div>
      </div>

      {/* Locations of this campaign */}
      <OrnateDivider label="Known World" glyph="✦"/>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: 32 }}>
        <ConstellationMap locations={locs} height={460} selectedId={selectedLoc?.id} onSelect={setSelectedLoc}/>
        <div className="surface" style={{ padding: 20 }}>
          {selectedLoc ? (
            <div className="fade-in">
              <span className="badge badge-violet">{selectedLoc.type}</span>
              <h3 className="display mt-3" style={{ fontSize: 22 }}>{selectedLoc.name}</h3>
              <div className="micro mt-1">{selectedLoc.region}</div>
              <p className="quote mt-4">"{selectedLoc.desc}"</p>
              <div className="grid mt-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><div className="micro">Population</div><div className="heading mt-1">{selectedLoc.population}</div></div>
                <div><div className="micro">Climate</div><div className="heading mt-1">{selectedLoc.climate}</div></div>
              </div>
              {selectedLoc.notes && <div className="mt-5 small" style={{ padding: 12, background: 'var(--void-2)', borderRadius: 'var(--r-xs)', borderLeft: '2px solid var(--gold)' }}>{selectedLoc.notes}</div>}
              <button className="btn btn-violet-soft w-full mt-5">Open Location</button>
            </div>
          ) : (
            <>
              <div className="eyebrow eyebrow-muted">Locations · {locs.length}</div>
              <p className="small mt-2" style={{ marginBottom: 16 }}>Tap a star.</p>
              <div className="flex flex-col gap-2">
                {locs.slice(0, 6).map(l => (
                  <button key={l.id} className="forge-history" onClick={() => setSelectedLoc(l)}>
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
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  CHARACTERS OVERVIEW
// ════════════════════════════════════════════════════════════════════
function CharactersOverview({ navigate }) {
  const { CHARACTERS, CAMPAIGNS } = window.PANGU_DATA;
  const [search, setSearch] = useStateP2('');
  const filtered = CHARACTERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.class.toLowerCase().includes(search.toLowerCase()) ||
    c.race.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter page-max" data-screen-label="Characters">
      <PageHeader
        eyebrow="Your heroes"
        title="Characters"
        description="The party. The vows. The unwritten obituaries."
        action={
          <button className="btn btn-primary btn-lg">
            <Icon name="plus" size={14}/> New Hero
          </button>
        }
      />

      <div className="search-wrap mb-10">
        <Icon name="search" size={16} className="search-icon"/>
        <input className="input input-lg" value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek op naam, klasse, ras…"/>
      </div>

      <OrnateDivider label="The Roster"/>

      <div className="char-grid">
        {filtered.map(ch => (
          <button key={ch.id} className="char-card clickable" onClick={() => navigate(`/character/${ch.id}`)}
            style={{ '--accent': ch.accent }}>
            <div className="char-card-portrait">
              <CosmicImg glyph={ch.glyph} accent={ch.accent} ratio="1/1"/>
              <span className="char-card-level">
                <span className="char-level-num">{ch.level}</span>
                <span className="char-level-lbl">LV</span>
              </span>
            </div>
            <div className="char-card-body">
              <div className="micro">{ch.race} · {ch.class}</div>
              <h3 className="display mt-1" style={{ fontSize: 20 }}>{ch.name}</h3>
              <p className="small mt-1" style={{ color: 'var(--muted)' }}>{CAMPAIGNS.find(c => c.id === ch.campaignId)?.name.split(' ').slice(0, 3).join(' ') ?? '—'}</p>

              <div className="char-card-stats">
                <div className="char-stat">
                  <div className="micro">HP</div>
                  <div className="font-mono mt-1" style={{ fontWeight: 700, color: ch.hp / ch.maxHp < 0.3 ? 'var(--crimson)' : 'var(--ink)' }}>{ch.hp}<span style={{ color: 'var(--muted)' }}>/{ch.maxHp}</span></div>
                </div>
                <div className="char-stat">
                  <div className="micro">AC</div>
                  <div className="font-mono mt-1" style={{ fontWeight: 700 }}>{ch.ac}</div>
                </div>
                <div className="char-stat">
                  <div className="micro">SPD</div>
                  <div className="font-mono mt-1" style={{ fontWeight: 700 }}>{ch.speed}</div>
                </div>
              </div>
            </div>
          </button>
        ))}

        <button className="campaign-empty clickable">
          <div className="campaign-empty-ring"><Icon name="plus" size={28}/></div>
          <div className="title mt-4" style={{ fontSize: 14 }}>NEW HERO</div>
          <div className="small mt-2">Roll the bones</div>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  CHARACTER DETAIL
// ════════════════════════════════════════════════════════════════════
function CharacterDetail({ navigate, params }) {
  const { CHARACTERS, CAMPAIGNS } = window.PANGU_DATA;
  const ch = CHARACTERS.find(x => x.id === params.id);
  const [tab, setTab] = useStateP2('stats');
  const [hp, setHp] = useStateP2(ch?.hp ?? 0);

  if (!ch) return null;
  const camp = CAMPAIGNS.find(c => c.id === ch.campaignId);
  const hpPct = (hp / ch.maxHp) * 100;
  const xpPct = (ch.xp / ch.xpNext) * 100;

  const mod = (stat) => {
    const m = Math.floor((stat - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  const statNames = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };

  return (
    <div className="page-enter page-max" data-screen-label="Character">
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate(camp ? `/campaign/${camp.id}` : '/characters')}>
        <Icon name="arrow-left" size={14}/> {camp ? `Back to ${camp.name.split(' ').slice(0, 3).join(' ')}` : 'Back'}
      </button>

      <div className="char-hero" style={{ '--accent': ch.accent }}>
        <div className="char-hero-portrait">
          <CosmicImg glyph={ch.glyph} accent={ch.accent} ratio="4/5"/>
          <div className="char-hero-portrait-frame"/>
        </div>
        <div className="char-hero-body">
          <div className="eyebrow eyebrow-violet">{ch.race} · {ch.class} · {ch.subclass}</div>
          <h1 className="display-lg mt-2" style={{ textTransform: 'uppercase' }}>{ch.name}</h1>

          <div className="char-hero-level mt-5">
            <div className="kicker">LEVEL</div>
            <div className="display" style={{ fontSize: 56, color: 'var(--gold)' }}>{ch.level}</div>
            <div style={{ flex: 1 }}>
              <div className="micro">Experience</div>
              <div className="char-xp-bar mt-2"><div className="char-xp-bar-fill" style={{ width: `${xpPct}%`, background: ch.accent }}/></div>
              <div className="small mt-1">{ch.xp.toLocaleString()} / {ch.xpNext.toLocaleString()} XP</div>
            </div>
          </div>

          {/* Vitals */}
          <div className="grid mt-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <div className="surface" style={{ padding: 16 }}>
              <div className="flex items-center justify-between">
                <div className="eyebrow eyebrow-muted">HP</div>
                <div className="flex gap-1">
                  <button className="btn-icon" style={{ width: 22, height: 22 }} onClick={() => setHp(Math.max(0, hp - 1))}><Icon name="chevron-down" size={12}/></button>
                  <button className="btn-icon" style={{ width: 22, height: 22 }} onClick={() => setHp(Math.min(ch.maxHp, hp + 1))}><Icon name="check" size={12}/></button>
                </div>
              </div>
              <div className="display mt-2" style={{ fontSize: 28, color: hpPct < 30 ? 'var(--crimson)' : 'var(--ink)' }}>
                {hp}<span style={{ color: 'var(--muted)', fontSize: 18 }}>/{ch.maxHp}</span>
              </div>
              <div className="char-xp-bar mt-2"><div className="char-xp-bar-fill" style={{ width: `${hpPct}%`, background: hpPct < 30 ? 'var(--crimson)' : 'var(--teal)' }}/></div>
            </div>
            <div className="surface" style={{ padding: 16 }}>
              <div className="eyebrow eyebrow-muted">Armor Class</div>
              <div className="display mt-2" style={{ fontSize: 28 }}>{ch.ac}</div>
              <div className="small mt-1">Shield + Leather</div>
            </div>
            <div className="surface" style={{ padding: 16 }}>
              <div className="eyebrow eyebrow-muted">Initiative</div>
              <div className="display mt-2" style={{ fontSize: 28, color: 'var(--gold)' }}>{ch.init}</div>
              <div className="small mt-1">DEX modifier</div>
            </div>
            <div className="surface" style={{ padding: 16 }}>
              <div className="eyebrow eyebrow-muted">Speed</div>
              <div className="display mt-2" style={{ fontSize: 28 }}>{ch.speed}<span style={{ fontSize: 14, color: 'var(--muted)' }}> ft</span></div>
              <div className="small mt-1">Proficiency {ch.prof}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-bar mt-12">
        {['stats', 'spells', 'inventory', 'lore'].map(t => (
          <button key={t} className="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'stats' && (
          <div>
            <div className="ability-grid">
              {Object.entries(ch.stats).map(([k, v]) => (
                <div key={k} className="ability-card" style={{ '--accent': ch.saves.includes(k) ? 'var(--gold)' : 'var(--violet)' }}>
                  <div className="eyebrow eyebrow-muted">{statNames[k]}</div>
                  <div className="ability-mod">{mod(v)}</div>
                  <div className="ability-score">{v}</div>
                  {ch.saves.includes(k) && <div className="ability-save">SAVE PROF</div>}
                </div>
              ))}
            </div>

            <OrnateDivider label="Traits"/>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {ch.traits.map(t => (
                <div key={t.name} className="surface" style={{ padding: 20 }}>
                  <div className="heading" style={{ color: 'var(--gold)' }}>{t.name}</div>
                  <p className="body mt-2">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'spells' && (
          <div>
            {ch.spells.length === 0 ? (
              <div className="text-center" style={{ padding: 60 }}>
                <div className="small">This hero wields no spells. Only steel.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {ch.spells.map(s => (
                  <div key={s.name} className="surface" style={{ padding: 20 }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="badge badge-violet">LV {s.level || 'Cantrip'}</span>
                        <h3 className="display" style={{ fontSize: 19 }}>{s.name}</h3>
                      </div>
                      <span className="micro">{s.school} · {s.range}</span>
                    </div>
                    <p className="body" style={{ color: 'var(--ink-soft)' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'inventory' && (
          <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
            <div className="surface">
              <div className="flex items-center justify-between" style={{ padding: 16, borderBottom: '1px solid var(--hairline)' }}>
                <div className="title" style={{ fontSize: 13, letterSpacing: '0.22em' }}>EQUIPMENT</div>
                <button className="btn btn-violet-soft btn-sm"><Icon name="plus" size={13}/> Add</button>
              </div>
              <div className="flex flex-col">
                {ch.inventory.map((it, i) => (
                  <div key={i} className="inv-row">
                    <div className="inv-icon"><Icon name="swords" size={14}/></div>
                    <div style={{ flex: 1 }}>
                      <div className="heading" style={{ fontSize: 14 }}>{it.name}</div>
                      <div className="micro">{it.type}</div>
                    </div>
                    {it.rarity !== 'common' && <span className="badge badge-gold">{it.rarity}</span>}
                    <div className="font-mono" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>×{it.qty}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="surface" style={{ padding: 20 }}>
                <div className="eyebrow eyebrow-muted">Treasury</div>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center justify-between"><span className="micro">Gold</span><span className="font-mono" style={{ color: 'var(--gold)', fontWeight: 700 }}>{ch.gold} gp</span></div>
                  <div className="flex items-center justify-between"><span className="micro">Silver</span><span className="font-mono" style={{ color: '#cfd2d8', fontWeight: 700 }}>{ch.silver} sp</span></div>
                  <div className="flex items-center justify-between"><span className="micro">Copper</span><span className="font-mono" style={{ color: '#b8773c', fontWeight: 700 }}>{ch.copper} cp</span></div>
                </div>
              </div>
              <DiceRoller compact/>
            </div>
          </div>
        )}

        {tab === 'lore' && (
          <div className="surface" style={{ padding: 32, maxWidth: 760 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="title" style={{ fontSize: 13, letterSpacing: '0.22em' }}>BACKSTORY</div>
              <button className="btn btn-violet-soft btn-sm"><Icon name="sparkles" size={13}/> Expand with AI</button>
            </div>
            <p className="quote" style={{ fontSize: 19, lineHeight: 1.7 }}>"{ch.backstory}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  BESTIARY
// ════════════════════════════════════════════════════════════════════
function Bestiary({ navigate }) {
  const { MONSTERS } = window.PANGU_DATA;
  const [search, setSearch] = useStateP2('');
  const [selected, setSelected] = useStateP2(MONSTERS[0]);
  const filtered = MONSTERS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-enter page-max" data-screen-label="Bestiary">
      <PageHeader
        eyebrow="Sanctum bestiary"
        title="Bestiary"
        description="What creeps, slithers, or strides in your world. Catalogued with caution."
        action={<button className="btn btn-gold btn-lg"><Icon name="sparkles" size={14}/> Conjure New Beast</button>}
      />

      <div className="grid bestiary-grid">
        {/* List */}
        <div className="flex flex-col gap-4">
          <div className="search-wrap">
            <Icon name="search" size={15} className="search-icon"/>
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Doorzoek het bestiarium…"/>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map(m => (
              <button key={m.id} className={`bestiary-row ${selected?.id === m.id ? 'is-selected' : ''}`} onClick={() => setSelected(m)}>
                <div className="bestiary-row-art"><CosmicImg glyph={m.name[0]} ratio="1/1" accent={crFromColor(m.cr)}/></div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div className="heading" style={{ fontSize: 14 }}>{m.name}</div>
                  <div className="micro">CR {m.cr} · {m.type.split('(')[0].trim()}</div>
                </div>
                <Icon name="chevron-right" size={14}/>
              </button>
            ))}
          </div>
        </div>

        {/* Specimen card */}
        {selected && (
          <div className="specimen-card surface-glow fade-in">
            <div className="specimen-head">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-solid-gold">CR {selected.cr}</span>
                  <span className="micro" style={{ color: 'var(--violet)' }}>{selected.type}</span>
                </div>
                <h2 className="display-lg" style={{ textTransform: 'uppercase' }}>{selected.name}</h2>
                <div className="micro mt-2">Size · {selected.size}</div>
              </div>
              <div className="specimen-portrait">
                <CosmicImg glyph={selected.name[0]} ratio="1/1" accent={crFromColor(selected.cr)}/>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <circle cx="50" cy="50" r="48" fill="none" stroke={crFromColor(selected.cr)} strokeWidth="0.4" strokeDasharray="2 1.5" opacity="0.5"/>
                </svg>
              </div>
            </div>

            <div className="specimen-vitals">
              <div className="specimen-vital">
                <Icon name="heart" size={16} stroke={1.6}/>
                <div>
                  <div className="micro">HP</div>
                  <div className="display" style={{ fontSize: 22 }}>{selected.hp}</div>
                </div>
              </div>
              <div className="specimen-vital">
                <Icon name="shield" size={16} stroke={1.6}/>
                <div>
                  <div className="micro">AC</div>
                  <div className="display" style={{ fontSize: 22 }}>{selected.ac}</div>
                </div>
              </div>
              <div className="specimen-vital">
                <Icon name="zap" size={16}/>
                <div>
                  <div className="micro">Speed</div>
                  <div className="display" style={{ fontSize: 22 }}>{selected.speed} <span style={{ fontSize: 12, color: 'var(--muted)' }}>ft</span></div>
                </div>
              </div>
            </div>

            <OrnateDivider label="Ability"/>

            <div className="specimen-stats">
              {Object.entries(selected.stats).map(([k, v]) => (
                <div key={k} className="specimen-stat">
                  <div className="micro">{k.toUpperCase()}</div>
                  <div className="display" style={{ fontSize: 22, marginTop: 4 }}>{v}</div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--gold)', marginTop: 2 }}>{(Math.floor((v - 10) / 2) >= 0 ? '+' : '') + Math.floor((v - 10) / 2)}</div>
                </div>
              ))}
            </div>

            <OrnateDivider label="Lore"/>

            <p className="quote" style={{ fontSize: 19 }}>"{selected.desc}"</p>

            <div className="specimen-actions">
              <div className="title mt-6 mb-3" style={{ fontSize: 13, letterSpacing: '0.22em' }}>ACTIONS</div>
              <ul className="flex flex-col gap-2">
                {selected.actions.map((a, i) => (
                  <li key={i} className="surface" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'start' }}>
                    <span className="font-mono" style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="body" style={{ fontSize: 14 }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="swords" size={14}/> Add to Encounter</button>
              <button className="btn btn-ghost">Export sheet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function crFromColor(cr) {
  const n = parseFloat(cr.includes('/') ? cr.split('/').reduce((a, b) => a / b) : cr);
  if (n >= 8) return '#ff6b6b';
  if (n >= 3) return '#f5c842';
  if (n >= 1) return '#9b8aff';
  return '#3ecfb2';
}

// ════════════════════════════════════════════════════════════════════
//  SETTINGS
// ════════════════════════════════════════════════════════════════════
function SettingsPage() {
  const [tab, setTab] = useStateP2('profile');
  const [notif, setNotif] = useStateP2(true);
  const [sounds, setSounds] = useStateP2(true);
  const [autosave, setAutosave] = useStateP2(true);
  const [ai, setAi] = useStateP2(true);

  return (
    <div className="page-enter page-max" data-screen-label="Settings" style={{ maxWidth: 820 }}>
      <PageHeader eyebrow="Configuration" title="Settings" description="Tune the Sanctum to your liking."/>

      <div className="tab-bar mb-8" style={{ maxWidth: 400 }}>
        {[{ id: 'profile', l: 'Profile' }, { id: 'prefs', l: 'Preferences' }, { id: 'about', l: 'About' }].map(t => (
          <button key={t.id} className="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.l}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="surface" style={{ padding: 28 }}>
          <div className="flex items-center gap-5 mb-8">
            <div className="settings-avatar">
              <span>DM</span>
            </div>
            <div>
              <h3 className="display" style={{ fontSize: 20 }}>The Dungeon Master</h3>
              <p className="small mt-1">Member since star-year 2024</p>
              <button className="btn btn-violet-soft btn-sm mt-3">Change photo</button>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Display name</label>
              <input className="input" defaultValue="The Dungeon Master"/>
            </div>
            <div>
              <label className="label">Pronouns</label>
              <input className="input" defaultValue="they/them"/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label">Email</label>
              <input className="input" defaultValue="dm@pangu.app"/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label">DM Bio</label>
              <textarea className="textarea" defaultValue="A gentle hand at the wheel. A heavy thumb on the dice."/>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary">Save</button>
          </div>
        </div>
      )}

      {tab === 'prefs' && (
        <div className="flex flex-col gap-4">
          <div className="surface" style={{ padding: 24 }}>
            <div className="title mb-4" style={{ fontSize: 13, letterSpacing: '0.22em' }}>NOTIFICATIONS</div>
            <SettingToggle label="Session reminders" desc="Notify me before my next session." value={notif} onChange={setNotif}/>
            <SettingToggle label="Sound effects" desc="Tumbling dice, candle-flame, etc." value={sounds} onChange={setSounds}/>
            <SettingToggle label="Autosave notes" desc="Save session logs every 30 seconds." value={autosave} onChange={setAutosave}/>
          </div>
          <div className="surface" style={{ padding: 24 }}>
            <div className="title mb-4" style={{ fontSize: 13, letterSpacing: '0.22em' }}>AI</div>
            <SettingToggle label="Lore suggestions" desc="Let the kosmos whisper ideas in margins." value={ai} onChange={setAi}/>
            <div style={{ paddingTop: 16, marginTop: 16, borderTop: '1px solid var(--hairline)' }}>
              <label className="label">Language</label>
              <select className="input">
                <option>English</option><option>Nederlands</option><option>Deutsch</option><option>Français</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="surface-glow" style={{ padding: 32, textAlign: 'center' }}>
          <CompassRose size={80} opacity={0.7}/>
          <h2 className="display-lg mt-6">PANGU</h2>
          <div className="eyebrow mt-2">SANCTUM EDITION · II</div>
          <p className="quote mt-6" style={{ maxWidth: 480, margin: '24px auto 0' }}>"Built for Dungeon Masters who would rather tell stories than keep score."</p>
          <div className="grid mt-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 480, margin: '32px auto 0' }}>
            <div><div className="micro">Version</div><div className="font-mono mt-1" style={{ color: 'var(--violet)', fontWeight: 700 }}>v2.0</div></div>
            <div><div className="micro">Status</div><div className="font-mono mt-1" style={{ color: 'var(--gold)', fontWeight: 700 }}>BETA</div></div>
            <div><div className="micro">License</div><div className="font-mono mt-1">MIT</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingToggle({ label, desc, value, onChange }) {
  return (
    <div className="setting-toggle">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="heading" style={{ fontSize: 14 }}>{label}</div>
        <div className="small mt-1">{desc}</div>
      </div>
      <button className={`toggle ${value ? 'is-on' : ''}`} onClick={() => onChange(!value)} aria-pressed={value}>
        <span className="toggle-dot"/>
      </button>
    </div>
  );
}

Object.assign(window, { SessionView, WorldBuilder, CharactersOverview, CharacterDetail, Bestiary, SettingsPage });
