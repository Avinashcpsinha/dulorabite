'use client';
import { useCart } from './CartContext';
import { Product } from '@/lib/types';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  popular:    { bg: '#8B2020', color: '#fff' },
  bestseller: { bg: '#2E5E2E', color: '#fff' },
  new:        { bg: '#1B3A6B', color: '#fff' },
};

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const badge = product.badge && BADGE_STYLES[product.badge];
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  function addToCart() {
    dispatch({ type: 'ADD', product });
    toast.success(`${product.name} added! 🛒`);
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ boxShadow: '0 4px 20px rgba(59,31,14,0.07)', border: '1px solid rgba(59,31,14,0.05)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 16px 48px rgba(59,31,14,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,31,14,0.07)')}>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: '#FDF3E3' }}>
        <img src={`/images/${product.image}`} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e: any) => { e.target.src = '/images/DuloraBite_Catalogue.png'; }} />

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
            style={{ background: badge.bg, color: badge.color, letterSpacing: '0.5px' }}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: '#C8973A', color: '#3B1F0E' }}>
            -{discount}%
          </span>
        )}

        {/* Quick add on hover */}
        <div className="absolute inset-0 flex items-end justify-center p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'linear-gradient(to top, rgba(59,31,14,0.65) 0%, transparent 60%)' }}>
          <button onClick={addToCart}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: '#C8973A', color: '#3B1F0E' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E8B96A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C8973A')}>
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#C8973A' }}>
          {product.category}
        </p>
        <h3 className="font-playfair font-bold text-base leading-snug mb-1.5 line-clamp-2" style={{ color: '#3B1F0E' }}>
          {product.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#A08060' }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-playfair font-bold text-xl" style={{ color: '#3B1F0E' }}>₹{product.price}</span>
            {product.original_price && (
              <span className="text-xs line-through ml-1.5" style={{ color: '#C0A080' }}>₹{product.original_price}</span>
            )}
            <span className="text-xs ml-1" style={{ color: '#A08060' }}>/ {product.weight}</span>
          </div>
          <button onClick={addToCart}
            className="md:hidden px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: '#3B1F0E', color: '#E8B96A' }}>
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
