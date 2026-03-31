import { sql, db as vercelDb } from '@vercel/postgres';
import path from 'path';
import fs from 'fs';

// Mock data as fallback
const mockProducts = [
  { id: 1, name: 'Sprouted Ragi Almond Cookies', category: 'cookies', price: 249, original_price: 299, weight: '225g', description: 'High fibre, natural protein & wholesome millet goodness.', badge: 'popular', image: 'Sprouted_Ragi_Almond_Cookies.jpeg', active: 1, stock: 80 },
  { id: 2, name: 'Cashew Butter Cookies', category: 'cookies', price: 279, original_price: 329, weight: '200g', description: 'Premium homemade, delicious protein rich cookies with real cashews.', badge: '', image: 'Cashew_Biutter_Cookies.jpeg', active: 1, stock: 75 },
  { id: 3, name: 'Assorted Dark Chocolates', category: 'chocolates', price: 549, original_price: 649, weight: '250g', description: 'Rich dark chocolates handcrafted with care and premium ingredients.', badge: 'new', image: 'Assorted_Dark_Chocolates.jpeg', active: 1, stock: 45 },
  { id: 4, name: 'Rainbow Multi-flavour Lollipops', category: 'lollipops', price: 199, original_price: 229, weight: '250g', description: 'Premium all-natural fruit burst pops! 100% vegetarian.', badge: 'popular', image: 'Lollipop.jpeg', active: 1, stock: 100 },
  { id: 5, name: 'Butterscotch Cookies', category: 'cookies', price: 259, original_price: 309, weight: '200g', description: 'Crunchy butterscotch bits in a premium buttery cookie base.', badge: '', image: 'ButterSCotch_Cookies.jpeg', active: 1, stock: 60 },
  { id: 6, name: 'Chocolate Chip Cookies', category: 'cookies', price: 269, original_price: 319, weight: '200g', description: 'Classic homemade chocolate cookies with rich cocoa flavor.', badge: '', image: 'Chocolate_Cookies.jpeg', active: 1, stock: 90 },
  { id: 7, name: 'Peanut Butter Cookies', category: 'cookies', price: 279, original_price: 329, weight: '200g', description: 'Rich and creamy peanut butter taste in every crunchy bite.', badge: '', image: 'Peanut_Butter_Cookies.jpeg', active: 1, stock: 55 },
  { id: 8, name: 'Crunchy Honey Loops', category: 'chocolates', price: 349, original_price: 399, weight: '150g', description: 'Sweet and crunchy honey loops coated in premium dark chocolate.', badge: 'bestseller', image: 'HoneyLoops_Chocolate.jpeg', active: 1, stock: 40 },
  { id: 9, name: 'Milk Chocolate Energy Bar', category: 'chocolates', price: 149, original_price: 179, weight: '50g', description: 'The perfect on-the-go snack for an instant energy boost.', badge: 'new', image: 'Milk_Chocolate_Energy_Bar.jpeg', active: 1, stock: 120 },
  { id: 10, name: 'Fruit Flavoured Lollipops', category: 'lollipops', price: 179, original_price: 199, weight: '200g', description: 'Classic assorted fruit flavors in fun long-lasting pops.', badge: '', image: 'Assorted_Fruit_Flavoured_Lolipop.jpeg', active: 1, stock: 150 },
];

export async function getDb(): Promise<any> {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const isPostgres = !!dbUrl;

  if (isPostgres) {
    // Ensure tables exist and initial data is present
    try {
      await vercelDb.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
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
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS reseller_leads (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          business_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          partnership_type TEXT NOT NULL,
          message TEXT,
          status TEXT DEFAULT 'new',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
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
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed products if empty
      const { rowCount: pCount } = await vercelDb.query('SELECT 1 FROM products LIMIT 1');
      if (pCount === 0) {
        for (const p of mockProducts) {
          await vercelDb.query(
            'INSERT INTO products (name, category, price, original_price, weight, description, badge, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [p.name, p.category, p.price, p.original_price, p.weight, p.description, p.badge, p.image]
          );
        }
      }

      // Seed admin if empty
      const { rowCount: aCount } = await vercelDb.query('SELECT 1 FROM admins LIMIT 1');
      if (aCount === 0) {
        const bcrypt = require('bcryptjs');
        const hash = bcrypt.hashSync('dulorabite@123', 10);
        await vercelDb.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      }
    } catch (err) {
      console.warn('Database initialization error:', err);
    }

    return {
      prepare: (query: string) => ({
        all: async () => {
          const cleanQuery = query.replace(/\?/g, (_, i) => `$${i + 1}`);
          const { rows } = await vercelDb.query(cleanQuery);
          return rows;
        },
        get: async (...args: any[]) => {
          const cleanQuery = query.replace(/\?/g, (_, i) => `$${i + 1}`);
          const { rows } = await vercelDb.query(cleanQuery, args);
          return rows[0] || null;
        },
        run: async (...args: any[]) => {
          const { rowCount } = await vercelDb.query(query, args);
          return { changes: rowCount };
        }
      })
    };
  }

  // Fallback to Mock Database for Local Dev / No DB connected
  return {
    prepare: (query: string) => ({
      all: () => {
        if (query.includes('products')) return mockProducts;
        return [];
      },
      get: (queryArgs: any) => {
        if (query.includes('COUNT(*)')) {
          if (query.includes('products')) return { c: mockProducts.length };
          return { c: 0 };
        }
        if (query.includes('FROM admins WHERE username = ?')) {
          const bcrypt = require('bcryptjs');
          return { id: 1, username: 'admin', password_hash: bcrypt.hashSync('dulorabite@123', 10) };
        }
        return null;
      },
      run: () => ({ changes: 1 })
    })
  };
}

export { sql };
