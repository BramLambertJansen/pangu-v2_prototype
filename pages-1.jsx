/* Pangu v2 — Pages: Campaigns, CampaignDetail (HERO) */

const { useState: useStateP, useMemo: useMemoP } = React;

// ════════════════════════════════════════════════════════════════════
//  CAMPAIGNS OVERVIEW
// ════════════════════════════════════════════════════════════════════
function CampaignsOverview({ navigate }) {
  const { CAMPAIGNS } = window.PANGU_DATA;
  const [search, setSearch] = useStateP('');
  const [showModal, setShowModal] = useStateP(false);
  const filtered = CAMPAIGNS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const active = CAMPAIGNS.filter(c => c.status === 'active');

  return (
    <div className="page-enter page-max" data-screen-label="Campaigns">
      <PageHeader
        eyebrow="Your saga begins here"
        title="Campaigns"
        description="The worlds you keep. Each is a vow — to your players, and to the story still unwritten."
        action={
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={14}/> New Campaign
          </button>
        }
      />

      {/* Stat bar */}
      <div className="flex gap-3 flex-wrap mb-10">
        <div className="stat-pill">
          <div className="ic"><Icon name="book" size={14}/></div>
          <div><div className="val">{CAMPAIGNS.length}</div><div className="lab">Total</div></div>
        </div>
        <div className="stat-pill">
          <div className="ic" style={{ background: 'rgba(62,207,178,0.12)', color: 'var(--teal)' }}><Icon name="zap" size={14}/></div>
          <div><div className="val">{active.length}</div><div className="lab">Active</div></div>
        </div>
        <div className="stat-pill">
          <div className="ic" style={{ background: 'rgba(245,200,66,0.12)', color: 'var(--gold)' }}><Icon name="users" size={14}/></div>
          <div><div className="val">{CAMPAIGNS.reduce((s, c) => s + c.playerCount, 0)}</div><div className="lab">Players</div></div>
        </div>
        <div className="stat-pill">
          <div className="ic"><Icon name="sparkles" size={14}/></div>
          <div><div className="val">{CAMPAIGNS.reduce((s, c) => s + c.sessionCount, 0)}</div><div className="lab">Sessions</div></div>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap mb-10">
        <Icon name="search" size={16} className="search-icon"/>
        <input className="input input-lg" value={search} onChange={e => setSearch(e.target.value)} placeholder="Doorzoek de kronieken…" />
      </div>

      <OrnateDivider label="Chronicles" />

      {/* Card grid */}
      <div className="campaign-grid">
        {filtered.map(c => (
          <CampaignBigCard key={c.id} campaign={c} onClick={() => navigate(`/campaign/${c.id}`)} />
        ))}
        <button className="campaign-empty clickable" onClick={() => setShowModal(true)}>
          <div className="campaign-empty-ring"><Icon name="plus" size={28}/></div>
          <div className="title" style={{ marginTop: 16, fontSize: 14 }}>SUMMON A WORLD</div>
          <div className="small mt-2">Begin a new chronicle</div>
        </button>
      </div>

      <NewCampaignModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

function CampaignBigCard({ campaign, onClick }) {
  const c = campaign;
  const progress = Math.round((c.chapter / c.chapterTotal) * 100);
  return (
    <button className="campaign-card clickable" onClick={onClick} style={{ '--accent': c.accent }}>
      <div className="campaign-card-art">
        <CosmicImg glyph={c.glyph} accent={c.accent} ratio="16/9"/>
        <div className="campaign-card-overlay"/>
        <div className="campaign-card-stamp">
          <div className="campaign-card-roman">{toRomanP(c.chapter)}</div>
          <div className="micro" style={{ color: 'var(--gold)', marginTop: 2 }}>CHAPTER</div>
        </div>
        <span className={`badge ${c.status === 'active' ? 'badge-solid-gold' : 'badge-outline'}`}
          style={{ position: 'absolute', top: 16, right: 16 }}>{c.status}</span>
      </div>

      <div className="campaign-card-body">
        <div className="eyebrow eyebrow-violet" style={{ fontSize: 10 }}>{c.setting} · {c.system}</div>
        <h3 className="display" style={{ fontSize: 24, marginTop: 8, marginBottom: 4 }}>{c.name}</h3>
        <p className="quote" style={{ fontSize: 15, color: 'var(--ink-soft)' }}>"{c.motto}"</p>

        <div className="campaign-card-meta">
          <div className="campaign-card-meta-item">
            <Icon name="users" size={13}/> <span>{c.playerCount}</span>
          </div>
          <div className="campaign-card-meta-item">
            <Icon name="book" size={13}/> <span>{c.sessionCount} sessions</span>
          </div>
          <div className="campaign-card-meta-item">
            <Icon name="map-pin" size={13}/> <span>{c.locations} locations</span>
          </div>
        </div>

        <div className="campaign-card-progress">
          <div className="flex justify-between" style={{ marginBottom: 6 }}>
            <span className="micro">Chapter {c.chapter} / {c.chapterTotal}</span>
            <span className="micro" style={{ color: 'var(--gold)' }}>{c.chapterName}</span>
          </div>
          <div className="campaign-card-bar"><div className="campaign-card-bar-fill" style={{ width: `${progress}%` }}/></div>
        </div>
      </div>
    </button>
  );
}

function toRomanP(num) {
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let result = ''; for (const [r, v] of map) { while (num >= v) { result += r; num -= v; } } return result || '0';
}

function NewCampaignModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Forge a new world" title="A new chronicle"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>Begin <Icon name="arrow-right" size={14}/></button>
        </>
      }>
      <div className="flex flex-col gap-5">
        <div>
          <label className="label">Name</label>
          <input className="input" placeholder="e.g. The Lost Mines of Phandelver"/>
        </div>
        <div>
          <label className="label">Pact · Short motto</label>
          <input className="input" placeholder="The line that lives on the cover"/>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="label">Setting</label>
            <input className="input" placeholder="Forgotten Realms"/>
          </div>
          <div>
            <label className="label">System</label>
            <input className="input" placeholder="D&D 5e"/>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="textarea" placeholder="What is this story about?"/>
        </div>
      </div>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════════
//  CAMPAIGN DETAIL — HERO
// ════════════════════════════════════════════════════════════════════
function CampaignDetail({ navigate, params }) {
  const { CAMPAIGNS, CHARACTERS, LOCATIONS, NPCS, QUESTS, CHAPTERS } = window.PANGU_DATA;
  const c = CAMPAIGNS.find(x => x.id === params.id);
  const [tab, setTab] = useStateP('arc');
  const [selectedChapter, setSelectedChapter] = useStateP(4);
  const [aiPrompt, setAiPrompt] = useStateP('');

  if (!c) {
    return (
      <div className="page-max page-enter text-center" style={{ paddingTop: 80 }}>
        <h1 className="display">Campaign not found</h1>
        <button className="btn btn-ghost mt-6" onClick={() => navigate('/campaigns')}>← Back</button>
      </div>
    );
  }

  const chars = CHARACTERS.filter(x => x.campaignId === c.id);
  const locs = LOCATIONS.filter(x => x.campaignId === c.id);
  const npcs = NPCS.filter(x => x.campaignId === c.id);
  const sel = CHAPTERS.find(ch => ch.num === selectedChapter);

  const tabs = [
    { id: 'arc', label: 'Story Arc' },
    { id: 'party', label: 'Party' },
    { id: 'world', label: 'World' },
    { id: 'npcs', label: 'NPCs' },
    { id: 'quests', label: 'Quests' },
    { id: 'lore', label: 'Lore Forge' },
  ];

  return (
    <div className="page-enter page-max" data-screen-label="Campaign Detail">
      {/* Back link */}
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate('/campaigns')}>
        <Icon name="arrow-left" size={14}/> All campaigns
      </button>

      {/* Breadcrumb */}
      {(() => {
        const { WORLDS } = window.PANGU_DATA;
        const world = WORLDS.find(w => w.id === c.worldId);
        return (
          <div className="flex items-center gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
            {world ? (
              <>
                <button className="micro-link" onClick={() => navigate(`/world/${world.id}`)}>
                  <span style={{ width: 8, height: 8, background: world.accent, borderRadius: 999, display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}/>
                  {world.name}
                </button>
                <span className="micro" style={{ color: 'var(--muted)' }}>›</span>
                <span className="micro" style={{ color: 'var(--ink-soft)' }}>Chronicle</span>
              </>
            ) : (
              <>
                <span className="badge badge-outline" style={{ borderColor: c.accent, color: c.accent }}>ONESHOT</span>
                <span className="micro" style={{ color: 'var(--muted)' }}>Standalone tale</span>
              </>
            )}
          </div>
        );
      })()}

      {/* HERO */}
      <section className="campaign-hero" style={{ '--accent': c.accent }}>
        <div className="campaign-hero-art">
          <CosmicImg glyph={c.glyph} accent={c.accent} ratio="3/2"/>
          <div className="campaign-hero-overlay"/>
        </div>

        <div className="campaign-hero-content">
          <div className="campaign-hero-eyebrow">
            <span className="kicker">CHRONICLE {toRomanP(CAMPAIGNS.indexOf(c) + 1)}</span>
            <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
            <span className="badge badge-solid-gold">{c.status}</span>
          </div>

          <h1 className="display-xl glow-violet" style={{ textTransform: 'uppercase', marginBottom: 20 }}>{c.name}</h1>

          <div className="campaign-hero-motto">
            <span>"</span>{c.motto}<span>"</span>
          </div>

          <p className="body-lg mt-6" style={{ maxWidth: 720 }}>{c.description}</p>

          <div className="campaign-hero-meta mt-8">
            <div className="campaign-hero-meta-item">
              <div className="micro">Chapter</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--gold)', marginTop: 2 }}>{c.chapter}<span style={{ fontSize: 18, color: 'var(--muted)' }}> / {c.chapterTotal}</span></div>
              <div className="small" style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{c.chapterName}</div>
            </div>
            <div className="campaign-hero-meta-item">
              <div className="micro">Sessions</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 2 }}>{c.sessionCount}</div>
              <div className="small" style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{c.playtimeHours}h logged</div>
            </div>
            <div className="campaign-hero-meta-item">
              <div className="micro">Party</div>
              <div className="font-display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 2 }}>{c.playerCount}</div>
              <div className="small" style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{chars.map(x => x.name.split(' ')[0]).join(', ') || '—'}</div>
            </div>
            <div className="campaign-hero-meta-item">
              <div className="micro">Next session</div>
              <div className="font-display" style={{ fontSize: 18, color: 'var(--gold)', marginTop: 6 }}>{c.nextSession}</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-8">
            <button className="btn btn-primary btn-lg" onClick={() => navigate(`/session/${c.id}`)}>
              <Icon name="play" size={14}/> Run Session
            </button>
            <button className="btn btn-gold btn-lg" onClick={() => navigate(`/world-builder/${c.id}`)}>
              <Icon name="sparkles" size={14}/> Lore Forge
            </button>
            <button className="btn btn-ghost btn-lg"><Icon name="edit" size={14}/> Edit Pact</button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tab-bar mt-12" role="tablist">
        {tabs.map(t => (
          <button key={t.id} className="tab" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-8">
        {tab === 'arc' && (
          <div className="grid arc-grid">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="display" style={{ fontSize: 22 }}>The Story Arc</h2>
                <span className="micro">{CHAPTERS.length} chapters</span>
              </div>
              <ChapterSpine chapters={CHAPTERS} onSelect={setSelectedChapter} selected={selectedChapter}/>
            </div>
            <aside className="arc-aside">
              {sel && <ChapterDetail chapter={sel} campaign={c} />}
            </aside>
          </div>
        )}

        {tab === 'party' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display" style={{ fontSize: 22 }}>The Party</h2>
              <button className="btn btn-violet-soft btn-sm"><Icon name="plus" size={13}/> Add Hero</button>
            </div>
            <div className="party-grid">
              {chars.map(ch => <PartyTile key={ch.id} character={ch} onClick={() => navigate(`/character/${ch.id}`)} />)}
            </div>

            <OrnateDivider label="Party Vitals" glyph="❀"/>

            <div className="vitals-grid">
              <div className="surface" style={{ padding: 20 }}>
                <div className="eyebrow eyebrow-muted">Average level</div>
                <div className="display" style={{ fontSize: 44, color: 'var(--gold)', marginTop: 8 }}>{Math.round(chars.reduce((s, x) => s + x.level, 0) / chars.length)}</div>
              </div>
              <div className="surface" style={{ padding: 20 }}>
                <div className="eyebrow eyebrow-muted">Total HP</div>
                <div className="display" style={{ fontSize: 44, color: 'var(--teal)', marginTop: 8 }}>
                  {chars.reduce((s, x) => s + x.hp, 0)}<span style={{ fontSize: 22, color: 'var(--muted)' }}>/{chars.reduce((s, x) => s + x.maxHp, 0)}</span>
                </div>
              </div>
              <div className="surface" style={{ padding: 20 }}>
                <div className="eyebrow eyebrow-muted">Coin pool</div>
                <div className="display" style={{ fontSize: 44, color: 'var(--gold)', marginTop: 8 }}>{chars.reduce((s, x) => s + x.gold, 0)}<span style={{ fontSize: 18, color: 'var(--muted)' }}>gp</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'world' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display" style={{ fontSize: 22 }}>The World · {locs.length} locations</h2>
              <button className="btn btn-violet-soft btn-sm" onClick={() => navigate(`/world-builder/${c.id}`)}><Icon name="map-pin" size={13}/> Open World Builder</button>
            </div>
            <ConstellationMap locations={locs} height={520} />
            <div className="locations-grid mt-8">
              {locs.slice(0, 4).map(l => <LocationMini key={l.id} location={l}/>)}
            </div>
          </div>
        )}

        {tab === 'npcs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display" style={{ fontSize: 22 }}>Living Cast</h2>
              <button className="btn btn-violet-soft btn-sm"><Icon name="plus" size={13}/> New NPC</button>
            </div>
            <div className="npcs-grid">
              {npcs.map(n => <NpcCard key={n.id} npc={n} />)}
            </div>
          </div>
        )}

        {tab === 'quests' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="display" style={{ fontSize: 22 }}>Open Threads</h2>
              <div className="flex gap-2">
                <span className="chip">{QUESTS.filter(q => q.status === 'active').length} active</span>
                <span className="chip">{QUESTS.filter(q => q.status === 'completed').length} closed</span>
              </div>
            </div>
            <QuestList quests={QUESTS}/>
          </div>
        )}

        {tab === 'lore' && (
          <div>
            <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 32 }}>
              <div>
                <div className="lore-card">
                  <div className="eyebrow eyebrow-violet">Lore Forge · Consult the Stars</div>
                  <h3 className="display mt-3" style={{ fontSize: 24 }}>Ask for what your world needs.</h3>
                  <p className="body mt-3" style={{ maxWidth: 560 }}>A locked door, a name, a memory, a rumour. Sketch it in words; the kosmos answers in story.</p>
                  <textarea className="textarea mt-6"
                    placeholder="e.g. 'A rumour the bartender tells when the candles burn low'"
                    value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}/>
                  <button className="btn btn-primary btn-lg mt-4" onClick={() => navigate(`/world-builder/${c.id}`)}>
                    <Icon name="sparkles" size={14}/> Open Full Forge
                  </button>
                </div>

                <div className="grid mt-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {[
                    { ic: 'map-pin', l: 'Location' },
                    { ic: 'users', l: 'NPC' },
                    { ic: 'book', l: 'Quest' },
                    { ic: 'sparkles', l: 'Twist' },
                    { ic: 'feather', l: 'Rumour' },
                    { ic: 'crown', l: 'Loot' },
                  ].map(s => (
                    <button key={s.l} className="lore-shortcut">
                      <Icon name={s.ic} size={20}/>
                      <span>{s.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              <aside className="lore-aside">
                <div className="eyebrow eyebrow-muted">Recent forgings</div>
                <div className="flex flex-col gap-2 mt-3">
                  {['The Bone-Singer of Phandalin', 'A glowing dwarven map', 'Theron the herbalist'].map(s => (
                    <div key={s} className="surface" style={{ padding: 12, fontSize: 13 }}>
                      <div className="micro" style={{ color: 'var(--violet)' }}>RUMOUR · 2d ago</div>
                      <div className="mt-1" style={{ color: 'var(--ink)' }}>{s}</div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChapterDetail({ chapter, campaign }) {
  return (
    <div className="surface-glow" style={{ padding: 28 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="kicker">CHAPTER {chapter.num}</div>
        <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
        <span className={`badge ${chapter.status === 'current' ? 'badge-gold' : chapter.status === 'past' ? 'badge-outline' : 'badge-violet'}`}>
          {chapter.status}
        </span>
      </div>
      <h3 className="display" style={{ fontSize: 28, marginBottom: 12 }}>{chapter.name}</h3>
      <div className="quote">"{chapter.summary}"</div>
      <div className="div-ornate" style={{ margin: '32px 0' }}>
        <span className="glyph">✦</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div className="eyebrow eyebrow-muted">Date</div>
          <div className="heading mt-1">{chapter.date}</div>
        </div>
        <div>
          <div className="eyebrow eyebrow-muted">Setting</div>
          <div className="heading mt-1">{campaign.setting.split('·')[0].trim()}</div>
        </div>
      </div>
      {chapter.status === 'current' && (
        <button className="btn btn-primary w-full mt-6">
          <Icon name="play" size={14}/> Continue this Chapter
        </button>
      )}
    </div>
  );
}

function LocationMini({ location }) {
  return (
    <div className="loc-mini">
      <div className="loc-mini-art">
        <CosmicImg glyph={location.name[0]} ratio="3/2"/>
        <span className="badge badge-violet" style={{ position: 'absolute', top: 10, left: 10 }}>{location.type}</span>
      </div>
      <div className="loc-mini-body">
        <div className="heading">{location.name}</div>
        <div className="micro mt-1">{location.region}</div>
        <p className="small mt-2">{location.desc}</p>
      </div>
    </div>
  );
}

Object.assign(window, { CampaignsOverview, CampaignDetail });
