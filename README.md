# Inventory Manager Pro


**Inventory Manager Pro** is a modern, enterprise-ready e-commerce and inventory management application built with Next.js (App Router) and TypeScript. It demonstrates a complete full‑stack workflow suitable for portfolios, interviews, and practical assignments.

This project includes: an admin dashboard for product CRUD operations, role‑based authentication, product catalog with search & filters, static pages with ISR, protected routes, and a responsive UI with dark mode.

---

## 📌 Table of Contents

* Project Overview
* Key Features
* Tech Stack
* Architecture & Rendering Strategy
* Folder Structure
* Installation & Setup
* Environment Variables
* Running the Application
* Demo Accounts
* API Endpoints
* Authentication & Authorization
* Admin Dashboard
* Home & Product Pages (SSG + ISR)
* Data Storage
* Deployment Guide
* Testing Suggestions
* Future Improvements & Roadmap
* Contribution Guidelines
* License
* Screenshots & Demo
* Troubleshooting
* Contact

---

## 🧾 Project Overview

Inventory Manager Pro provides a lightweight e-commerce UI for customers and a powerful admin interface for product management. It demonstrates modern Next.js concepts including App Router, Server & Client Components, Middleware, ISR, and reusable UI patterns.

**Intended Uses:**

* Portfolio / Resume project for developers
* College or technical assignment submission
* Prototype for minimal e-commerce with admin panel

---

## ✨ Key Features

* 🔐 Role-based authentication (**Admin / User**) — demo credentials included
* 🧑‍💼 Admin dashboard with full product management (Create, Read, Update, Delete)
* 🧵 Server & client API routes for CRUD operations
* 🏠 Home page product listing with client-side search and filtering
* ⚡ Product detail pages: SSG + ISR for dynamic regeneration
* 📊 Admin stats cards: Total products, total inventory, low stock items
* 🌓 Dark mode with `next-themes`
* 🎨 Tailwind CSS + Lucide Icons based UI
* 🧩 Middleware for route protection
* 📁 JSON-based data store (`/src/data/products.json`) — easy for assignment/demo
* ✅ Clean TypeScript types and reusable components

---

## 🧰 Technology Stack

* **Next.js** (App Router)
* **React** (Server & Client Components)
* **TypeScript**
* **Tailwind CSS**
* **next-themes** (Dark mode)
* **Lucide Icons**
* **Node.js**
* **MongoDB + Mongoose** (Database)

---

## 🧱 Architecture & Rendering Strategy

This project follows a **Hybrid Architecture** combining the strengths of Server Components, API routes, and a clean backend structure with MongoDB.

### 🔹 Rendering Strategy

| Section                            | Rendering                 | Notes                                                   |
| ---------------------------------- | ------------------------- | ------------------------------------------------------- |
| Home (`/`)                         | **SSG**                   | Build-time static; client filtering for instant results |
| Product Pages (`/products/[slug]`) | **SSG + ISR**             | Pre-generated; revalidates periodically or on demand    |
| Admin APIs                         | **Server (Node runtime)** | Interact with MongoDB using Mongoose                    |
| Auth & Middleware                  | **Edge Compatible**       | Protects routes based on user role                      |

### 🧩 Backend Architecture (Hybrid)

```
UI Pages / Components
        ↓
API Routes (app/api/...)
        ↓
Lib Layer (Business Logic & Validation)
        ↓
Mongoose Models
        ↓
MongoDB Database
```

**Why Hybrid?**

* Maintains simplicity (good for intermediate projects)
* Clean separation of responsibilities
* Scales better than direct DB calls from routes

--------|------------|-------|
| Home (`/`) | **SSG** | Build-time static; client filtering for instant results |
| Product Pages (`/products/[slug]`) | **SSG + ISR** | Pre-generated; revalidates periodically or on demand |
| Admin APIs | **Server (Node runtime)** | Uses `fs` to read/write JSON |
| Auth & Middleware | **Edge Compatible** | Protects routes based on role |

> Use `export const runtime = "nodejs"` in routes that use `fs`/`path`.

---

## 📂 Folder Structure

