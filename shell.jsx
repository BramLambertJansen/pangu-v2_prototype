/* Pangu v2 — Shell components: Starfield, Navigation, Dividers, Image placeholder, Modal */

const { useState, useEffect, useRef, useMemo } = React;

// ─── Starfield ──────────────────────────────────────────────────────
function Starfield({ density = 'subtle' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const counts = { off: 0, subtle: 80, full: 220 };
    const count = counts[density] ?? 80;
    const W = 1600, H = 1100;
    const stars = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.2 + 0.25;
      const o = Math.random() * 0.55 + 0.18;
      const isBright = Math.random() < 0.06;
      stars.push(
        `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" fill="${isBright ? '#f5c842' : '#e8e4f0'}" opacity="${o.toFixed(2)}"/>`
      );
      // few crosshair stars
      if (isBright) {
        stars.push(
          `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" opacity="${(o * 0.6).toFixed(2)}"><line x1="-4" y1="0" x2="4" y2="0" stroke="#f5c842" stroke-width="0.4"/><line x1="0" y1="-4" x2="0" y2="4" stroke="#f5c842" stroke-width="0.4"/></g>`
        );
      }
    }
    ref.current.innerHTML = stars.join('');
    ref.current.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ref.current.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  }, [density]);

  if (density === 'off') return null;
  return <svg ref={ref} className="starfield-stars" aria-hidden="true" />;
}

