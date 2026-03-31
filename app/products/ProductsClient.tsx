'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATS = [
  { key: 'all', label: 'All Products' },
  { key: 'cookies', label: '🍪 Cookies' },
  { key: 'chocolates', label: '🍫 Chocolates' },
  { key: 'lollipops', label: '🍭 Lollipops' },
  { key: 'energy', label: '⚡ Energy Bars' },
];

const SORTS = [
  { key: 'default', label: 'Default' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'name', label: 'Name A–Z' },
];

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = initialProducts;
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [initialProducts, cat, sort, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A08060' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: '1.5px solid rgba(59,31,14,0.15)', background: '#fff', color: '#3B1F0E' }}
            onFocus={e => (e.target.style.borderColor = '#C8973A')}
            onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} style={{ color: '#A08060' }} />
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="text-sm py-2.5 px-3 rounded-xl outline-none"
            style={{ border: '1.5px solid rgba(59,31,14,0.15)', background: '#fff', color: '#3B1F0E' }}>
            {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATS.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: cat === c.key ? '#3B1F0E' : 'transparent',
              border: `1.5px solid ${cat === c.key ? '#3B1F0E' : 'rgba(59,31,14,0.2)'}`,
              color: cat === c.key ? '#E8B96A' : '#6B4C35',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-24" style={{ color: '#A08060' }}>
          <p className="text-4xl mb-4">🍫</p>
          <p className="font-playfair text-xl font-bold mb-2" style={{ color: '#3B1F0E' }}>No products found</p>
          <p className="text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-6" style={{ color: '#A08060' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
