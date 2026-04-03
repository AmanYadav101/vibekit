import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages", { credentials: "include" });
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle, theme: "minimal" }),
      });
      const data = await res.json();
      setShowModal(false);
      setNewTitle("");
      navigate(`/app/editor/${data.page.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const duplicatePage = async (id) => {
    try {
      const res = await fetch(`/api/pages/${id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setPages((prev) => [data.page, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">⚡ VibeKit</span>
        </div>
        <div className="dash-header-right">
          <span className="dash-email">{user?.email}</span>
          <button className="btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-top">
          <div>
            <h1>My Pages</h1>
            <p className="dash-subtitle">Create and manage your mini-sites</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Page
          </button>
        </div>

        {/* Pages Grid */}
        {loading ? (
          <div className="dash-empty">
            <div className="skeleton-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          </div>
        ) : pages.length === 0 ? (
          <div className="dash-empty">
            <div className="empty-icon">📄</div>
            <h2>No pages yet</h2>
            <p>Create your first page to get started</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Create your first page
            </button>
          </div>
        ) : (
          <div className="pages-grid">
            {pages.map((page) => (
              <div key={page.id} className="page-card">
                <div className="page-card-top">
                  <div className={`page-theme-badge theme-${page.theme}`}>
                    {page.theme}
                  </div>
                  <span className={`page-status ${page.status}`}>
                    {page.status}
                  </span>
                </div>
                <h3 className="page-card-title">{page.title}</h3>
                <p className="page-card-slug">/{page.slug}</p>
                <div className="page-card-meta">
                  <span>{page.view_count} views</span>
                  <span>{new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="page-card-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/app/editor/${page.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => duplicatePage(page.id)}
                  >
                    Duplicate
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
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Page Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create new page</h2>
            <p className="modal-subtitle">
              Give your page a title to get started
            </p>
            <div className="form-group">
              <label>Page Title</label>
              <input
                type="text"
                placeholder="e.g. My Portfolio"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createPage()}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={createPage}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