```bash
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                 # Home page
│  ├─ login/page.tsx
│  ├─ dashboard/page.tsx       # User landing page
│  ├─ products/
│  │  └─ [slug]/page.tsx       # Product detail
│  ├─ admin/
│  │  ├─ page.tsx              # Admin dashboard
│  │  └─ components/
│  │     ├─ ProductsTable.tsx
│  │     ├─ StatsCards.tsx
│  │     └─ ...
│  └─ api/
│     ├─ products/route.ts            # Public products list
│     ├─ products/[slug]/route.ts     # Single product
│     ├─ admin/products/route.ts      # POST create product
│     ├─ admin/products/[id]/route.ts # PUT/DELETE
│     └─ login/route.ts               # POST login
├─ components/
│  ├─ Header.tsx
│  ├─ ProductCard.tsx
│  └─ SearchBar.tsx
├─ lib/
│  ├─ auth.ts
│  └─ products.ts
├─ data/
│  ├─ products.json
│  └─ users.json
├─ middleware.ts
└─ public/
   └─ logo.png
```

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js 18+
* npm / yarn / pnpm
* Recommended: VS Code

### Clone & Install

```bash
git clone https://github.com/Shubham0202/e-commerce
cd e-commerce
npm install
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
AUTH_COOKIE_SECRET=your-strong-secret-here
```

> Use a strong secret in production.

---

## 🚀 Running the Application

### Development

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Build & Start

```bash
npm run build
npm run start
```

---

## 👥 Demo Accounts

> Change/remove in production.

| Role  | Username | Password |
| ----- | -------- | -------- |
| Admin | admin    | admin123 |
| User  | user     | user123  |

Login: `/login`

---

## 🧵 API Endpoints

### Public

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/products`        | Get all products   |
| GET    | `/api/products/[slug]` | Get single product |

### Admin (Protected)

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/admin/products`      | Create product              |
| PUT    | `/api/admin/products/[id]` | Update product + revalidate |
| DELETE | `/api/admin/products/[id]` | Delete product              |

### Auth

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| POST   | `/api/login`  | Login & set cookie |
| POST   | `/api/logout` | Clear session      |

---

## 🛡️ Authentication & Authorization

* Login sets a session cookie
* Middleware protects routes:

  * `/admin` → Admin only
  * `/dashboard` → Logged-in users only
  * Redirects logged-in users away from `/login`

**Production Notes:**

* Hash passwords (bcrypt)
* Use signed/encrypted cookies or NextAuth

---

## 🧑‍💼 Admin Dashboard

Includes:

* Product table with listing, search, filters
* Create/Edit/Delete product modals
* Stats cards:

  * Total Products
  * Total Inventory
  * Low Stock Items
* Triggers revalidation for ISR

---

## 🏠 Home & Product Pages (SSG + ISR)

* Home page generated at build time
* Fast client-side product filtering
* Product pages regenerated automatically on update

---

## 📊 Data Storage

* JSON located at `/src/data/products.json`
* Ideal for assignments & demo projects

To go production-ready:

* Use DB (MongoDB/PostgreSQL)
* Use Prisma with migrations & validation

---

## 🌍 Deployment

### Deploy on Vercel (Recommended)

1. Push repo to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Manual (Node Server)

```bash
npm run build
npm start
```

---

## 🧪 Testing Suggestions

* Unit tests: Products & Auth libraries
* Integration: Login, Admin CRUD flows
* E2E: Playwright or Cypress

---

## 🚧 Future Improvements

* Replace JSON with DB + Prisma
* NextAuth + OAuth providers
* File uploads for product images
* Pagination & sorting
* Internationalization (i18n)
* Accessibility improvements
* Activity logs for admin actions

---

## 🤝 Contribution

1. Fork the repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit & push
4. Open PR

---

## 📄 License

MIT License

---

## 🖼️ Screenshots & Demo

* `screenshots/homepage.png` — Home page (product grid + search bar)
* `screenshots/add-product.png` — Product detail page
* `screenshots/admin.png` — Admin dashboard (stats + table)
* `screenshots/login.png` — Create product modal

> Add live demo URL here once deployed.

---

## 🛠️ Troubleshooting

* `fs` or `path` errors → Add `export const runtime = "nodejs"` to the route
* Cookies not working → Check SameSite, domain, and devtools
* Restart dev server after middleware changes

---

## 📬 Contact

**Developer:** Shubham Chandgude
Email: `shubham826852@gmail.com`
