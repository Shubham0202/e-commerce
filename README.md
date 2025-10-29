
# Inventory Manager Pro

**Inventory Manager Pro** is a modern, enterprise-ready e-commerce and inventory management application built with Next.js App Router and TypeScript. The project demonstrates a full-stack workflow suitable for portfolios and technical assessments, featuring an administrative dashboard for product CRUD, role-based authentication, client-side product search and filtering, ISR for product pages, and a responsive UI with dark mode.

---

## Table of contents

* Project overview
* Key features
* Technology stack
* Architecture and rendering strategy
* Folder structure
* Installation and setup
* Environment variables
* Running the application
* API endpoints
* Authentication and authorization
* Admin dashboard (capabilities)
* Home page and product pages (SSG + ISR)
* Notes on data storage (JSON)
* Deployment guide
* Testing suggestions
* Future improvements and roadmap
* Contribution guidelines
* License
* Contact

---

## Project overview

Inventory Manager Pro provides a minimal e-commerce front-end for customers and a powerful administrative interface for product management. The application was designed to showcase modern Next.js features (App Router, server and client components, `layout.tsx`), SSR/SSG/ISR strategies, and practical UI/UX patterns for product catalogs and dashboards.

Intended uses:

* Portfolio project for developers
* Assignment submission
* Prototype for a lightweight e-commerce admin experience

---

## Key features

* Role-based authentication (admin / user) — demo credentials provided
* Admin dashboard with product management (Create, Read, Update, Delete)
* Server and client API routes for product CRUD operations
* Home page listing with client-side search, filters and responsive product grid
* Product detail pages pre-generated at build time (SSG) with ISR (revalidate on demand / periodic regeneration)
* Stats cards in admin dashboard: total products, total inventory, low stock items
* Dark mode support using `next-themes`
* Lucide icons and Tailwind CSS based design system
* Middleware to protect admin routes and redirect users by role
* JSON-based data store (`src/data/products.json`) for simplicity (suitable for assignments)
* Clean TypeScript typing and context-based state management for admin product list

---

## Technology stack

* Next.js (App Router)
* React (Server & Client Components)
* TypeScript
* Tailwind CSS
* next-themes (dark mode)
* Lucide Icons
* Node.js for server-side routes that access filesystem (admin APIs)
* JSON files for mock data (`src/data/*.json`)
* Local cookie-based session for demo auth

Badges and dependencies in your repository should list the above stack; add them to your package manifest.

---

## Architecture and rendering strategy

The project uses a hybrid rendering approach:

* **Home page (`/`)** — Static Site Generation at build time (SSG). Products are fetched during build; client-side filtering/search is applied.
* **Product detail pages (`/products/[slug]`)** — Pre-generated at build-time (SSG) and periodically regenerated using Incremental Static Regeneration (ISR) or on-demand revalidation (revalidate path on update). This ensures static performance while keeping price/inventory reasonably fresh.
* **Admin routes and API** — Server (Node runtime) when filesystem operations are required (read/write `products.json`). These API routes add `export const runtime = "nodejs";` when using Node-only modules like `fs`/`path`.
* **Auth & middleware** — Edge-runtime compatible middleware is used for route protection and redirection logic. Authentication is session-cookie based for demo use.

---

## Folder structure

A recommended project layout:

```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx              // Home page
│  ├─ login/
│  │  └─ page.tsx
│  ├─ products/
│  │  └─ [slug]/page.tsx    // Product detail
│  ├─ admin/
│  │  ├─ page.tsx           // Admin dashboard (SSR/Client)
│  │  └─ components/
│  │     ├─ ProductsTable.tsx
│  │     ├─ StatsCards.tsx
│  │     └─ ...
│  └─ api/
│     ├─ products/route.ts          // public product list (Edge or Node)
│     ├─ admin/
│     │  └─ products/[id]/route.ts  // PUT/DELETE (Node runtime if uses fs)
│     └─ login/route.ts             // POST login (Edge-compatible)
├─ components/
│  ├─ Header.tsx
│  ├─ ProductCard.tsx
│  └─ SearchBar.tsx
├─ lib/
│  ├─ auth.ts
│  └─ products.ts
├─ data/
│  ├─ products.json
│  └─ users.json (optional)
├─ middleware.ts
├─ public/
│  └─ logo.png
├─ styles/
└─ ...
```

---

## Installation and setup

Prerequisites:

* Node.js 18+ (LTS recommended)
* npm (or yarn / pnpm)
* Recommended editor: VSCode with TypeScript support

Clone the repository and install dependencies:

```bash
git clone https://github.com/Shubham0202/e-commerce
cd e-commerce
npm install
```

---

## Environment variables

Create a `.env.local` file in the project root and set these variables (placeholders shown):

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# For demo cookie/session: not required but recommended for production
AUTH_COOKIE_SECRET=your-strong-secret-here

