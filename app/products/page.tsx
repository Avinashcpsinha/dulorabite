import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import ProductsClient from './ProductsClient';
import { getDb } from '@/lib/db';
import { Product } from '@/lib/types';

async function getAllProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const products = await db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY category').all();
    return products as any[];
  } catch {
    return [];
  }
}

export const metadata = { title: 'Products – DuloraBite', description: 'Shop all DuloraBite homemade treats.' };

export default async function ProductsPage() {
  const products = await getAllProducts();
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ background: '#3B1F0E' }} className="py-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color: '#C8973A' }}>Our Full Collection</span>
          <h1 className="font-playfair font-black" style={{ fontSize: 'clamp(36px,6vw,64px)', color: '#fff' }}>
            Shop All <em style={{ color: '#E8B96A' }}>Products</em>
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'rgba(253,243,227,0.5)' }}>
            {products.length} products · No preservatives · 100% Vegetarian
          </p>
        </div>
        <ProductsClient initialProducts={products} />
      </div>
      <Footer />
    </CartProvider>
  );
}
