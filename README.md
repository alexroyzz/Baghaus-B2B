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

The API runs at `http://localhost:5000`, health check at `/api/health`.

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
- `uploads/` is served statically — for real production use, point this at a
  persistent volume or swap the multer disk storage for S3/Cloudinary.
- Put the API behind a reverse proxy (Nginx) with HTTPS.

**Frontend**
- `npm run build` outputs static files to `frontend/dist/` — deploy to any
  static host (Vercel, Netlify, S3 + CloudFront, Nginx).
- Set `VITE_API_URL` to your deployed API's public URL before building.

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
