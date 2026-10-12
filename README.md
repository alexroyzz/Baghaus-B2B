# BagHaus — Premium B2B Wholesale Bags Website

A production-ready, full-stack B2B wholesale website for a bag manufacturer/supplier.
Built with **React + Vite + Tailwind CSS + Framer Motion** on the frontend and
**Node.js + Express + MongoDB** on the backend, with a secure **JWT-based Admin Panel**.

No shopping cart, checkout, customer login, or online payment — the site is built
purely to generate wholesale leads via **Request Quote**, **WhatsApp Inquiry**, and
**Call Now**.

---

## 1. Project Structure

```
baghaus/
├── backend/                 Node.js + Express + MongoDB API
│   ├── config/db.js
│   ├── models/               Admin, Category, Product, Inquiry, Settings
│   ├── controllers/
│   ├── routes/
│   ├── middleware/           JWT auth, error handler
│   ├── utils/seed.js         Seeds ONLY the default admin account + settings
│   ├── uploads/               Uploaded images (created automatically)
│   ├── server.js
│   └── .env.example
│
└── frontend/                 React + Vite + Tailwind + Framer Motion
    ├── src/
    │   ├── pages/             Home, About, Products, ProductDetail, Categories,
    │   │                      Gallery, FAQ, Contact
    │   ├── pages/admin/       Login, Dashboard, Products, Categories,
    │   │                      Inquiries, Settings
    │   ├── components/        Navbar, Footer, ProductCard, QuoteModal,
    │   │                      WhatsAppButton, CallButton, SEO, etc.
    │   ├── context/           AuthContext (admin), SettingsContext (site config)
    │   └── api/axios.js
    ├── index.html
    └── .env.example
```

---

## 2. Prerequisites

