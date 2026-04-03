import { Link } from "react-router-dom";

const EXAMPLE_THEMES = [
  {
    name: "Minimal / Editorial",
    bg: "#ffffff",
    accent: "#111111",
    text: "#111111",
    surface: "#f5f5f5",
    desc: "Clean, typography-first design",
  },
  {
    name: "Dark / Neon",
    bg: "#0a0a0f",
    accent: "#00ffcc",
    text: "#e0e0ff",
    surface: "#12121a",
    desc: "Cyberpunk vibes, glowing accents",
  },
  {
    name: "Luxury / Serif",
    bg: "#0d0d0d",
    accent: "#c9a84c",
    text: "#e8d5b0",
    surface: "#1a1612",
    desc: "Elegant gold on deep black",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      `}</style>

      {/* Nav */}
      <nav className="landing-nav">
        <span className="landing-logo">⚡ VibeKit</span>
        <div className="landing-nav-links">
          <Link to="/login">Sign in</Link>
          <Link to="/signup" className="btn-primary">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-badge">✨ Build beautiful pages in minutes</div>
        <h1>
          Generate a theme.
          <br />
          Build a mini-site.
          <br />
          <span className="hero-accent">Publish it.</span>
        </h1>
        <p>
          VibeKit Studio lets you pick a vibe, customize your content, and
          publish a polished page — no code needed.
        </p>
        <div className="hero-ctas">
          <Link to="/signup" className="btn-primary btn-lg">
            Create your first page →
          </Link>
          <Link to="/login" className="btn-outline">
            Sign in
          </Link>
        </div>
      </section>

      {/* Theme Showcase */}
      <section className="landing-themes">
        <h2>Pick your vibe</h2>
        <p className="section-subtitle">
          6 handcrafted themes, each with its own personality
        </p>
        <div className="themes-showcase">
          {EXAMPLE_THEMES.map((t, i) => (
            <div
              key={i}
              className="theme-preview-card"
              style={{ background: t.bg, border: `1px solid ${t.accent}33` }}
            >
              <div
                className="tpc-header"
                style={{
                  background: t.surface,
                  borderBottom: `1px solid ${t.accent}33`,
                }}
              >
                <div className="tpc-dots">
                  <span style={{ background: "#ff5f57" }} />
                  <span style={{ background: "#febc2e" }} />
                  <span style={{ background: "#28c840" }} />
                </div>
              </div>
              <div className="tpc-body">
                <div
                  className="tpc-hero-bar"
                  style={{ background: t.accent, opacity: 0.9 }}
                />
                <div
                  className="tpc-line"
                  style={{ background: t.text, opacity: 0.6 }}
                />
                <div
                  className="tpc-line short"
                  style={{ background: t.text, opacity: 0.3 }}
                />
                <div className="tpc-btn" style={{ background: t.accent }} />
              </div>
              <div className="tpc-info">
                <strong
                  style={{
                    color:
                      t.text === "#ffffff" ||
                      t.text === "#e0e0ff" ||
                      t.text === "#e8d5b0"
                        ? t.text
                        : "#111",
                  }}
                >
                  {t.name}
                </strong>
                <span>{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2>Everything you need</h2>
        <p className="section-subtitle">Built for speed, designed for beauty</p>
        <div className="features-grid">
          {[
            {
              icon: "🎨",
              title: "6 Vibe Themes",
              desc: "From minimal editorial to retro pixel — pick your aesthetic.",
            },
            {
              icon: "✏️",
              title: "Live Editor",
              desc: "See changes instantly with our real-time preview at desktop, tablet, and mobile widths.",
            },
            {
              icon: "🚀",
              title: "One-click Publish",
              desc: "Publish your page to a unique URL instantly. Share it anywhere.",
            },
            {
              icon: "📊",
              title: "View Tracking",
              desc: "See how many people have visited your published page.",
            },
            {
              icon: "📬",
              title: "Contact Forms",
              desc: "Built-in contact section collects messages from your visitors.",
            },
            {
              icon: "📱",
              title: "Mobile-first",
              desc: "Every published page looks great on any device, guaranteed.",
            },
          ].map((f, i) => (
            <div key={i} className="landing-feature-card">
              <div className="lfc-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to build your vibe?</h2>
        <p>Free to use. No credit card required.</p>
        <Link to="/signup" className="btn-primary btn-lg">
          Create your first page →
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>⚡ VibeKit Studio</span>
        <span>Built with React + Netlify Functions + PostgreSQL</span>
      </footer>
    </div>
  );
}