```

* `AUTH_COOKIE_SECRET` is recommended if you use signed cookies for sessions. For the demo local cookie approach this may be optional.

---

## Running the application

Development:

```bash
npm run dev
# opens http://localhost:3000
```

Build:

```bash
npm run build
npm run start
```

---

## Demo accounts (for testing)

> These demo credentials are included for local testing. Change them or remove in production.

* Admin: `username: admin` / `password: admin123`
* User: `username: user` / `password: user123`

Login at `/login`. Admin users are redirected to `/admin`. Regular users are redirected to `/dashboard`.

---

## API Endpoints

This project uses Next.js App Router API routes. The following endpoints are provided:

### Public product endpoints

* `GET /api/products`

  * Returns the full product list (Edge or Node runtime depending on implementation).
* `GET /api/products/[slug]`

  * Returns a single product. Used by product detail pages.

### Admin product endpoints (protected)

> Admin endpoints typically require an admin header (`x-admin-key`) or a valid session cookie depending on your protection method.

* `POST /api/admin/products`

  * Create a new product (Node runtime if writing to `products.json`).
* `PUT /api/admin/products/[id]`

  * Update an existing product. This route can revalidate pages and the home path for ISR.
* `DELETE /api/admin/products/[id]`

  * Delete a product.

### Auth endpoints

* `POST /api/login`

  * Body: `{ username, password }`
  * Sets a session cookie and returns the role.
* `POST /api/logout`

  * Clears the session cookie.

---

## Authentication and authorization

The demo implementation uses a simple session cookie approach:

* Login via `POST /api/login`. On success, a cookie is set (`session`) that contains session information (username, role). For production, sign and/or encrypt cookies.
* Middleware (`src/middleware.ts`) will protect routes:

  * Redirects unauthenticated users to `/login`.
  * Restricts `/admin` to admin role.
  * Optionally restricts `/dashboard` to authenticated users.
  * Redirects logged-in users away from `/login` to their role-appropriate landing page.

**Notes for production**:

* Use signed/encrypted cookies (HMAC or JWT) or a server-side session store.
* Hash and salt passwords; do not store plaintext passwords.

---

## Admin dashboard (capabilities)

Administrative features include:

* Product listing with pagination and filters.
* Create product modal (name, slug, price, inventory, category, description).
* Edit product modal with field validation.
* Delete confirmation for product removal.
* Stats cards:

  * Total Products
  * Total Inventory
  * Low Stock Items (inventory <= 5)
* Revalidation: On update or delete, the server triggers revalidation for affected SSG pages (home and product pages) to demonstrate ISR on-demand.

---

## Home page and product pages (SSG + ISR)

* Home page fetches product data at build time (SSG). Client-side search and filters are applied on the rendered page for instant results without additional server requests.
* Product detail pages are pre-generated at build-time for performance. ISR is enabled to update pages periodically (example: every 60 seconds) or revalidated on-demand using `revalidatePath()` when product updates occur.
* This approach combines the performance of static pages with the freshness of ISR for dynamic data such as price and inventory.

---

## Data storage

* Product data is stored in `src/data/products.json` for the purposes of this assignment. This simplifies running the project locally and meets assignment constraints.
* For production use:

  * Replace JSON storage with a database (MongoDB, PostgreSQL, Supabase) and update API routes accordingly.
  * Add proper data validation, migrations, and backups.

---

## Deployment guide

This project is optimized for Vercel (recommended), but can also be deployed on other Node-compatible hosts.

### Vercel

1. Push your repository to GitHub/GitLab.
2. Import the project into Vercel.
3. Set environment variables in Vercel dashboard (e.g., `AUTH_COOKIE_SECRET`, OAuth keys).
4. Deploy.

### Manual (Node server)

1. Build the project:

```bash
npm run build
```

2. Start server:

```bash
npm start
```

3. Ensure environment variables are set in your hosting environment.

---

## Testing suggestions

* Unit tests (recommended): Add tests for API endpoints and utility functions (auth helpers, products helpers). Use Jest or Vitest.
* Integration tests: Verify login flow, admin CRUD, middleware protection.
* End-to-end tests: Use Playwright or Cypress to test user journeys (login, create product, visit product page, ISR revalidation).

---

## Future improvements and roadmap

Planned enhancements and professional features:

* Replace JSON storage with a production-grade database (MongoDB / PostgreSQL) and add Prisma for schema and migrations.
* Implement secure authentication using NextAuth or server-side sessions, with proper password hashing (bcrypt) and OAuth providers.
* Add unit and integration test suites (Vitest/Jest + Playwright).
* Improve UI accessibility and internationalization (i18n).
* Add image upload and CDN integration for product images.
* Implement pagination on the public products list.
* Add role-based permissions and auditing logs for admin actions.

---

## Contribution guidelines

Contributions are welcome. For major changes:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit logically and push.
4. Open a Pull Request with a clear description of changes.

Ensure all changes are consistent with the project style and pass tests before requesting a review.

---

## License

This repository is provided for educational and portfolio purposes. Add an appropriate license file (for example MIT) if you intend to publish:

```
MIT License
```

---

## Screenshots and demo (placeholders)

Replace these placeholders with real screenshots or GIFs of your app in `./screenshots/`.

* `screenshots/homepage.png` — Home page (product grid + search bar)
* `screenshots/product-detail.png` — Product detail page
* `screenshots/admin-dashboard.png` — Admin dashboard (stats + table)
* `screenshots/create-product.png` — Create product modal

Live demo: Add your live deployment URL here once available.

---

## Troubleshooting & common issues

* If you see errors about Node-only modules (e.g., `path` or `fs`) when using Edge runtime, add `export const runtime = "nodejs";` to routes that import `fs` or `path`.
* Restart the dev server after changing runtime flags or adding middleware.
* If cookies are not set in local development, check your browser devtools for blocked cookies or incorrect SameSite settings.

---

## Contact

Developed by Shubham Chandgude.

email: `shubham826852@gmail.com`
---
