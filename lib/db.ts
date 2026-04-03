import { sql, db as vercelDb } from '@vercel/postgres';

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
  { id: 10, name: 'Fruit Flavoured Lollipops', category: 'lollipops', price: 179, original_price: 199, weight: '200g', description: 'Classic assorted fruit flavors in fun long-lasting pops.', badge: '', image: 'Assorted_Fruit_Flavoured_Lolipop.jpeg', active: 1, stock: 150 },
];

export async function getDb(): Promise<any> {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (dbUrl) {
    return {
      prepare: (query: string) => ({
        all: async (params: any[] = []) => {
          let pIndex = 0;
          const cleanQuery = query.replace(/\?/g, () => `$${++pIndex}`);
          const cleanParams = (Array.isArray(params) ? params : [params]).map(p => p === undefined ? null : p);
          const { rows } = await vercelDb.query(cleanQuery, cleanParams);
          return rows;
        },
        get: async (...params: any[]) => {
          let pIndex = 0;
          const cleanQuery = query.replace(/\?/g, () => `$${++pIndex}`);
          const cleanParams = params.map(p => p === undefined ? null : p);
          const { rows } = await vercelDb.query(cleanQuery, cleanParams);
          return rows[0] || null;
        },
        run: async (...params: any[]) => {
          let pIndex = 0;
          const cleanQuery = query.replace(/\?/g, () => `$${++pIndex}`);
          const cleanParams = params.map(p => p === undefined ? null : p);
          const { rowCount } = await vercelDb.query(cleanQuery, cleanParams);
          return { lastID: 0, changes: rowCount };
        }
      })
    };
  }

  // Fallback... (Same as before)
  return {
    prepare: (query: string) => ({
      all: (params: any[] = []) => {
          if (query.includes('products')) return mockProducts;
          if (query.includes('settings')) return [
              { key: 'story_title', value: 'Handmade with Pure Intention' },
              { key: 'story_subtitle', value: 'About DuloraBite' },
              { key: 'story_description', value: 'At DuloraBite...' },
          ];
          return [];
      },
      get: (args: any) => {
        if (query.includes('COUNT(*)')) return { c: mockProducts.length };
        if (query.includes('username')) {
            const bcrypt = require('bcryptjs');
            const pass = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
            return { id: 1, username: 'admin', password_hash: bcrypt.hashSync(pass, 10) };
        }
        return null;
      },
      run: () => ({ changes: 1 })
    })
  };
}

export { sql };
