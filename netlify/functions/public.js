import { getPool } from "./db.js";

export const handler = async (event) => {
  console.log("PUBLIC PATH:", event.path);
  console.log("METHOD:", event.httpMethod);
  const pool = getPool();
  const segments = event.path
    .replace("/api/public/", "")
    .split("/")
    .filter(Boolean);
  const slug = segments[1];
  const action = segments[2];

  console.log("PUBLIC PATH:", event.path, "segments:", segments);

  // GET /api/public/pages/:slug
  if (event.httpMethod === "GET" && !action) {
    const result = await pool.query(
      "SELECT * FROM pages WHERE slug = $1 AND status = 'published'",
      [slug],
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

  // POST /api/public/pages/:slug/view
  if (event.httpMethod === "POST" && action === "view") {
    await pool.query(
      "UPDATE pages SET view_count = view_count + 1 WHERE slug = $1",
      [slug],
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  }

  // POST /api/public/pages/:slug/contact
  if (event.httpMethod === "POST" && action === "contact") {
    const { name, email, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }
    const pageResult = await pool.query(
      "SELECT id FROM pages WHERE slug = $1",
      [slug],
    );
    if (pageResult.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Page not found" }),
      };
    }
    await pool.query(
      "INSERT INTO contact_submissions (page_id, name, email, message) VALUES ($1, $2, $3, $4)",
      [pageResult.rows[0].id, name, email, message],
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ ok: true, message: "Message received!" }),
    };
  }

  return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
};
