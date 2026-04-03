const { db } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🚀 Starting Postgres Seed (Neon)...');
  
  try {
    const client = await db.connect();

    // Create tables
    await client.sql`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.sql`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL
      );
    `;

    await client.sql`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    console.log('✅ Tables checked/created');

    // Seed products if empty
    const { rows: prodRows } = await client.sql`SELECT COUNT(*) FROM products`;
    if (prodRows[0].count == 0) {
      const products = [
        ['Sprouted Ragi Almond Cookies', 'cookies', 249, 299, '225g', 'High fibre, natural protein & wholesome millet goodness.', 'popular', 'Sprouted_Ragi_Almond_Cookies.jpeg', 80],
        ['Cashew Butter Cookies', 'cookies', 279, 329, '200g', 'Premium homemade, delicious protein rich cookies with real cashews.', '', 'Cashew_Biutter_Cookies.jpeg', 75],
        ['Peanut Butter Cookies', 'cookies', 229, 279, '200g', 'No refined sugar, no palm oil. Clean & honest ingredients.', '', 'Peanut_Butter_Cookies.jpeg', 90],
        ['Butterscotch Cookies', 'cookies', 249, 299, '200g', 'A thoughtful treat for every celebration.', 'bestseller', 'ButterSCotch_Cookies.jpeg', 65],
        ['Chocolate Cookies', 'cookies', 249, 299, '200g', 'No refined sugar. Rich cocoa, real chocolate chips.', '', 'Chocolate_Cookies.jpeg', 70],
      ];
      for (const p of products) {
        await client.query('INSERT INTO products (name, category, price, original_price, weight, description, badge, image, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', p);
      }
      console.log('✅ Seeded products');
    }

    // Seed admin
    const { rows: adminRows } = await client.sql`SELECT COUNT(*) FROM admins`;
    if (adminRows[0].count == 0) {
      const pass = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
      const hash = bcrypt.hashSync(pass, 10);
      await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log('✅ Admin created');
    }

    // Seed settings
    const { rows: setRows } = await client.sql`SELECT COUNT(*) FROM settings`;
    if (setRows[0].count == 0) {
      const settings = [
        ['story_title', 'Handmade with <br /> <em class="text-[#E8B96A]">Pure Intention</em>'],
        ['story_subtitle', 'About DuloraBite'],
        ['story_description', 'At DuloraBite, we believe that the best sweets are made just like they would be in your own kitchen—with honest ingredients and zero compromises.'],
        ['reseller_title', 'Become a Partner'],
        ['reseller_subtitle', 'Business Opportunities'],
        ['reseller_description', 'We are looking for passionate resellers and distributors. Contact us to join our journey.'],
      ];
      for (const [k, v] of settings) {
        await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', [k, v]);
      }
      console.log('✅ Seeded settings');
    }

    console.log('🎉 Postgres database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Postgres:', error);
    process.exit(1);
  }
}

seed();
