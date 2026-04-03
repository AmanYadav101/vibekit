import { getPool } from "./db.js";
import { verifyToken } from "./auth-helper.js";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const handler = async (event) => {
  console.log("PATH:", event.path);
  console.log("METHOD:", event.httpMethod);
  const userId = verifyToken(event);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const pool = getPool();
  const method = event.httpMethod;
  const segments = event.path
    .replace("/api/pages", "")
    .split("/")
    .filter(Boolean);

  const pageId = segments[0];
  const action = segments[1];

  // GET /api/pages — list all pages for user
  if (method === "GET" && !pageId) {
    const result = await pool.query(
      "SELECT id, title, slug, status, theme, view_count, created_at, updated_at FROM pages WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId],
    );
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages: result.rows }),
    };
  }

  // POST /api/pages — create new page
  if (method === "POST" && !pageId) {
    const { title, theme = "minimal" } = JSON.parse(event.body || "{}");
    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Title is required" }),
      };
    }

    let slug = slugify(title);
    // Handle slug collisions
    const existing = await pool.query(
      "SELECT slug FROM pages WHERE slug LIKE $1",
      [`${slug}%`],
    );
    if (existing.rows.length > 0) {
      slug = `${slug}-${existing.rows.length}`;
    }

    const defaultContent = {
      hero: {
        title: title,
        subtitle: "Welcome to my page",
        buttonText: "Get Started",
        buttonUrl: "#",
      },
      features: [
        {
          title: "Feature One",
          description: "Describe your first feature here.",
        },
        {
          title: "Feature Two",
          description: "Describe your second feature here.",
        },
        {
          title: "Feature Three",
          description: "Describe your third feature here.",
        },
      ],
      gallery: [
        { url: "https://picsum.photos/seed/1/600/400" },
        { url: "https://picsum.photos/seed/2/600/400" },
        { url: "https://picsum.photos/seed/3/600/400" },
      ],
      contact: {
        title: "Get in touch",
        subtitle: "Fill out the form below and we will get back to you.",
      },
      sectionOrder: ["hero", "features", "gallery", "contact"],
    };

    const result = await pool.query(
      "INSERT INTO pages (user_id, title, slug, theme, content) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, title, slug, theme, JSON.stringify(defaultContent)],
    );

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  // GET /api/pages/:id
  if (method === "GET" && pageId && !action) {
    const result = await pool.query(
      "SELECT * FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId],
    );
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  // PUT /api/pages/:id
  if (method === "PUT" && pageId && !action) {
    const { title, theme, content } = JSON.parse(event.body || "{}");
    const result = await pool.query(
      `UPDATE pages SET 
        title = COALESCE($1, title),
        theme = COALESCE($2, theme),
        content = COALESCE($3, content),
        updated_at = NOW()
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title, theme, content ? JSON.stringify(content) : null, pageId, userId],
    );
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  // POST /api/pages/:id/publish
  if (method === "POST" && action === "publish") {
    const result = await pool.query(
      "UPDATE pages SET status = 'published', updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *",
      [pageId, userId],
    );
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  // POST /api/pages/:id/unpublish
  if (method === "POST" && action === "unpublish") {
    const result = await pool.query(
      "UPDATE pages SET status = 'draft', updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *",
      [pageId, userId],
    );
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  // POST /api/pages/:id/duplicate
  if (method === "POST" && action === "duplicate") {
    const original = await pool.query(
      "SELECT * FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId],
    );
    if (original.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    const page = original.rows[0];
    const newSlug = `${page.slug}-copy-${Date.now().toString().slice(-4)}`;
    const result = await pool.query(
      "INSERT INTO pages (user_id, title, slug, theme, content, status) VALUES ($1, $2, $3, $4, $5, 'draft') RETURNING *",
      [
        userId,
        `${page.title} (Copy)`,
        newSlug,
        page.theme,
        JSON.stringify(page.content),
      ],
    );
    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: result.rows[0] }),
    };
  }

  return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
};
