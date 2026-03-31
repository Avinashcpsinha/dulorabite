# 🍫 DuloraBite – E-Commerce Website

A full-stack e-commerce application built with **Next.js 14**, **SQLite (better-sqlite3)**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

### 🛍️ Customer Side
- Beautiful homepage with hero, featured products, brand story, testimonials
- Full product catalog with search, category filter, and price sorting
- Persistent shopping cart (localStorage) with quantity controls
- Full checkout flow → orders saved to SQLite database
- Reseller/distributor application form

### 🔧 Admin Dashboard (`/admin`)
- Secure JWT login
- **Dashboard** – live stats (orders, revenue, products, leads)
- **Products** – Add, edit, delete, enable/disable products with images
- **Orders** – View all orders with full details, update status (confirmed → shipped → delivered)
- **Reseller Leads** – View all partnership applications

### 💾 Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT + HTTP-only cookies |
| Styling | Tailwind CSS + inline styles |
| Fonts | Playfair Display, DM Sans, Cormorant Garamond |
| Icons | Lucide React |
| Toasts | React Hot Toast |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local and set a strong JWT_SECRET
```

### 3. Seed the Database
This creates the SQLite database, all tables, seeds 11 products, and creates the admin user.
```bash
npm run db:seed
```

### 4. Add Product Images
Copy all your product `.jpeg` images into the `public/images/` folder:
```bash
mkdir -p public/images
cp /path/to/your/product-images/*.jpeg public/images/
cp /path/to/DuloraBite_Catalogue.png public/images/
```

Expected image filenames (from your catalogue):
- `Sprouted_Ragi_Almond_Cookies.jpeg`
- `Cashew_Biutter_Cookies.jpeg`
- `Peanut_Butter_Cookies.jpeg`
- `ButterSCotch_Cookies.jpeg`
- `Chocolate_Cookies.jpeg`
- `Chocolates.jpeg`
- `Assorted_Dark_Chocolates.jpeg`
- `HoneyLoops_Chocolate.jpeg`
- `Milk_Chocolate_Energy_Bar.jpeg`
- `Assorted_Fruit_Flavoured_Lolipop.jpeg`
- `Rainbow_Multi-Flavoured_Lolipop.jpeg`
- `Lollipop.jpeg`
- `Cookies.jpeg`
- `DuloraBite_Catalogue.png`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 6. Access Admin Panel
Go to [http://localhost:3000/admin](http://localhost:3000/admin)

| Credential | Value |
|-----------|-------|
| Username | `admin` |
| Password | `dulorabite@123` |

---

## 📁 Project Structure

```
dulorabite/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (fonts, toaster)
│   ├── globals.css               # Tailwind + animations
│   ├── products/
│   │   ├── page.tsx              # Products listing page (SSR)
│   │   └── ProductsClient.tsx    # Client filtering/search
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout + auth guard + login
│   │   ├── page.tsx              # /admin → login screen
│   │   ├── dashboard/page.tsx    # Stats dashboard
│   │   ├── products/page.tsx     # Product CRUD
│   │   ├── orders/page.tsx       # Orders management
│   │   └── resellers/page.tsx    # Reseller leads
│   └── api/
│       ├── products/route.ts     # GET all, POST new
│       ├── products/[id]/route.ts# GET, PUT, DELETE by ID
│       ├── orders/route.ts       # GET all (admin), POST new
│       ├── orders/[id]/route.ts  # PUT status update
│       ├── resellers/route.ts    # GET all (admin), POST new
│       └── auth/
│           ├── route.ts          # POST login, DELETE logout
│           └── stats/route.ts    # GET dashboard stats
├── components/
│   ├── CartContext.tsx            # React context cart store
│   ├── CartDrawer.tsx            # Slide-in cart panel
│   ├── CheckoutModal.tsx         # Checkout form + order placement
│   ├── ProductCard.tsx           # Product card with hover add
│   ├── ResellerForm.tsx          # Partnership application form
│   ├── Navbar.tsx                # Fixed navigation bar
│   └── Footer.tsx                # Site footer
├── lib/
│   ├── db.ts                     # SQLite connection + schema init
│   ├── auth.ts                   # JWT sign/verify helpers
│   ├── types.ts                  # TypeScript interfaces
│   └── seed.js                   # Database seed script
├── public/
│   └── images/                   # ← Put all product images here
├── data/
│   └── dulorabite.db             # SQLite database (auto-created)
├── .env.example
├── .env.local                    # ← Create from .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🗄️ Database Schema

```sql
products        -- Product catalog
orders          -- Customer orders
order_items     -- Line items per order
reseller_leads  -- Partnership applications
admins          -- Admin users (hashed passwords)
```

---

## 🌐 Deployment (Production)

### Build
```bash
npm run build
npm start
```

### Environment for Production
```bash
JWT_SECRET=your_very_long_random_secret_here
NODE_ENV=production
```

### Important Notes for Production
- The `data/` folder (SQLite file) must be on a **persistent volume** — not ephemeral storage
- For serverless hosting (Vercel), switch to a hosted database like **Turso** (SQLite edge) or **PlanetScale**
- For VPS/server hosting (DigitalOcean, AWS EC2, etc.), SQLite works perfectly as-is
- Run `npm run db:seed` once on the server before starting

---

## 🔐 Changing Admin Password

```bash
node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('./data/dulorabite.db');
const hash = bcrypt.hashSync('YOUR_NEW_PASSWORD', 10);
db.prepare('UPDATE admins SET password_hash = ? WHERE username = ?').run(hash, 'admin');
console.log('Password updated!');
db.close();
"
```

---

## 📞 Business Info (Pre-configured)
- **Company:** SK HiFi Traders
- **Email:** sk.hifi.traders@gmail.com
- **Phone:** +91 9902396359
- **Address:** 886, 6th Main Road, Ramnagar South, Madipakkam, Chennai 600091
- **FSSAI:** 21225008003991
- **GST:** 33FRFPS0340E322
- **Website:** www.dulorabite.co.in

---

*Built with ❤️ for DuloraBite*