- Node.js 18+
- A MongoDB database — local (`mongodb://127.0.0.1:27017`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 3. Backend Setup

```bash
cd backend
cp .env.example .env      # then edit values below
npm install
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/baghaus
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@baghaus.com
ADMIN_PASSWORD=ChangeMe@123
ADMIN_NAME=BagHaus Admin
CLIENT_URL=http://localhost:5173
REQUEST_TIMEOUT_MS=30000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
INQUIRY_RATE_LIMIT_MAX=30
MONGO_MAX_POOL_SIZE=10
MONGO_MIN_POOL_SIZE=0
MONGO_CONNECT_MAX_RETRIES=0
SHUTDOWN_TIMEOUT_MS=10000
```

Seed the database with just the default admin account and default site
settings (safe to re-run). This does **not** create any categories or
products — those are fully admin-controlled and must be added manually from
the Admin Panel after logging in:

```bash
npm run seed
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API runs at `http://localhost:5000`; health checks are available at
`/health` and `/api/health`.

---

## 4. Frontend Setup

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

The site runs at `http://localhost:5173`. Vite is pre-configured to proxy
`/api` and `/uploads` to `http://localhost:5000` in dev mode, so
`VITE_API_URL` can be left as-is for local development.

---

## 5. First Login to the Admin Panel

1. Visit `http://localhost:5173/admin/login`
2. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`
   (default `admin@baghaus.com` / `ChangeMe@123` — **change this immediately**
   via Admin → Settings → your account, or directly in MongoDB).
3. From the admin panel you can manage:
   - **Products** — name, images, category, materials, colors, sizes, MOQ,
     price range, SEO fields, featured flag
   - **Categories** — name, image, description, sort order
   - **Inquiries** — every Request Quote / Contact / WhatsApp click is logged
     here with status tracking (New / Contacted / In Progress / Closed)
   - **Settings** — company name, GSTIN, address, logo, favicon, homepage
     banners, phone/WhatsApp/email, social links (Instagram, Facebook, X,
     LinkedIn), SEO defaults

---

## 6. How Lead Generation Works

- **Request Quote** — opens a modal (or full page on `/contact`) that posts to
  `POST /api/inquiries` with `type: "quote"`. No payment, no cart.
- **WhatsApp Inquiry** — opens `wa.me/<number>` with a prefilled message using
  the WhatsApp number set in Admin → Settings, and logs a lightweight inquiry
  record for tracking.
- **Call Now** — a plain `tel:` link using the phone number set in Admin →
  Settings.

All three converge into the same **Inquiries** table in the admin panel, so
the sales team has a single inbox.

---

## 7. Production Deployment Notes

**Backend**
- Set `NODE_ENV=production`, a strong random `JWT_SECRET`, and a production
  `MONGO_URI` (e.g. MongoDB Atlas).
- Set `CLIENT_URL` to a comma-separated allowlist of exact frontend origins.
  The API applies Helmet headers, credentialed CORS, a 300-request default
  API limit per IP per 15 minutes, a stricter inquiry limit, and a 30-second
  response timeout. Authentication is additionally limited to 60 requests
  per IP per 15 minutes. Tune these with the environment variables above.
- MongoDB uses a bounded connection pool (`MONGO_MAX_POOL_SIZE` /
  `MONGO_MIN_POOL_SIZE`), retries initial connection with exponential backoff,
  and lets Mongoose reconnect after transient disconnects. Set
  `MONGO_CONNECT_MAX_RETRIES` to a positive number to bound startup retries;
  zero keeps retrying until connected.
- Install PM2 on the host (`npm install -g pm2`) and run
  `npm run pm2:start` from `backend/`. PM2 restarts crashes, applies a memory
  restart threshold, and `npm run pm2:monitor` shows CPU/memory and process
  status. SIGTERM/SIGINT triggers graceful HTTP and MongoDB shutdown.
- Configure an external uptime checker (for example, Uptime Kuma or your host's
  monitor) to poll `https://<your-api-domain>/health` every 1–5 minutes and
  alert on non-200 responses. The endpoint reports readiness, database state,
  uptime, PID, and process memory. A 503 means the process is up but not ready.
- The built-in rate limiter stores counters in process memory. Keep PM2 at one
  instance unless you configure a shared rate-limit store (such as Redis) for
  consistent limits across multiple workers/servers.
- Public product responses are cached for 60 seconds and category/site
  settings for 5 minutes with stale-while-revalidate; authorized and `all=true`
  admin reads bypass shared caching. Tune with `PRODUCT_CACHE_SECONDS`,
  `CATEGORY_CACHE_SECONDS`, and `SETTINGS_CACHE_SECONDS`.
- Product list/search queries return lean documents, cap page size at 100,
  sort text matches by relevance, and use compound catalog indexes. MongoDB
  must build the new indexes after deployment before those query improvements
  take effect.
- The admin image uploader compresses large JPEG/PNG/WebP files to WebP before
  upload (when the browser can do so). Public Cloudinary URLs request automatic
  AVIF/WebP selection, quality optimization, and responsive sizes. Other image
  hosts keep their original format.
- Public pages and admin screens load as separate JavaScript chunks. Product
  search waits 300 ms after typing and cancels stale requests. Hashed frontend
  assets receive long-lived browser caching; HTML is revalidated on each visit.
- `uploads/` is served statically — for real production use, point this at a
  persistent volume or swap the multer disk storage for S3/Cloudinary.
- Put the API behind a reverse proxy (Nginx) with HTTPS.

**Frontend**
- For the same-origin Express/Hostinger deployment, run `npm run build` from
  `frontend/`; Vite writes the production site to `backend/dist/`, which the
  Express server serves alongside the API. Deploy the updated `backend/dist/`
  files with the backend and restart the app.
- Set `VITE_API_URL` to your deployed API's public URL before building only
  when hosting the frontend on a separate origin. Leave it unset for the
  same-origin Hostinger deployment, where frontend API requests use `/api`.

**SEO**
- Each page sets its own `<title>` and meta description via `react-helmet-async`.
- Product/category pages use slugs (`/products/atelier-structured-tote`) for
  clean, indexable URLs.
- Update `frontend/index.html` and Admin → Settings → SEO Defaults with your
  real domain, company name and description before launch.
- Consider adding a sitemap.xml / robots.txt generation step for full SEO,
  and server-side rendering (Next.js) later if organic search is a top
  priority — this build is a fully client-rendered SPA.

---

## 8. Security Notes

- Admin routes are protected with JWT (`Authorization: Bearer <token>`),
  verified server-side on every request via `middleware/auth.js`.
- Passwords are hashed with bcrypt; never stored in plain text.
- Public inquiry endpoints are rate-limited (30 requests / 15 min / IP) to
  reduce spam.
- Change the default admin password immediately after first login in any
  real deployment.
