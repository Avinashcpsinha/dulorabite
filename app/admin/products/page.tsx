'use client';
import { useEffect, useState } from 'react';
import { useAdmin } from '../layout';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', category: 'cookies', price: '', original_price: '', weight: '', description: '', badge: '', image: '', stock: '100' };

export default function AdminProductsPage() {
  const { token } = useAdmin();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/products?active=false', { headers });
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }

  function openAdd() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(p: any) { setEditing(p); setForm({ ...p, price: String(p.price), original_price: String(p.original_price || ''), stock: String(p.stock) }); setModal(true); }

  async function save() {
    if (!form.name || !form.price || !form.image) { toast.error('Name, price and image are required'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/products/${editing.id}` : '/api/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null, stock: Number(form.stock) }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(editing ? 'Product updated!' : 'Product added!');
      setModal(false); load();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }

  async function del(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers });
    const data = await res.json();
    if (data.success) { toast.success('Deleted'); load(); } else toast.error(data.error);
  }

  async function toggle(p: any) {
    const res = await fetch(`/api/products/${p.id}`, { method: 'PUT', headers, body: JSON.stringify({ ...p, active: p.active ? 0 : 1 }) });
    const data = await res.json();
    if (data.success) { toast.success(p.active ? 'Product disabled' : 'Product enabled'); load(); } else toast.error(data.error);
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const inp = (extra?: any) => ({ border: '1.5px solid rgba(59,31,14,0.15)', borderRadius: '8px', padding: '10px 13px', fontSize: '13px', outline: 'none', background: '#FBF6EE', color: '#3B1F0E', fontFamily: 'inherit', width: '100%', ...extra });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>Products</h1>
          <p className="text-sm" style={{ color: '#999' }}>Manage your product catalog, pricing & availability</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: '#3B1F0E', color: '#E8B96A' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none w-full"
          style={{ border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff' }} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        {loading ? <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>Loading products...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: '#faf7f4' }}>
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td className="px-4 py-3">
                      <img src={`/images/${p.image}`} alt={p.name} className="w-11 h-11 rounded-lg object-cover" style={{ background: '#FDF3E3' }}
                        onError={(e: any) => { e.target.src = '/images/DuloraBite_Catalogue.png'; }} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold" style={{ color: '#3B1F0E' }}>{p.name}</p>
                      {p.badge && <span className="text-xs font-bold px-2 py-0.5 rounded mt-0.5 inline-block capitalize" style={{ background: '#FDF3E3', color: '#C8973A' }}>{p.badge}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize" style={{ color: '#666' }}>{p.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold" style={{ color: '#3B1F0E' }}>₹{p.price}</p>
                      {p.original_price && <p className="text-xs line-through" style={{ color: '#bbb' }}>₹{p.original_price}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: p.stock < 20 ? '#8B2020' : '#555' }}>{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: p.active ? '#e6f4e6' : '#fce8e8', color: p.active ? '#2a7a2a' : '#8B2020' }}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#C8973A' }}
                          title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => toggle(p)} className="p-1.5 rounded-lg transition-colors" style={{ color: p.active ? '#2a7a2a' : '#999' }}
                          title={p.active ? 'Disable' : 'Enable'}>
                          {p.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button onClick={() => del(p.id, p.name)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#cc4444' }}
                          title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>No products found</div>}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-playfair text-xl font-bold mb-5" style={{ color: '#3B1F0E' }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="grid grid-cols-2 gap-4">
              {([
                { label: 'Product Name *', key: 'name', col: 2, ph: 'e.g. Butterscotch Cookies' },
                { label: 'Image Filename *', key: 'image', col: 2, ph: 'e.g. ButterSCotch_Cookies.jpeg' },
                { label: 'Price (₹) *', key: 'price', col: 1, ph: '249', type: 'number' },
                { label: 'Original Price (₹)', key: 'original_price', col: 1, ph: '299', type: 'number' },
                { label: 'Weight', key: 'weight', col: 1, ph: '200g' },
                { label: 'Stock', key: 'stock', col: 1, ph: '100', type: 'number' },
              ] as any[]).map(f => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm((x: any) => ({ ...x, [f.key]: e.target.value }))}
                    placeholder={f.ph} type={f.type || 'text'} style={inp()}
                    onFocus={e => (e.target.style.borderColor = '#C8973A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Category</label>
                <select value={form.category} onChange={e => setForm((x: any) => ({ ...x, category: e.target.value }))} style={inp()}>
                  {['cookies', 'chocolates', 'lollipops', 'energy'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Badge</label>
                <select value={form.badge} onChange={e => setForm((x: any) => ({ ...x, badge: e.target.value }))} style={inp()}>
                  <option value="">None</option>
                  {['popular', 'bestseller', 'new'].map(b => <option key={b} value={b} className="capitalize">{b}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm((x: any) => ({ ...x, description: e.target.value }))}
                  rows={3} placeholder="Product description..." style={{ ...inp(), resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = '#C8973A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ border: '1.5px solid rgba(59,31,14,0.15)', color: '#666' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60" style={{ background: '#C8973A', color: '#3B1F0E' }}>
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
