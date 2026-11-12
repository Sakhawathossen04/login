export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="shell">
      <aside className="brand">
        <div className="logo">◆ YourApp</div>
        <div>
          <p className="kicker">Secure access</p>
          <h1>Sign in once.<br />Pick up where you left off.</h1>
          <p className="sub">One account for everything you build here.</p>
        </div>
        <small>© YourApp</small>
      </aside>
      <section className="panel">
        <div className="card">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
