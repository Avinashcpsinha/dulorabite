'use client';
import { useEffect, useState } from 'react';
import { useAdmin } from '../layout';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:        { bg: '#e6eef8', color: '#1B3A6B' },
  contacted:  { bg: '#FDF3E3', color: '#C8973A' },
  converted:  { bg: '#e6f4e6', color: '#2a7a2a' },
  rejected:   { bg: '#fce8e8', color: '#8B2020' },
};

export default function AdminResellersPage() {
  const { token } = useAdmin();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/resellers', { headers });
    const data = await res.json();
    if (data.success) setLeads(data.data);
    setLoading(false);
  }

  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: '#3B1F0E' }}>Reseller Leads</h1>
        <p className="text-sm" style={{ color: '#999' }}>{leads.length} applications · {newCount} new</p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        {loading ? <div className="text-center py-16 text-sm" style={{ color: '#aaa' }}>Loading leads...</div>
        : leads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🤝</p>
            <p className="text-sm" style={{ color: '#aaa' }}>No reseller applications yet. Applications from your website will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: '#faf7f4' }}>
                {['Name', 'Business', 'Contact', 'City', 'Partnership Type', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#aaa' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {leads.map(l => {
                  const sc = STATUS_COLORS[l.status] || { bg: '#eee', color: '#666' };
                  return (
                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#3B1F0E' }}>{l.full_name}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#555' }}>{l.business_name || '–'}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm" style={{ color: '#555' }}>{l.phone}</p>
                        {l.email && <p className="text-xs" style={{ color: '#aaa' }}>{l.email}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#555' }}>{l.city}{l.state ? `, ${l.state}` : ''}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#555' }}>{l.partnership_type}</td>
                      <td className="px-5 py-4 text-xs" style={{ color: '#aaa' }}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                          style={{ background: sc.bg, color: sc.color }}>{l.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
