# ⚡ VibeKit Studio

> "Generate a theme, build a mini-site, publish it."

VibeKit Studio is a full-stack web app where users can create themed mini-sites, customize content with a live editor, and publish them to a public URL.

**Live URL:** https://vibekitassignment.netlify.app/

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Netlify Functions (Node.js serverless)
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT (httpOnly cookies) + bcrypt
- **Deployment:** Netlify

## Features

- 6 vibe themes (Minimal, Neo-Brutal, Dark/Neon, Pastel, Luxury, Retro)
- Live page editor with Desktop/Tablet/Mobile preview toggle
- Section reordering (Hero, Features, Gallery, Contact)
- Publish/Unpublish toggle with unique slug generation
- Page duplication
- Public published pages with view count tracking
- Contact form with DB persistence
- Fully responsive (320px → 1280px+)

---

## Local Setup

### 1. Clone the repo
\```bash
git clone https://github.com/AmanYadav101/vibekit
cd vibekit
\```

### 2. Install dependencies
\```bash
npm install
\```

### 3. Create `.env` file in project root
\```
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_secret_key
\```

### 4. Run database migration
\```bash
npx netlify dev
\```
Then visit: `http://localhost:8888/.netlify/functions/migrate`

### 5. Start development server
\```bash
npx netlify dev
\```

Visit `http://localhost:8888`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## Test Credentials

You can sign up directly on the app — no invite needed.
Or use: `test@test.com` / `123456`

---

## Auth Approach

JWT tokens are stored in **httpOnly cookies** (`SameSite=Lax`) so they are not accessible via JavaScript, protecting against XSS. Tokens expire in 7 days. All authenticated API routes verify the token server-side before any DB operation.

---

## Tradeoffs + What I'd Improve Next

- **No forgot password flow** — would add email-based reset via Resend/SendGrid
- **Image uploads** — currently gallery uses URLs; would add Cloudinary or S3 upload support
- **No delete page** — would add soft delete with confirmation modal
- **Slug editing** — currently auto-generated from title; would let users customize it
- **Theme customizer** — would let users tweak individual colors/fonts beyond presets