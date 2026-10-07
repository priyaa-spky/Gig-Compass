export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <section className="auth-side">
        <div className="brand brand-light">
          <span className="brand-mark">PD</span>
          <span>Placement Desk</span>
        </div>
        <h1>Every opening, application and interview in one place.</h1>
        <p>Apply before the deadline, see where each application stands, and never miss an interview slot.</p>
      </section>
      <section className="auth-main">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-foot">{footer}</p>
        </div>
      </section>
    </div>
  );
}
