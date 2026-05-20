/* Pangu v2 — Novel components: Initiative Wheel, Chapter Spine, Constellation Map, Dice Roller, Party Tile, Quest List */

const { useState: useStateW, useEffect: useEffectW, useMemo: useMemoW, useRef: useRefW } = React;

// ═══════════════════════════════════════════════════════════════════
//  INITIATIVE WHEEL — circular combat tracker
//  Current turn sits at top of wheel; ring rotates between turns
// ═══════════════════════════════════════════════════════════════════
function InitiativeWheel({ initial }) {
  const [combatants, setCombatants] = useStateW(initial || [
    { id: 'lyria',   name: 'Lyria',   init: 18, hp: 28, maxHp: 32, isPC: true,  glyph: '✦', accent: '#9b8aff' },
    { id: 'gob1',    name: 'Goblin α', init: 15, hp: 7,  maxHp: 7,  isPC: false, glyph: '☩', accent: '#ff6b6b' },
    { id: 'thokk',   name: 'Thokk',   init: 12, hp: 45, maxHp: 50, isPC: true,  glyph: '⚒', accent: '#f5c842' },
    { id: 'kael',    name: 'Kael',    init: 11, hp: 24, maxHp: 32, isPC: true,  glyph: '☾', accent: '#6ba7ff' },
    { id: 'gob2',    name: 'Goblin β', init: 8,  hp: 7,  maxHp: 7,  isPC: false, glyph: '☩', accent: '#ff6b6b' },
    { id: 'elowen',  name: 'Elowen',  init: 14, hp: 32, maxHp: 38, isPC: true,  glyph: '❦', accent: '#3ecfb2' },
  ]);

  const [turnIdx, setTurnIdx] = useStateW(0);
  const [round, setRound] = useStateW(3);
  const sorted = useMemoW(() => [...combatants].sort((a, b) => b.init - a.init), [combatants]);
  const current = sorted[turnIdx];

  const next = () => {
    if (turnIdx + 1 >= sorted.length) {
      setRound(r => r + 1);
      setTurnIdx(0);
    } else {
      setTurnIdx(turnIdx + 1);
    }
  };

  const updateHp = (id, delta) => {
    setCombatants(prev => prev.map(c =>
      c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) } : c
    ));
  };

  const n = sorted.length;
  const radius = 145;

  return (
    <div className="wheel-card surface-glow">
      <div className="wheel-head">
        <div className="flex items-center gap-3">
          <Icon name="swords" size={18} stroke={1.4} />
          <div className="title" style={{ fontSize: 14, letterSpacing: '0.22em' }}>INITIATIVE</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="eyebrow eyebrow-muted">Round</div>
          <div className="font-mono" style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 700 }}>{String(round).padStart(2, '0')}</div>
        </div>
      </div>

      <div className="wheel-stage">
        {/* Concentric rings */}
        <svg viewBox="-180 -180 360 360" className="wheel-rings">
          <defs>
            <radialGradient id="wheel-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9b8aff" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#9b8aff" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle r="170" fill="none" stroke="rgba(155,138,255,0.06)" strokeWidth="0.5"/>
          <circle r="155" fill="none" stroke="rgba(155,138,255,0.1)" strokeWidth="0.5" strokeDasharray="2 4"/>
          <circle r="100" fill="url(#wheel-core)"/>
          <circle r="85" fill="none" stroke="rgba(245,200,66,0.2)" strokeWidth="0.4"/>
          {/* Tick marks */}
          {Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const x1 = Math.cos(a) * 130;
            const y1 = Math.sin(a) * 130;
            const x2 = Math.cos(a) * 160;
            const y2 = Math.sin(a) * 160;
            const active = i === turnIdx;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={active ? '#f5c842' : 'rgba(155,138,255,0.2)'}
                strokeWidth={active ? 1.5 : 0.6} />
            );
          })}
          {/* "Now" pointer */}
          <g transform={`rotate(${(turnIdx / n) * 360})`} style={{ transition: 'transform 480ms cubic-bezier(.2,.7,.2,1)' }}>
            <path d="M 0 -178 L -8 -160 L 8 -160 Z" fill="#f5c842" />
          </g>
        </svg>

        {/* Avatars positioned around wheel */}
        {sorted.map((c, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * radius;
          const y = Math.sin(a) * radius;
          const active = i === turnIdx;
          const hpPct = (c.hp / c.maxHp) * 100;
          return (
            <button key={c.id} className={`wheel-token ${active ? 'active' : ''} ${c.isPC ? 'pc' : 'npc'}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                '--accent': c.accent,
              }}
              onClick={() => setTurnIdx(i)}
              aria-label={`${c.name}, initiative ${c.init}, HP ${c.hp}/${c.maxHp}`}>
              <div className="wheel-token-init">{c.init}</div>
              <div className="wheel-token-avatar">
                <span>{c.glyph}</span>
              </div>
              <div className="wheel-token-hp">
                <div className="wheel-token-hp-fill" style={{ width: `${hpPct}%`, background: hpPct < 30 ? 'var(--crimson)' : c.isPC ? 'var(--teal)' : '#ff8888' }}/>
              </div>
            </button>
          );
        })}

        {/* Center plinth */}
        <div className="wheel-center">
          <div className="eyebrow eyebrow-muted">Now Acting</div>
          <div className="display" style={{ fontSize: 26, marginTop: 4 }}>{current?.name}</div>
          <div className="font-mono small mt-1" style={{ color: 'var(--gold)' }}>
            INIT {current?.init} · HP {current?.hp}/{current?.maxHp}
          </div>
          <div className="flex gap-2 mt-3 justify-center">
            <button className="btn-icon" onClick={() => updateHp(current.id, -1)} title="-1 HP"><Icon name="chevron-down" size={14} /></button>
            <button className="btn-icon" onClick={() => updateHp(current.id, +1)} title="+1 HP"><Icon name="check" size={14} /></button>
          </div>
        </div>
      </div>

      <div className="wheel-foot">
        <button className="btn btn-violet-soft btn-sm">
          <Icon name="plus" size={14} /> Add
        </button>
        <button className="btn btn-primary" onClick={next}>
          End Turn <Icon name="arrow-right" size={14}/>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CHAPTER SPINE — vertical campaign timeline
// ═══════════════════════════════════════════════════════════════════
function ChapterSpine({ chapters, onSelect, selected }) {
  return (
    <div className="spine">
      <div className="spine-line" />
      {chapters.map((ch, i) => {
        const isSel = selected === ch.num;
        return (
          <button key={ch.num} className={`spine-node spine-${ch.status} ${isSel ? 'selected' : ''}`}
            onClick={() => onSelect && onSelect(ch.num)}>
            <div className="spine-mark">
              <div className="spine-roman">{toRoman(ch.num)}</div>
              {ch.status === 'current' && <div className="spine-pulse"/>}
            </div>
            <div className="spine-body">
              <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                <div className="eyebrow" style={{ fontSize: 9, color: ch.status === 'past' ? 'var(--muted)' : ch.status === 'current' ? 'var(--gold)' : 'var(--subtle)' }}>
                  CHAPTER {ch.num} · {ch.date}
                </div>
                {ch.status === 'current' && <span className="badge badge-gold">NOW</span>}
              </div>
              <div className="title" style={{ fontSize: 17, color: ch.status === 'future' ? 'var(--muted)' : 'var(--ink)' }}>{ch.name}</div>
              <p className="small mt-2" style={{ lineHeight: 1.55, color: ch.status === 'future' ? 'var(--subtle)' : 'var(--ink-soft)' }}>
                {ch.summary}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function toRoman(num) {
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let result = '';
  for (const [r, v] of map) { while (num >= v) { result += r; num -= v; } }
  return result;
}

// ═══════════════════════════════════════════════════════════════════
//  CONSTELLATION MAP — locations as connected stars
// ═══════════════════════════════════════════════════════════════════
function ConstellationMap({ locations, selectedId, onSelect, height = 480 }) {
  const [hover, setHover] = useStateW(null);

  // pre-compute pairs of nearby locations for connecting lines
  const lines = useMemoW(() => {
    const result = [];
    for (let i = 0; i < locations.length; i++) {
      const distances = locations
        .map((l, j) => ({ j, d: Math.hypot(locations[i].x - l.x, locations[i].y - l.y) }))
        .filter(d => d.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      distances.forEach(({ j }) => {
        const key = [Math.min(i, j), Math.max(i, j)].join('-');
        if (!result.find(r => r.key === key)) {
          result.push({ key, a: locations[i], b: locations[j] });
        }
      });
    }
    return result;
  }, [locations]);

  const typeColor = (t) => ({
    City: '#f5c842', Town: '#f5c842', Cave: '#6ba7ff',
    Ruin: '#ff6b6b', Dungeon: '#9b8aff', Forest: '#3ecfb2',
  })[t] || '#9b8aff';

  return (
    <div className="constellation surface-glow" style={{ height }}>
      {/* Nebula background */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="constellation-svg">
        <defs>
          <radialGradient id="neb-a" cx="30%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#9b8aff" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#9b8aff" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="neb-b" cx="70%" cy="70%" r="40%">
            <stop offset="0%" stopColor="#f5c842" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#f5c842" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#neb-a)"/>
        <rect width="100" height="100" fill="url(#neb-b)"/>
      </svg>

      {/* Connecting lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="constellation-lines">
        {lines.map(l => (
          <line key={l.key} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y}
            stroke="rgba(155,138,255,0.18)" strokeWidth="0.12" strokeDasharray="0.8 0.8"/>
        ))}
      </svg>

      {/* Tiny background stars */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="constellation-lines">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100}
            r={Math.random() * 0.2 + 0.08}
            fill="#e8e4f0" opacity={Math.random() * 0.4 + 0.15}/>
        ))}
      </svg>

      {/* Location markers */}
      {locations.map(loc => {
        const isSel = selectedId === loc.id;
        const isHover = hover === loc.id;
        const color = typeColor(loc.type);
        return (
          <button key={loc.id} className={`star-marker ${isSel ? 'selected' : ''}`}
            style={{
              left: `${loc.x}%`,
              top: `${loc.y}%`,
              '--marker-color': color,
            }}
            onMouseEnter={() => setHover(loc.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect && onSelect(loc)}>
            <span className="star-glow"/>
            <span className="star-core"/>
            <span className="star-cross"/>
            <span className="star-label" style={{ opacity: isSel || isHover ? 1 : 0.65 }}>
              {loc.name}
            </span>
          </button>
        );
      })}

      {/* Legend */}
      <div className="constellation-legend">
        <div className="eyebrow eyebrow-muted" style={{ marginBottom: 8 }}>Region · Sword Coast</div>
        <div className="flex gap-3 flex-wrap" style={{ fontSize: 11 }}>
          <span className="flex items-center gap-1"><span className="leg-dot" style={{ background: '#f5c842' }}/>Town</span>
          <span className="flex items-center gap-1"><span className="leg-dot" style={{ background: '#9b8aff' }}/>Dungeon</span>
          <span className="flex items-center gap-1"><span className="leg-dot" style={{ background: '#ff6b6b' }}/>Ruin</span>
          <span className="flex items-center gap-1"><span className="leg-dot" style={{ background: '#6ba7ff' }}/>Cave</span>
        </div>
      </div>

      {/* Compass */}
      <div className="constellation-compass">
        <CompassRose size={48} opacity={0.6}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DICE ROLLER — physical-feeling d20
// ═══════════════════════════════════════════════════════════════════
function DiceRoller({ compact }) {
  const [result, setResult] = useStateW(null);
  const [rolling, setRolling] = useStateW(false);
  const [history, setHistory] = useStateW([]);
  const [lastDie, setLastDie] = useStateW(20);

  const roll = (sides) => {
    if (rolling) return;
    setLastDie(sides);
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.floor(Math.random() * sides) + 1;
      setResult({ value: r, sides, crit: sides === 20 && r === 20, fumble: sides === 20 && r === 1 });
      setHistory(h => [{ d: sides, v: r }, ...h].slice(0, 6));
      setRolling(false);
    }, 700);
  };

  const dice = [4, 6, 8, 10, 12, 20, 100];

  return (
    <div className={`dice-card surface-glow ${compact ? 'dice-compact' : ''}`}>
      <div className="dice-head">
        <div className="title" style={{ fontSize: 13, letterSpacing: '0.22em' }}>DICE</div>
        <button className="btn-icon" onClick={() => { setResult(null); setHistory([]); }} title="Clear"><Icon name="x" size={14}/></button>
      </div>

      <div className="dice-stage">
        <div className={`d20 ${rolling ? 'rolling' : ''} ${result?.crit ? 'crit' : ''} ${result?.fumble ? 'fumble' : ''}`}>
          <div className="d20-face d20-f1"/>
          <div className="d20-face d20-f2"/>
          <div className="d20-face d20-f3"/>
          <div className="d20-face d20-f4"/>
          <div className="d20-result">
            {rolling ? '?' : (result?.value ?? '–')}
          </div>
        </div>
        <div className="dice-meta">
          <div className="eyebrow eyebrow-muted">{rolling ? 'Rolling…' : result ? `d${result.sides}` : `d${lastDie}`}</div>
          {result?.crit && <div className="kicker glow-gold">NAT 20!</div>}
          {result?.fumble && <div className="kicker" style={{ color: 'var(--crimson)' }}>FUMBLE</div>}
          {!result && !rolling && <div className="small">Pick a die</div>}
        </div>
      </div>

      <div className="dice-grid">
        {dice.map(s => (
          <button key={s} className={`die-btn ${lastDie === s ? 'active' : ''}`} onClick={() => roll(s)} disabled={rolling}>
            d{s}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="dice-history">
          <div className="eyebrow eyebrow-muted" style={{ marginBottom: 6 }}>Recent</div>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <span key={i} className="chip font-mono" style={{ fontSize: 11 }}>
                <span style={{ color: 'var(--muted)' }}>d{h.d}:</span>
                <span style={{ color: i === 0 ? 'var(--gold)' : 'var(--ink)' }}>{h.v}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PARTY HEX — character tile w/ HP ring
// ═══════════════════════════════════════════════════════════════════
function PartyTile({ character, onClick }) {
  const c = character;
  const hpPct = Math.round((c.hp / c.maxHp) * 100);
  const xpPct = Math.round((c.xp / c.xpNext) * 100);
  return (
    <button className="party-tile clickable" style={{ '--accent': c.accent }} onClick={onClick}>
      <div className="party-tile-hex">
        <div className="party-tile-hex-inner">
          <span className="party-tile-glyph">{c.glyph}</span>
        </div>
        <svg viewBox="0 0 100 100" className="party-tile-ring">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
          <circle cx="50" cy="50" r="46" fill="none" stroke={hpPct < 30 ? 'var(--crimson)' : 'var(--teal)'} strokeWidth="2"
            strokeDasharray={`${(hpPct / 100) * 289} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 600ms' }}/>
        </svg>
      </div>
      <div className="party-tile-body">
        <div className="party-tile-name">{c.name}</div>
        <div className="micro" style={{ marginTop: 2 }}>Lv {c.level} · {c.race} {c.class}</div>
        <div className="party-tile-stats">
          <div className="party-stat">
            <Icon name="heart" size={11} stroke={2}/>
            <span className="font-mono" style={{ fontWeight: 700, color: hpPct < 30 ? 'var(--crimson)' : 'var(--ink)' }}>
              {c.hp}/{c.maxHp}
            </span>
          </div>
          <div className="party-stat">
            <Icon name="shield" size={11} stroke={2}/>
            <span className="font-mono" style={{ fontWeight: 700 }}>{c.ac}</span>
          </div>
        </div>
        <div className="party-xp">
          <div className="party-xp-bar" style={{ width: `${xpPct}%` }}/>
        </div>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  QUEST LIST
// ═══════════════════════════════════════════════════════════════════
function QuestList({ quests, compact }) {
  const priColor = { critical: 'var(--crimson)', major: 'var(--gold)', minor: 'var(--violet)' };
  const statusBadge = { active: 'badge-violet', completed: 'badge-teal', pending: 'badge-outline' };
  return (
    <div className="quest-list">
      {quests.map(q => (
        <div key={q.id} className={`quest-item ${q.status === 'completed' ? 'is-done' : ''}`}>
          <div className="quest-marker" style={{ background: priColor[q.priority] }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
              <span className={`badge ${statusBadge[q.status] || 'badge-outline'}`}>{q.status}</span>
              <span className="micro" style={{ color: priColor[q.priority] }}>{q.priority}</span>
            </div>
            <div className="heading">{q.title}</div>
            {!compact && <p className="small mt-1">{q.desc}</p>}
            {!compact && <div className="micro mt-2" style={{ color: 'var(--gold)' }}>REWARD · {q.reward}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  NPC CARD — small portrait + role
// ═══════════════════════════════════════════════════════════════════
function NpcCard({ npc, onClick }) {
  const moodColor = {
    urgent: 'var(--crimson)', enemy: 'var(--crimson)', dangerous: 'var(--crimson)',
    ally: 'var(--teal)', neutral: 'var(--muted)', uncertain: 'var(--gold)',
  };
  const glyph = { urgent: '!', enemy: '✗', dangerous: '☠', ally: '✓', neutral: '·', uncertain: '?' };
  return (
    <button className="npc-card clickable" onClick={onClick}>
      <div className="npc-portrait" style={{ '--mood-color': moodColor[npc.mood] || 'var(--violet)' }}>
        <CosmicImg glyph={npc.name[0]} ratio="1/1" accent={moodColor[npc.mood]} />
        <div className="npc-mood-dot">{glyph[npc.mood] || '·'}</div>
      </div>
      <div className="npc-meta">
        <div className="heading" style={{ fontSize: 14 }}>{npc.name}</div>
        <div className="micro">{npc.role}</div>
        <p className="small mt-2" style={{ fontFamily: 'var(--font-quote)', fontStyle: 'italic' }}>"{npc.desc}"</p>
      </div>
    </button>
  );
}

Object.assign(window, {
  InitiativeWheel, ChapterSpine, ConstellationMap, DiceRoller, PartyTile, QuestList, NpcCard
});
