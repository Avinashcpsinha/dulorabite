'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

export default function ResellerForm() {
  const [form, setForm] = useState({ full_name: '', business_name: '', phone: '', email: '', city: '', state: '', partnership_type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.full_name || !form.phone || !form.city || !form.partnership_type) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/resellers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSubmitted(true);
      toast.success('Application submitted! We\'ll contact you within 48 hours. 🤝');
    } catch (e: any) {
      toast.error(e.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,151,58,0.2)' }}>
      <CheckCircle size={52} style={{ color: '#2a7a2a', marginBottom: '16px' }} />
      <h3 className="font-playfair text-2xl font-bold mb-3" style={{ color: '#fff' }}>Application Received!</h3>
      <p className="text-sm max-w-xs" style={{ color: 'rgba(253,243,227,0.6)' }}>Our team will reach out to you within 48 hours to discuss partnership details.</p>
    </div>
  );

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,151,58,0.22)', color: '#fff', borderRadius: '8px', padding: '11px 14px', width: '100%', fontFamily: 'inherit', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,151,58,0.2)' }}>
      <h3 className="font-playfair font-bold text-2xl mb-1" style={{ color: '#fff' }}>Reseller Application</h3>
      <p className="text-xs mb-7" style={{ color: 'rgba(253,243,227,0.4)' }}>Fill in details below — we'll respond within 48 hours.</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Full Name *', key: 'full_name', placeholder: 'Your name', col: 1 },
          { label: 'Business Name', key: 'business_name', placeholder: 'Shop / company', col: 1 },
          { label: 'Phone *', key: 'phone', placeholder: '+91 XXXXXXXXXX', col: 1 },
          { label: 'Email', key: 'email', placeholder: 'you@email.com', col: 1 },
          { label: 'City *', key: 'city', placeholder: 'City', col: 1 },
          { label: 'State', key: 'state', placeholder: 'State', col: 1 },
        ].map(f => (
          <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#E8B96A' }}>{f.label}</label>
            <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#C8973A')}
              onBlur={e => (e.target.style.borderColor = 'rgba(200,151,58,0.22)')} />
          </div>
        ))}

        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#E8B96A' }}>Partnership Type *</label>
          <select value={form.partnership_type} onChange={e => set('partnership_type', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Select type...</option>
            {['Reseller (Small Scale)', 'Distributor (City Level)', 'Bulk Corporate Orders', 'Online Seller', 'Gift Shop Partner'].map(o => (
              <option key={o} value={o} style={{ background: '#3B1F0E' }}>{o}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#E8B96A' }}>Message</label>
          <textarea value={form.message} onChange={e => set('message', e.target.value)}
            rows={3} placeholder="Tell us about your business..."
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => (e.target.style.borderColor = '#C8973A')}
            onBlur={e => (e.target.style.borderColor = 'rgba(200,151,58,0.22)')} />
        </div>
      </div>

      <button onClick={submit} disabled={loading}
        className="w-full mt-5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60"
        style={{ background: '#C8973A', color: '#3B1F0E' }}
        onMouseEnter={e => !loading && ((e.target as HTMLElement).style.background = '#E8B96A')}
        onMouseLeave={e => ((e.target as HTMLElement).style.background = '#C8973A')}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </div>
  );
}
