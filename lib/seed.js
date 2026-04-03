// Run with: node lib/seed.js
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'dulorabite.db'));
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    weight TEXT NOT NULL,
    description TEXT,
    badge TEXT DEFAULT '',
    image TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    stock INTEGER DEFAULT 100,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal REAL NOT NULL,
    delivery_charge REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reseller_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    partnership_type TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed products
const existingProducts = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (existingProducts.c === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, price, original_price, weight, description, badge, image, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const products = [
    ['Sprouted Ragi Almond Cookies', 'cookies', 249, 299, '225g', 'High fibre, natural protein & wholesome millet goodness. Powered by sprouted ragi flour and premium almonds.', 'popular', 'Sprouted_Ragi_Almond_Cookies.jpeg', 80],
    ['Cashew Butter Cookies', 'cookies', 279, 329, '200g', 'Premium homemade, delicious protein rich cookies with real cashews. A thoughtful treat for every celebration.', '', 'Cashew_Biutter_Cookies.jpeg', 75],
    ['Peanut Butter Cookies', 'cookies', 229, 279, '200g', 'No refined sugar, no palm oil. Clean & honest ingredients. Protein rich and delicious.', '', 'Peanut_Butter_Cookies.jpeg', 90],
    ['Butterscotch Cookies', 'cookies', 249, 299, '200g', 'A thoughtful treat for every celebration. Rich butterscotch flavour with premium homemade quality.', 'bestseller', 'ButterSCotch_Cookies.jpeg', 65],
    ['Chocolate Cookies', 'cookies', 249, 299, '200g', 'No refined sugar. Rich cocoa, real chocolate chips. 100% Vegetarian and preservative-free.', '', 'Chocolate_Cookies.jpeg', 70],
    ['Assorted Chocolates Gift Box', 'chocolates', 499, 599, '200g', 'Handcrafted with carefully selected nuts. Salted caramel, hazelnut praline, raspberry ganache & coffee bean.', 'popular', 'Chocolates.jpeg', 50],
    ['Assorted Dark Chocolates', 'chocolates', 399, 449, '200g', 'Carefully selected nuts wrapped in rich dark chocolate. Perfect for gifting and family moments.', '', 'Assorted_Dark_Chocolates.jpeg', 60],
    ['Crunchy Honey Loops Chocolate', 'chocolates', 349, 399, '300g', 'Irresistible cereal indulgence. Perfect morning pick-me-up. Delightful cereal-chocolate bliss.', 'new', 'HoneyLoops_Chocolate.jpeg', 55],
    ['Milk Chocolate Energy Bar', 'energy', 299, 349, '250g', 'Protein & oat power. On-the-go snack, pre-workout boost and quick tasty fuel for anytime cravings.', '', 'Milk_Chocolate_Energy_Bar.jpeg', 85],
    ['Assorted Fruit Flavoured Lollipops', 'lollipops', 199, 229, '250g', 'Premium all-natural. No palm oil, no preservatives. 100% Vegetarian. Delicious fruity burst.', '', 'Assorted_Fruit_Flavoured_Lolipop.jpeg', 100],
    ['Rainbow Multi-flavour Lollipops', 'lollipops', 199, 229, '250g', 'Watermelon, litchi, strawberry, mango, orange. Premium all-natural delicious fruity burst!', 'popular', 'Rainbow_Multi-Flavoured_Lolipop.jpeg', 100],
  ];
  products.forEach(p => insert.run(...p));
  console.log('✅ Seeded', products.length, 'products');
}

// Seed admin user
const existingAdmin = db.prepare('SELECT COUNT(*) as c FROM admins').get();
if (existingAdmin.c === 0) {
  const pass = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
  const hash = bcrypt.hashSync(pass, 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Admin created!');
}

console.log('🎉 Database seeded successfully!');
db.close();