// ─── Image with cosmic placeholder ──────────────────────────────────
function CosmicImg({ glyph, label, ratio = '16/9', style = {}, accent }) {
  return (
    <div className="placeholder-img" style={{ aspectRatio: ratio, ...style }}>
      <svg viewBox="0 0 200 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
        {/* nebula swirl */}
        <defs>
          <radialGradient id={`g-${glyph || 'x'}`} cx="35%" cy="40%" r="55%">
            <stop offset="0%" stopColor={accent || '#9b8aff'} stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#9b8aff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="200" height="120" fill={`url(#g-${glyph || 'x'})`}/>
        {/* ring */}
        <circle cx="140" cy="80" r="28" stroke="rgba(245,200,66,0.15)" strokeWidth="0.5" fill="none" />
        <circle cx="140" cy="80" r="42" stroke="rgba(155,138,255,0.12)" strokeWidth="0.4" fill="none" />
        {/* tiny stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={Math.random() * 200} cy={Math.random() * 120} r={Math.random() * 0.8 + 0.2}
            fill="#e8e4f0" opacity={Math.random() * 0.5 + 0.2} />
        ))}
      </svg>
      <div className="ph-glyph" style={{ color: accent ? `${accent}66` : 'rgba(155,138,255,0.35)' }}>{glyph || '✦'}</div>
      {label && (
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,228,240,0.5)' }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Navigation: side rail on desktop, bottom bar on mobile ────────
function Navigation({ route, navigate }) {
  const items = [
    { id: 'home', label: 'Home', path: '/', icon: 'home' },
    { id: 'worlds', label: 'Worlds', path: '/worlds', icon: 'globe' },
    { id: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: 'book' },
    { id: 'characters', label: 'Characters', path: '/characters', icon: 'users' },
    { id: 'bestiary', label: 'Bestiary', path: '/bestiary', icon: 'skull' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: 'cog' },
  ];

  const isActive = (p) => {
    if (p === '/') return route === '/' || route === '';
    if (p === '/worlds') return route === '/worlds' || route.startsWith('/world/');
    if (p === '/campaigns') return route === '/campaigns' || route.startsWith('/campaign/') || route.startsWith('/session/') || route.startsWith('/world-builder/');
    if (p === '/characters') return route.startsWith('/character');
    return route.startsWith(p);
  };

  const settingsItem = items.find(i => i.id === 'settings');
  const mainItems = items.filter(i => i.id !== 'settings');

  return (
    <nav className="nav" data-screen-label="Navigation">
      <div className="nav-inner">
        {/* Logo */}
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="nav-logo">
          <div className="nav-mark">
            <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#f5c842" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="16" cy="16" r="9" fill="none" stroke="#9b8aff" strokeWidth="0.8"/>
              <circle cx="16" cy="16" r="3" fill="#9b8aff"/>
              <circle cx="28" cy="16" r="1.6" fill="#f5c842"/>
              <circle cx="16" cy="4" r="1.2" fill="#f0ecf7" opacity="0.8"/>
            </svg>
          </div>
          <div className="nav-wordmark">
            <div className="nav-title">PANGU</div>
            <div className="nav-sub">SANCTUM · II</div>
          </div>
        </a>

        <div className="nav-list">
          {mainItems.map((it) => (
            <a key={it.id} href={`#${it.path}`}
              onClick={(e) => { e.preventDefault(); navigate(it.path); }}
              className={`nav-item ${isActive(it.path) ? 'active' : ''}`}
              aria-current={isActive(it.path) ? 'page' : undefined}>
              <Icon name={it.icon} size={18} />
              <span className="nav-label">{it.label}</span>
            </a>
          ))}
        </div>

        <div className="nav-footer">
          <div className="nav-divider"/>
          <a href={`#${settingsItem.path}`}
            onClick={(e) => { e.preventDefault(); navigate(settingsItem.path); }}
            className={`nav-item ${isActive(settingsItem.path) ? 'active' : ''}`}>
            <Icon name={settingsItem.icon} size={18} />
            <span className="nav-label">{settingsItem.label}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Icon set (inline svg, no external deps) ─────────────────
function Icon({ name, size = 16, stroke = 1.6, ...rest }) {
  const s = size;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest };
  switch (name) {
    case 'home': return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'users': return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 20c0-2 1.5-3.5 4-3.5"/></svg>;
    case 'compass': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11z"/></svg>;
    case 'skull': return <svg {...props}><path d="M5 11a7 7 0 0114 0v3a2 2 0 01-2 2v3H7v-3a2 2 0 01-2-2z"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/><path d="M11 16h2"/></svg>;
    case 'cog': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M12 1.5v3M12 19.5v3M4.5 4.5l2 2M17.5 17.5l2 2M1.5 12h3M19.5 12h3M4.5 19.5l2-2M17.5 6.5l2-2"/></svg>;
    case 'sparkles': return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M11 5l-6 7 6 7"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l6 7-6 7"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="M9 5l7 7-7 7"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="M5 9l7 7 7-7"/></svg>;
    case 'play': return <svg {...props}><path d="M7 4v16l13-8z" fill="currentColor"/></svg>;
    case 'pause': return <svg {...props}><rect x="7" y="5" width="3" height="14" fill="currentColor"/><rect x="14" y="5" width="3" height="14" fill="currentColor"/></svg>;
    case 'heart': return <svg {...props}><path d="M12 21s-7-5-7-11a4 4 0 017-2.5A4 4 0 0119 10c0 6-7 11-7 11z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/></svg>;
    case 'swords': return <svg {...props}><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6 2 2-6 6zM16 16l4-4M22 4l-2 2"/></svg>;
    case 'dice': return <svg {...props}><path d="M12 3l9 5v8l-9 5-9-5V8z"/><path d="M12 3v18M3 8l9 5 9-5"/></svg>;
    case 'map-pin': return <svg {...props}><path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'book': return <svg {...props}><path d="M4 4h6a4 4 0 014 4v12a3 3 0 00-3-3H4z"/><path d="M20 4h-6a4 4 0 00-4 4v12a3 3 0 013-3h7z"/></svg>;
    case 'edit': return <svg {...props}><path d="M3 17v4h4l11-11-4-4L3 17z"/><path d="M14 6l4 4"/></svg>;
    case 'trash': return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case 'check': return <svg {...props}><path d="M4 12l5 5 11-12"/></svg>;
    case 'x': return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'sun': return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2"/></svg>;
    case 'moon': return <svg {...props}><path d="M20 14a8 8 0 11-10-10 7 7 0 0010 10z"/></svg>;
    case 'send': return <svg {...props}><path d="M21 3L3 11l8 3 3 8z"/><path d="M21 3L11 14"/></svg>;
    case 'zap': return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>;
    case 'compass-alt': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>;
    case 'crown': return <svg {...props}><path d="M3 8l3 8h12l3-8-5 3-4-6-4 6z"/><path d="M6 16h12"/></svg>;
    case 'feather': return <svg {...props}><path d="M20 4c-3 0-9 1-12 5s-3 8-4 11l13-13M12 12l-4 4"/></svg>;
    case 'eye': return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'globe': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case 'pen': return <svg {...props}><path d="M14 4l6 6L9 21H3v-6z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// ─── Ornamental divider ──────────────────────────────────────────
function OrnateDivider({ label, glyph = '✦' }) {
  return (
    <div className="div-ornate">
      <span className="glyph">{glyph} {label} {glyph}</span>
    </div>
  );
}

// ─── Compass rose flourish ───────────────────────────────────────
function CompassRose({ size = 56, opacity = 0.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }} aria-hidden="true">
      <g stroke="#9b8aff" strokeWidth="0.6" fill="none">
        <circle cx="50" cy="50" r="48"/>
        <circle cx="50" cy="50" r="36"/>
        <circle cx="50" cy="50" r="22"/>
      </g>
      <g stroke="#f5c842" strokeWidth="0.6" fill="none">
        <path d="M50 2v96M2 50h96"/>
        <path d="M14 14l72 72M86 14l-72 72" opacity="0.5"/>
      </g>
      <g fill="#f5c842">
        <polygon points="50,8 53,50 47,50"/>
        <polygon points="50,92 53,50 47,50" opacity="0.6"/>
      </g>
      <circle cx="50" cy="50" r="3" fill="#9b8aff"/>
    </svg>
  );
}

// ─── Modal ───────────────────────────────────────────────────────
function Modal({ open, onClose, title, eyebrow, children, footer, width = 540 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          {eyebrow && <div className="eyebrow eyebrow-violet">{eyebrow}</div>}
          <div className="flex items-center justify-between gap-3" style={{ marginTop: eyebrow ? 6 : 0 }}>
            <h2 className="display" style={{ fontSize: 24 }}>{title}</h2>
            <button className="btn-icon" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────
function PageHeader({ eyebrow, title, kicker, description, action, children }) {
  return (
    <header className="page-head">
      <div style={{ flex: 1, minWidth: 0 }}>
        {(eyebrow || kicker) && (
          <div className="flex items-center gap-3 mb-4">
            <div style={{ height: 1, width: 36, background: '#f5c842' }}/>
            <div className="eyebrow">{eyebrow || kicker}</div>
          </div>
        )}
        <h1 className="display-xl" style={{ textTransform: 'uppercase', marginBottom: 16 }}>
          {title}
        </h1>
        {description && <p className="body-lg" style={{ maxWidth: 580 }}>{description}</p>}
        {children}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </header>
  );
}

// ─── Export to global ───────────────────────────────────────────
Object.assign(window, { Starfield, CosmicImg, Navigation, Icon, OrnateDivider, CompassRose, Modal, PageHeader });
