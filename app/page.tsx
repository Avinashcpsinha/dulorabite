import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/components/CartContext';
import { getDb } from '@/lib/db';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import { Sparkles, Heart, Shield, Award } from 'lucide-react';
import Link from 'next/link';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const products = await db.prepare('SELECT * FROM products WHERE active=1 LIMIT 4').all() as Product[];
    return products;
  } catch {
    return [];
  }
}

async function getSettings(): Promise<any> {
  try {
    const db = await getDb();
    const rows = await db.prepare('SELECT * FROM settings').all();
    return rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const settings = await getSettings();

  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">
        {/* --- HERO SLIDER --- */}
        <HeroSlider />

        {/* --- FEATURES STRIP --- */}
        <div className="py-8 border-y border-[#3B1F0E]/5 bg-white overflow-hidden whitespace-nowrap relative z-10">
          <div className="animate-marquee inline-block">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-xs font-bold uppercase tracking-[0.2em] text-[#A0603A]/60">
                <Sparkles size={12} className="text-[#C8973A]" /> Homemade with Love &nbsp; • &nbsp; No Preservatives &nbsp; • &nbsp; 100% Vegetarian &nbsp; • &nbsp; Pure Indulgence &nbsp; • &nbsp; Perfect for Gifting
              </span>
            ))}
          </div>
        </div>

        {/* --- PRODUCTS SECTION --- */}
        <section className="py-24 bg-[#FBF6EE] overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8973A] mb-3 block">Bestsellers</span>
                <h2 className="font-playfair text-4xl md:text-5xl font-black text-[#3B1F0E]">Recommended for <em className="text-[#A0603A]">You</em></h2>
              </div>
              <Link href="/products" className="text-sm font-bold uppercase tracking-widest text-[#3B1F0E] border-b-2 border-[#C8973A] pb-1 hover:text-[#C8973A] transition-colors">
                View All Collection
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- BRAND STORY --- */}
        <section id="story" className="py-24 bg-[#3B1F0E] text-[#FDF3E3] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C8973A]/5 pointer-events-none" style={{ borderRadius: '100% 0 0 100%' }} />
          <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-4 border border-[#C8973A]/30 rounded-2xl rotate-3" />
                <img 
                  src="/images/hero-bg.png" 
                  alt="Quality Ingredients" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl skew-y-1"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-[#C8973A]/10 text-[#3B1F0E]">
                  <p className="font-playfair text-3xl font-black mb-1">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A0603A]">Vegetarian & Safe</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8B96A] mb-3 block">{settings.story_subtitle || 'About DuloraBite'}</span>
                <h2 className="font-playfair text-4xl md:text-6xl font-black mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: settings.story_title?.replace('\n', '<br />') || 'Handmade with <br /> <em className="text-[#E8B96A]">Pure Intention</em>' }} />
                <p className="text-white/70 leading-relaxed mb-6 font-cormorant text-xl italic">
                  "{settings.story_description || 'At DuloraBite, we believe that the best sweets are made just like they would be in your own kitchen—with honest ingredients and zero compromises.'}"
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8B96A]/10 flex-shrink-0 flex items-center justify-center border border-[#E8B96A]/20">
                      <Shield size={20} className="text-[#E8B96A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E8B96A]">No Preservatives</h4>
                      <p className="text-sm text-white/50">Everything is made fresh to order. No shelf-life enhancers, just pure flavor.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8B96A]/10 flex-shrink-0 flex items-center justify-center border border-[#E8B96A]/20">
                      <Heart size={20} className="text-[#E8B96A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E8B96A]">No Palm Oil</h4>
                      <p className="text-sm text-white/50">We use only high-quality fats and oils. Better for your heart, better for the planet.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8B96A]/10 flex-shrink-0 flex items-center justify-center border border-[#E8B96A]/20">
                      <Award size={20} className="text-[#E8B96A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#E8B96A]">FSSAI Certified</h4>
                      <p className="text-sm text-white/50">Our processes meet all safety and quality standards, giving you peace of mind.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PARTNERSHIP / RESELLER --- */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-lg text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8973A] mb-3 block">{settings.reseller_subtitle || 'Business Opportunities'}</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-black text-[#3B1F0E] mb-6">{settings.reseller_title || 'Become a Partner'}</h2>
            <p className="text-[#A0603A]">
              {settings.reseller_description || 'We are looking for passionate resellers and distributors. Contact us to join our journey.'}
            </p>
            <Link href="/products" className="mt-8 inline-block px-10 py-4 rounded-full bg-[#C8973A] text-[#3B1F0E] font-bold uppercase tracking-wider hover:bg-[#E8B96A] transition-all">
              Join the Family
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </CartProvider>
  );
}
