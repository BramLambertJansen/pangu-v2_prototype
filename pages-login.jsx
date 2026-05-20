/* Pangu v2 — Login page: email + password, SSO, register */

const { useState: useLoginState } = React;

function SsoButton({ icon, label, onClick }) {
  return (
    <button className="sso-btn" onClick={onClick} type="button">
      <span className="sso-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2 12 2 12a17.5 17.5 0 014.09-5.4"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c5 0 10 8 10 8a17.3 17.3 0 01-2.06 2.94"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function LoginLogo() {
  return (
    <div className="login-logo">
      <div className="login-logo-mark">
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
          <circle cx="16" cy="16" r="14" fill="none" stroke="#f5c842" strokeWidth="0.5" opacity="0.5"/>
          <circle cx="16" cy="16" r="9" fill="none" stroke="#9b8aff" strokeWidth="0.8"/>
          <circle cx="16" cy="16" r="3" fill="#9b8aff"/>
          <circle cx="28" cy="16" r="1.6" fill="#f5c842"/>
          <circle cx="16" cy="4" r="1.2" fill="#f0ecf7" opacity="0.8"/>
        </svg>
      </div>
      <div>
        <div className="login-logo-title">PANGU</div>
        <div className="login-logo-sub">SANCTUM · II</div>
      </div>
    </div>
  );
}

// ─── Login page ───────────────────────────────────────────────────────
function LoginPage({ navigate }) {
  const [email, setEmail] = useLoginState('');
  const [password, setPassword] = useLoginState('');
  const [showPw, setShowPw] = useLoginState(false);
  const [loading, setLoading] = useLoginState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 900);
  };

  const handleSso = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 700);
  };

  return (
    <div className="login-root">
      <div className="starfield-bg" style={{ position: 'fixed' }}/>
      <Starfield density="subtle"/>
      <div className="grain" style={{ position: 'fixed' }}/>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card-logo">
            <LoginLogo />
          </div>

          <div className="login-card-head">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ height: 1, width: 28, background: 'var(--gold)' }}/>
              <span className="eyebrow">Welkom terug</span>
            </div>
            <h1 className="display" style={{ fontSize: 26 }}>Aanmelden</h1>
          </div>

          <div className="login-sso">
            <SsoButton icon={<GoogleIcon />} label="Doorgaan met Google" onClick={handleSso}/>
            <SsoButton icon={<DiscordIcon />} label="Doorgaan met Discord" onClick={handleSso}/>
          </div>

          <div className="login-divider">
            <span>of via e-mail</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field">
              <label className="label" htmlFor="login-email">E-mailadres</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 8l10 6 10-6"/>
                </svg>
                <input
                  id="login-email" type="email" className="input input-lg"
                  placeholder="naam@domein.nl" value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email" required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <label className="label" htmlFor="login-password" style={{ margin: 0 }}>Wachtwoord</label>
                <button type="button" className="login-link" style={{ fontSize: 11 }} onClick={() => {}}>
                  Vergeten?
                </button>
              </div>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="login-password" type={showPw ? 'text' : 'password'} className="input input-lg"
                  placeholder="••••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <button type="button" className="login-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Verberg wachtwoord' : 'Toon wachtwoord'}>
                  <EyeIcon visible={showPw}/>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full login-submit-btn" disabled={loading}>
              {loading
                ? <><span className="login-spinner" aria-hidden="true"/> Aanmelden…</>
                : <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Aanmelden
                  </>
              }
            </button>
          </form>

          <div className="login-footer">
            <span className="small">Nog geen account?</span>
            <button className="login-link" onClick={() => navigate('/register')} type="button">
              Registreer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Register page ───────────────────────────────────────────────────
function RegisterPage({ navigate }) {
  const [email, setEmail] = useLoginState('');
  const [password, setPassword] = useLoginState('');
  const [confirm, setConfirm] = useLoginState('');
  const [name, setName] = useLoginState('');
  const [showPw, setShowPw] = useLoginState(false);
  const [loading, setLoading] = useLoginState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 900);
  };

  return (
    <div className="login-root">
      <div className="starfield-bg" style={{ position: 'fixed' }}/>
      <Starfield density="subtle"/>
      <div className="grain" style={{ position: 'fixed' }}/>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card-logo">
            <LoginLogo />
          </div>

          <div className="login-card-head">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ height: 1, width: 28, background: 'var(--gold)' }}/>
              <span className="eyebrow">Nieuw account</span>
            </div>
            <h1 className="display" style={{ fontSize: 26 }}>Registreren</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field">
              <label className="label" htmlFor="reg-name">Naam</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <input
                  id="reg-name" type="text" className="input input-lg"
                  placeholder="Naam of alias" value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name" required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="label" htmlFor="reg-email">E-mailadres</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 8l10 6 10-6"/>
                </svg>
                <input
                  id="reg-email" type="email" className="input input-lg"
                  placeholder="naam@domein.nl" value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email" required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="label" htmlFor="reg-password">Wachtwoord</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="reg-password" type={showPw ? 'text' : 'password'} className="input input-lg"
                  placeholder="Kies een sterk wachtwoord" value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password" required
                />
                <button type="button" className="login-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Verberg wachtwoord' : 'Toon wachtwoord'}>
                  <EyeIcon visible={showPw}/>
                </button>
              </div>
            </div>

            <div className="login-field">
              <label className="label" htmlFor="reg-confirm">Bevestig wachtwoord</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12l5 5 11-12"/>
                </svg>
                <input
                  id="reg-confirm" type={showPw ? 'text' : 'password'} className="input input-lg"
                  placeholder="Herhaal wachtwoord" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password" required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full login-submit-btn" disabled={loading}>
              {loading
                ? <><span className="login-spinner" aria-hidden="true"/> Account aanmaken…</>
                : <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Account aanmaken
                  </>
              }
            </button>
          </form>

          <div className="login-footer">
            <span className="small">Al een account?</span>
            <button className="login-link" onClick={() => navigate('/login')} type="button">
              Aanmelden
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { LoginPage, RegisterPage });
