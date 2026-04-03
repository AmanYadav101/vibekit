import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { THEMES } from "../themes";

export default function PublishedPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/public/pages/${slug}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setPage(data.page);
      // Track view
      fetch(`/api/public/pages/${slug}/view`, { method: "POST" });
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch(`/api/public/pages/${slug}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f0f0f",
          color: "#888",
        }}
      >
        Loading...
      </div>
    );

  if (notFound)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f0f0f",
          color: "#888",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "3rem" }}>404</div>
        <p>This page doesn't exist or hasn't been published yet.</p>
        <a href="/" style={{ color: "#a855f7" }}>
          ← Go home
        </a>
      </div>
    );

  const theme = THEMES[page.theme] || THEMES.minimal;
  const vars = theme.vars;
  const content = page.content;
  const sectionOrder = content?.sectionOrder || [
    "hero",
    "features",
    "gallery",
    "contact",
  ];

  const inlineStyle = Object.fromEntries(Object.entries(vars));

  return (
    <div
      style={{
        ...inlineStyle,
        background: vars["--bg"],
        color: vars["--text"],
        fontFamily: vars["--font-body"],
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;700&family=Cormorant+Garamond:wght@400;600;700&family=Press+Start+2P&family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Lato:wght@400;700&family=EB+Garamond&display=swap');

        .pub-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .pub-hero { padding: 6rem 2rem; text-align: center; border-bottom: 1px solid ${vars["--border"]}; }
        .pub-hero h1 { font-family: ${vars["--font-heading"]}; font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1.25rem; color: ${vars["--text"]}; line-height: 1.15; }
        .pub-hero p { font-size: 1.15rem; color: ${vars["--text-muted"]}; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.7; }
        .pub-btn { display: inline-block; background: ${vars["--accent"]}; color: ${vars["--accent-text"]}; padding: 1rem 2.5rem; border-radius: ${vars["--radius"]}; font-weight: 700; border: 2px solid ${vars["--border"]}; box-shadow: ${vars["--shadow"]}; cursor: pointer; text-decoration: none; font-family: ${vars["--font-body"]}; font-size: 1rem; transition: opacity 0.2s, transform 0.1s; }
        .pub-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .pub-btn:active { transform: scale(0.98); }
        .pub-features { padding: 5rem 2rem; background: ${vars["--surface"]}; }
        .pub-features h2 { font-family: ${vars["--font-heading"]}; text-align: center; font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 3rem; color: ${vars["--text"]}; }
        .pub-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
        .pub-feature-card { background: ${vars["--bg"]}; padding: 2rem; border-radius: ${vars["--radius"]}; border: 1px solid ${vars["--border"]}; box-shadow: ${vars["--shadow"]}; transition: transform 0.2s; }
        .pub-feature-card:hover { transform: translateY(-3px); }
        .pub-feature-card h3 { font-family: ${vars["--font-heading"]}; font-size: 1.15rem; margin-bottom: 0.75rem; color: ${vars["--accent"]}; }
        .pub-feature-card p { color: ${vars["--text-muted"]}; font-size: 0.95rem; line-height: 1.7; }
        .pub-gallery { padding: 5rem 2rem; background: ${vars["--bg"]}; }
        .pub-gallery h2 { font-family: ${vars["--font-heading"]}; text-align: center; font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 3rem; color: ${vars["--text"]}; }
        .pub-gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; max-width: 1100px; margin: 0 auto; }
        .pub-gallery-grid img { width: 100%; height: 220px; object-fit: cover; border-radius: ${vars["--radius"]}; border: 1px solid ${vars["--border"]}; transition: transform 0.2s; }
        .pub-gallery-grid img:hover { transform: scale(1.02); }
        .pub-contact { padding: 5rem 2rem; background: ${vars["--surface"]}; text-align: center; }
        .pub-contact h2 { font-family: ${vars["--font-heading"]}; font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 0.75rem; color: ${vars["--text"]}; }
        .pub-contact > p { color: ${vars["--text-muted"]}; margin-bottom: 2.5rem; }
        .pub-contact-form { max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; text-align: left; }
        .pub-contact-form input, .pub-contact-form textarea { background: ${vars["--bg"]}; border: 1px solid ${vars["--border"]}; border-radius: ${vars["--radius"]}; padding: 0.85rem 1rem; color: ${vars["--text"]}; font-family: ${vars["--font-body"]}; font-size: 0.95rem; width: 100%; outline: none; }
        .pub-contact-form textarea { resize: vertical; min-height: 130px; }
        .pub-success { background: #14291a; border: 1px solid #4ade80; color: #4ade80; padding: 1rem; border-radius: ${vars["--radius"]}; text-align: center; }
        .pub-footer { padding: 2rem; text-align: center; border-top: 1px solid ${vars["--border"]}; color: ${vars["--text-muted"]}; font-size: 0.8rem; background: ${vars["--bg"]}; }
        .pub-footer a { color: ${vars["--accent"]}; }

        @media (max-width: 768px) {
          .pub-hero { padding: 4rem 1.25rem; }
          .pub-features, .pub-gallery, .pub-contact { padding: 3rem 1.25rem; }
          .pub-features-grid, .pub-gallery-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .pub-hero { padding: 3rem 1rem; }
          .pub-features, .pub-gallery, .pub-contact { padding: 2.5rem 1rem; }
        }
      `}</style>

      <div className="pub-page">
        {sectionOrder.map((section) => {
          if (section === "hero")
            return (
              <section key="hero" className="pub-hero">
                <h1>{content?.hero?.title}</h1>
                <p>{content?.hero?.subtitle}</p>
                <a className="pub-btn" href={content?.hero?.buttonUrl || "#"}>
                  {content?.hero?.buttonText || "Get Started"}
                </a>
              </section>
            );

          if (section === "features")
            return (
              <section key="features" className="pub-features">
                <h2>Features</h2>
                <div className="pub-features-grid">
                  {(content?.features || []).map((f, i) => (
                    <div key={i} className="pub-feature-card">
                      <h3>{f.title}</h3>
                      <p>{f.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          if (section === "gallery")
            return (
              <section key="gallery" className="pub-gallery">
                <h2>Gallery</h2>
                <div className="pub-gallery-grid">
                  {(content?.gallery || []).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`Gallery ${i + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            );

          if (section === "contact")
            return (
              <section key="contact" className="pub-contact">
                <h2>{content?.contact?.title || "Contact Us"}</h2>
                <p>{content?.contact?.subtitle}</p>
                {formStatus === "sent" ? (
                  <div className="pub-success">
                    ✓ Message sent! We'll get back to you soon.
                  </div>
                ) : (
                  <form className="pub-contact-form" onSubmit={submitContact}>
                    <input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                    <textarea
                      placeholder="Your message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                    />
                    <button
                      type="submit"
                      className="pub-btn"
                      disabled={formStatus === "sending"}
                    >
                      {formStatus === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </section>
            );
          return null;
        })}

        <footer className="pub-footer">
          Built with <a href="/">⚡ VibeKit Studio</a>
        </footer>
      </div>
    </div>
  );
}
