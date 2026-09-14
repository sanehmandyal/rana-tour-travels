# Rana Tour And Travels — Full-Stack MERN Platform

A real, working MERN (MongoDB, Express, React, Node) website + admin platform for
**Rana Tour And Travels**, a taxi service and tour & travel agency based in
Balvir Colony, VPO Barnoh, Himachal Pradesh 174303.

No online payment is implemented. Customers submit trip enquiries; the admin
team follows up manually with availability and a quote.

---

## What's included

**Public website**
- Home, About, Services, Destinations, Tour Packages, Gallery, Reviews, Contact, FAQ
- Enquiry / booking-request form with validation, loading/success/error states, and
  an auto-generated `RTT-2026-XXXX` enquiry ID
- Real business data seeded in: name, phone (098161 68974), address, tagline, and
  the 3 real Google reviews supplied for this project
- Suggested (not confirmed) destinations, clearly labelled as such
- Call / WhatsApp (prefilled message) / Enquire buttons, plus a sticky mobile CTA bar
- Fully responsive, mobile-first layout with a slide-in mobile navigation drawer

**Admin panel** (`/admin`)
- Separate `/admin/login` page with a "Back to site" link
- JWT authentication (httpOnly cookies), bcrypt password hashing, rate limiting,
  and account lockout after repeated failed logins
- Responsive sidebar: full sidebar on desktop, slide-in drawer with a hamburger
  button on mobile
- **One content system for the whole site**: every editable section (hero,
  services, destinations, packages, gallery, FAQs, about page, business
  settings) is stored as a flexible "SiteContent" document and edited through
  one generic editor — add/remove/reorder cards, upload images, edit text —
  no code changes required
- On the public site, an admin who is logged in sees a small "Edit" badge in
  the corner of each section, linking straight to that section's editor —
  this is what "connects the admin to every card and page"
- Enquiries dashboard: search, filter by status, view details, change status,
  add internal notes, and record a manual quote (amount + notes) — no payment
  processing
- Reviews management: add, hide/show, delete testimonials and Google reviews

**Backend**
- Node.js + Express REST API
- MongoDB + Mongoose models: `User`, `SiteContent`, `Enquiry`, `Review`
- Image uploads via Multer with MIME-type and file-size validation, served
  from `/uploads`
- Helmet security headers, CORS locked to the frontend origin, JSON body
  size limits, rate limiting on login/register/enquiry submission
- Server-side authorization checks on every admin route (never trust the
  frontend for permissions)

---

## Project structure

```
rana-tour-travels/
  backend/
    config/db.js
    controllers/
    middleware/         # auth (JWT), upload (multer), admin guard
    models/              # User, SiteContent, Enquiry, Review
    routes/
    seed/seed.js          # seeds real business data + admin login
    uploads/              # uploaded images served statically
    server.js
    .env.example
  frontend/
    src/
      pages/              # public pages
      admin/              # admin login, layout, dashboard, editors
      components/         # Navbar, Footer, CardGridSection, EditBadge...
      context/            # AuthContext, ContentContext
      api/client.js        # axios instance
    index.html
    tailwind.config.js
```

---

## Setup instructions

### Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongodb://127.0.0.1:27017`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and your desired admin email/password
npm install
npm run seed     # creates the admin user + seeds real business content
npm run dev      # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`,
so no extra CORS configuration is needed in development.

### 3. Log in as admin

Go to **http://localhost:5173/admin/login** and sign in with the admin email
and password you set in `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
**Change this password after your first login** by adding a "change password"
flow, or by re-seeding with new credentials.

Once logged in as admin, browse the public site — you'll see small "Edit"
badges on the hero, services, destinations, packages, gallery, FAQs, and
reviews sections. Click one to jump straight to its editor.

---

## What was intentionally simplified

The original brief described a very large enterprise platform (50+ database
tables, RBAC with 5 roles, vehicle/driver fleet management, a full quote-PDF
workflow, blog CMS, analytics, audit logs, multi-language support, etc.).
Building all of that is a multi-month team effort. This project delivers a
genuinely working, extensible core instead of a static mockup:

- **One flexible `SiteContent` model** replaces the ~15 separate CMS models
  in the original brief (destinations, packages, services, gallery, etc.),
  while still giving the admin full control over every card's text and image.
- **One admin role** is implemented (not 5). The `User` model already has a
  `role` field, so adding `Travel Manager`, `Support Agent`, etc. later is a
  small extension, not a rewrite.
- **Blog, driver/vehicle management, quote PDFs, analytics dashboards, and
  audit logs are not built.** The architecture (separate models/routes/
  controllers per concern, JWT auth already in place) is set up so they can
  be added without restructuring the app.
- No payment integration was added, per the brief — enquiry statuses already
  include room to add `Payment Pending` / `Paid` states later without
  changing the booking flow.

## Extending it

- To add a new admin role: extend the `role` enum on `User` and check it in
  `middleware/auth.js`.
- To add a new editable section (e.g. a blog): create a new `SiteContent` key
  from the admin, or build a dedicated model + route pair following the same
  pattern as `Enquiry`/`Review`.
- To move file storage off the local disk (e.g. to S3/Cloudinary), swap the
  implementation inside `middleware/upload.js` and `routes/uploadRoutes.js` —
  nothing else needs to change.
