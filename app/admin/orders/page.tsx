'use client';
import { useEffect, useState } from 'react';
import { useAdmin } from '../layout';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_OPTS = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed:  { bg: '#e6f4e6', color: '#2a7a2a' },
  processing: { bg: '#FDF3E3', color: '#C8973A' },
  shipped:    { bg: '#e6eef8', color: '#1B3A6B' },
  delivered:  { bg: '#e6f4e6', color: '#2a7a2a' },
  cancelled:  { bg: '#fce8e8', color: '#8B2020' },
};

export default function AdminOrdersPage() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/orders', { headers });
    const data = await res.json();
    if (data.success) setOrders(data.data);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/orders/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (data.success) { toast.success(`Status updated to ${status}`); load(); } else toast.error(data.error);
  }

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>Orders</h1>
          <p className="text-sm" style={{ color: '#999' }}>{orders.length} orders · ₹{totalRevenue.toLocaleString('en-IN')} total revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        {loading ? <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>Loading orders...</div>
        : orders.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>No orders yet. Orders placed on the website will appear here.</div>
        : (
          <div>
            {orders.map(o => {
              const sc = STATUS_COLORS[o.status] || { bg: '#eee', color: '#666' };
              const isOpen = expanded === o.id;
              return (
                <div key={o.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div className="px-5 py-4 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : o.id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: '#3B1F0E' }}>{o.order_code}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{new Date(o.created_at).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#3B1F0E' }}>{o.customer_name}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{o.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#3B1F0E' }}>₹{o.total}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{o.payment_method}</p>
                    </div>
                    <select value={o.status} onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(o.id, e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer"
                      style={{ background: sc.bg, color: sc.color }}>
                      {STATUS_OPTS.map(s => <option key={s} value={s} style={{ background: '#fff', color: '#333' }}>{s}</option>)}
                    </select>
                    {isOpen ? <ChevronUp size={16} style={{ color: '#aaa' }} /> : <ChevronDown size={16} style={{ color: '#aaa' }} />}
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div className="px-5 pb-5" style={{ background: '#faf9f7', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C8973A' }}>Delivery Address</p>
                          <p className="text-sm" style={{ color: '#555' }}>{o.address}, {o.city}, {o.state} – {o.pincode}</p>
                          {o.customer_email && <p className="text-xs mt-1" style={{ color: '#aaa' }}>{o.customer_email}</p>}
                          {o.notes && <p className="text-xs mt-2 italic" style={{ color: '#aaa' }}>Note: {o.notes}</p>}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C8973A' }}>Order Items</p>
                          {o.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm py-1" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', color: '#555' }}>
                              <span>{item.product_name} × {item.quantity}</span>
                              <span className="font-semibold" style={{ color: '#3B1F0E' }}>₹{item.total_price}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm font-bold pt-2 mt-1" style={{ color: '#3B1F0E' }}>
                            <span>Total</span><span>₹{o.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
