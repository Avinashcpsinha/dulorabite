'use client';
import { useEffect, useState } from 'react';
import { useAdmin } from '../layout';
import { TrendingUp, Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';

export default function DashboardPage() {
  const { token } = useAdmin();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setStats(d.data); }).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-64 text-sm" style={{ color: '#aaa' }}>Loading...</div>;

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: <ShoppingBag size={22} />, color: '#C8973A' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: <IndianRupee size={22} />, color: '#2E5E2E' },
    { label: 'Active Products', value: stats?.activeProducts ?? 0, icon: <Package size={22} />, color: '#1B3A6B' },
    { label: 'Reseller Leads', value: stats?.resellerLeads ?? 0, icon: <Users size={22} />, color: '#8B2020', badge: stats?.newLeads ? `${stats.newLeads} new` : null },
  ];

  const STATUS_COLOR: Record<string, string> = { confirmed: '#2E5E2E', delivered: '#1B3A6B', cancelled: '#8B2020', processing: '#C8973A' };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>Dashboard</h1>
      <p className="text-sm mb-7" style={{ color: '#999' }}>Welcome back, {stats?.username || 'Admin'}! Here's your store overview.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</div>
              {c.badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FDF3E3', color: '#C8973A' }}>{c.badge}</span>}
            </div>
            <p className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>{c.value}</p>
            <p className="text-xs" style={{ color: '#aaa' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h2 className="font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>Recent Orders</h2>
        </div>
        {!stats?.recentOrders?.length ? (
          <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#faf7f4' }}>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td className="px-5 py-3 text-sm font-bold" style={{ color: '#3B1F0E' }}>{o.order_code}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#555' }}>{o.customer_name}</td>
                    <td className="px-5 py-3 text-sm font-bold" style={{ color: '#3B1F0E' }}>₹{o.total}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: `${STATUS_COLOR[o.status] || '#999'}18`, color: STATUS_COLOR[o.status] || '#999' }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: '#aaa' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
