import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { THEMES, applyTheme } from "../themes";

const SECTION_ORDER_DEFAULT = ["hero", "features", "gallery", "contact"];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [content, setContent] = useState(null);
  const [theme, setTheme] = useState("minimal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${id}`, { credentials: "include" });
      const data = await res.json();
      setPage(data.page);
      setContent(data.page.content);
      setTheme(data.page.theme);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    setSaving(true);
    try {
      await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme, content }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    setPublishing(true);
    const action = page.status === "published" ? "unpublish" : "publish";
    try {
      const res = await fetch(`/api/pages/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const updateContent = (section, value) => {
    setContent((prev) => ({ ...prev, [section]: value }));
  };

  const moveSection = (index, direction) => {
    const order = [...(content.sectionOrder || SECTION_ORDER_DEFAULT)];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= order.length) return;
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    setContent((prev) => ({ ...prev, sectionOrder: order }));
  };

  if (loading) return <div className="editor-loading">Loading editor...</div>;
  if (!page) return <div className="editor-loading">Page not found</div>;

  const sectionOrder = content?.sectionOrder || SECTION_ORDER_DEFAULT;
  const previewWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div className="editor-layout">
      {/* Top Bar */}
      <header className="editor-topbar">
        <button className="btn-ghost" onClick={() => navigate("/app")}>
          ← Back
        </button>
        <span className="editor-title">{page.title}</span>
        <div className="editor-topbar-actions">
          <div className="preview-toggle">
            {["desktop", "tablet", "mobile"].map((mode) => (
              <button
                key={mode}
                className={`preview-btn ${previewMode === mode ? "active" : ""}`}
                onClick={() => setPreviewMode(mode)}
              >
                {mode === "desktop" ? "🖥" : mode === "tablet" ? "📱" : "📲"}
              </button>
            ))}
          </div>
          <button className="btn-ghost" onClick={savePage} disabled={saving}>
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
          </button>
          <button
            className={`btn-publish ${page.status === "published" ? "published" : ""}`}
            onClick={togglePublish}
            disabled={publishing}
          >
            {publishing
              ? "..."
              : page.status === "published"
                ? "Unpublish"
                : "Publish"}
          </button>
          {page.status === "published" && (
            <button
              className="btn-ghost"
              onClick={() => window.open(`/p/${page.slug}`, "_blank")}
            >
              View ↗
            </button>
          )}
        </div>
      </header>

      <div className="editor-body">
        {/* Left Panel — Controls */}
        <aside className="editor-panel">
          {/* Theme Picker */}
          <div className="panel-section">
            <h3>Theme</h3>
            <div className="theme-grid">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  className={`theme-chip ${theme === key ? "active" : ""}`}
                  onClick={() => setTheme(key)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Nav */}
          <div className="panel-section">
            <h3>Sections</h3>
            <div className="section-nav">
              {sectionOrder.map((section, index) => (
                <div key={section} className="section-nav-item">
                  <button
                    className={`section-nav-btn ${activeSection === section ? "active" : ""}`}
                    onClick={() => setActiveSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                  <div className="section-nav-arrows">
                    <button
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sectionOrder.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Editor */}
          <div className="panel-section">
            <h3>
              Edit:{" "}
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h3>
            {activeSection === "hero" && (
              <HeroEditor
                content={content.hero}
                onChange={(v) => updateContent("hero", v)}
              />
            )}
            {activeSection === "features" && (
              <FeaturesEditor
                content={content.features}
                onChange={(v) => updateContent("features", v)}
              />
            )}
            {activeSection === "gallery" && (
              <GalleryEditor
                content={content.gallery}
                onChange={(v) => updateContent("gallery", v)}
              />
            )}
            {activeSection === "contact" && (
              <ContactEditor
                content={content.contact}
                onChange={(v) => updateContent("contact", v)}
              />
            )}
          </div>
        </aside>

        {/* Right Panel — Preview */}
        <main className="editor-preview-area">
          <div
            className="preview-container"
            style={{ maxWidth: previewWidths[previewMode] }}
          >
            <PreviewFrame content={content} theme={theme} />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Section Editors ---

function HeroEditor({ content, onChange }) {
  return (
    <div className="section-editor">
      <div className="form-group">
        <label>Title</label>
        <input
          value={content?.title || ""}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Subtitle</label>
        <textarea
          value={content?.subtitle || ""}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>Button Text</label>
        <input
          value={content?.buttonText || ""}
          onChange={(e) => onChange({ ...content, buttonText: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Button URL</label>
        <input
          value={content?.buttonUrl || ""}
          onChange={(e) => onChange({ ...content, buttonUrl: e.target.value })}
        />
      </div>
    </div>
  );
}

function FeaturesEditor({ content, onChange }) {
  const features = content || [];
  const update = (index, field, value) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f,
    );
    onChange(updated);
  };
  const add = () =>
    onChange([...features, { title: "New Feature", description: "" }]);
  const remove = (index) => onChange(features.filter((_, i) => i !== index));

  return (
    <div className="section-editor">
      {features.map((f, i) => (
        <div key={i} className="feature-item">
          <div className="feature-item-header">
            <span>Feature {i + 1}</span>
            <button className="btn-remove" onClick={() => remove(i)}>
              ✕
            </button>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              value={f.title}
              onChange={(e) => update(i, "title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={f.description}
              onChange={(e) => update(i, "description", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}
      {features.length < 6 && (
        <button className="btn-add" onClick={add}>
          + Add Feature
        </button>
      )}
    </div>
  );
}

function GalleryEditor({ content, onChange }) {
  const images = content || [];
  const update = (index, value) => {
    const updated = images.map((img, i) =>
      i === index ? { url: value } : img,
    );
    onChange(updated);
  };
  const add = () =>
    onChange([
      ...images,
      { url: "https://picsum.photos/seed/" + Date.now() + "/600/400" },
    ]);
  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="section-editor">
      {images.map((img, i) => (
        <div key={i} className="gallery-item">
          <div className="form-group">
            <label>Image URL {i + 1}</label>
            <div className="gallery-input-row">
              <input
                value={img.url}
                onChange={(e) => update(i, e.target.value)}
              />
              <button className="btn-remove" onClick={() => remove(i)}>
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
      {images.length < 8 && (
        <button className="btn-add" onClick={add}>
          + Add Image
        </button>
      )}
    </div>
  );
}

function ContactEditor({ content, onChange }) {
  return (
    <div className="section-editor">
      <div className="form-group">
        <label>Section Title</label>
        <input
          value={content?.title || ""}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Subtitle</label>
        <textarea
          value={content?.subtitle || ""}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}

// --- Live Preview ---

function PreviewFrame({ content, theme }) {
  const themeVars = THEMES[theme]?.vars || {};
  const styles = Object.entries(themeVars)
    .map(([k, v]) => `${k}: ${v}`)
    .join(";");
  const sectionOrder = content?.sectionOrder || SECTION_ORDER_DEFAULT;

  return (
    <div
      className="preview-frame"
      style={Object.fromEntries(Object.entries(themeVars))}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;700&family=Cormorant+Garamond:wght@400;600;700&family=Press+Start+2P&family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Lato:wght@400;700&family=EB+Garamond&display=swap');
        .preview-frame { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100%; }
        .preview-frame h1, .preview-frame h2, .preview-frame h3 { font-family: var(--font-heading); }
        .pf-hero { background: var(--bg); padding: 5rem 2rem; text-align: center; border-bottom: 1px solid var(--border); }
        .pf-hero h1 { font-size: clamp(1.8rem, 5vw, 3.5rem); margin-bottom: 1rem; color: var(--text); }
        .pf-hero p { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .pf-btn { display: inline-block; background: var(--accent); color: var(--accent-text); padding: 0.85rem 2rem; border-radius: var(--radius); font-weight: 600; border: 2px solid var(--border); box-shadow: var(--shadow); cursor: pointer; text-decoration: none; transition: opacity 0.2s; }
        .pf-btn:hover { opacity: 0.85; }
        .pf-features { padding: 4rem 2rem; background: var(--surface); }
        .pf-features h2 { text-align: center; font-size: 2rem; margin-bottom: 2.5rem; color: var(--text); }
        .pf-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
        .pf-feature-card { background: var(--bg); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); }
        .pf-feature-card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--accent); }
        .pf-feature-card p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; }
        .pf-gallery { padding: 4rem 2rem; background: var(--bg); }
        .pf-gallery h2 { text-align: center; font-size: 2rem; margin-bottom: 2.5rem; color: var(--text); }
        .pf-gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 1000px; margin: 0 auto; }
        .pf-gallery-grid img { width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); }
        .pf-contact { padding: 4rem 2rem; background: var(--surface); text-align: center; }
        .pf-contact h2 { font-size: 2rem; margin-bottom: 0.75rem; color: var(--text); }
        .pf-contact p { color: var(--text-muted); margin-bottom: 2rem; }
        .pf-contact-form { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .pf-contact-form input, .pf-contact-form textarea { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.75rem 1rem; color: var(--text); font-family: var(--font-body); font-size: 0.95rem; width: 100%; }
        .pf-contact-form textarea { resize: vertical; min-height: 120px; }
      `}</style>

      {sectionOrder.map((section) => {
        if (section === "hero")
          return (
            <section key="hero" className="pf-hero">
              <h1>{content?.hero?.title || "Your Title Here"}</h1>
              <p>{content?.hero?.subtitle || "Your subtitle goes here"}</p>
              <a className="pf-btn" href={content?.hero?.buttonUrl || "#"}>
                {content?.hero?.buttonText || "Get Started"}
              </a>
            </section>
          );
        if (section === "features")
          return (
            <section key="features" className="pf-features">
              <h2>Features</h2>
              <div className="pf-features-grid">
                {(content?.features || []).map((f, i) => (
                  <div key={i} className="pf-feature-card">
                    <h3>{f.title}</h3>
                    <p>{f.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        if (section === "gallery")
          return (
            <section key="gallery" className="pf-gallery">
              <h2>Gallery</h2>
              <div className="pf-gallery-grid">
                {(content?.gallery || []).map((img, i) => (
                  <img key={i} src={img.url} alt={`Gallery ${i + 1}`} />
                ))}
              </div>
            </section>
          );
        if (section === "contact")
          return (
            <section key="contact" className="pf-contact">
              <h2>{content?.contact?.title || "Contact Us"}</h2>
              <p>{content?.contact?.subtitle || "Get in touch"}</p>
              <div className="pf-contact-form">
                <input placeholder="Your name" disabled />
                <input placeholder="Your email" disabled />
                <textarea placeholder="Your message" disabled />
                <a className="pf-btn">
                  {content?.hero?.buttonText || "Send Message"}
                </a>
              </div>
            </section>
          );
        return null;
      })}
    </div>
  );
}
