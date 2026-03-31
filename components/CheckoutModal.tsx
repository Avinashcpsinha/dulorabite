'use client';
import { useState } from 'react';
import { useCart } from './CartContext';
import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch, subtotal, deliveryCharge, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    address: '', city: '', state: '', pincode: '',
    payment_method: 'UPI / PhonePe / GPay', notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function placeOrder() {
    if (!form.customer_name || !form.customer_phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: state.items.map(i => ({
            product_id: i.id,
            product_name: i.name,
            quantity: i.qty,
            unit_price: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      dispatch({ type: 'CLEAR' });
      setSuccess(data.data.order_code);
    } catch (e: any) {
      toast.error(e.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl animate-scale-in" style={{ background: '#fff' }}>
        <div className="sticky top-0 flex items-center justify-between p-6 z-10" style={{ background: '#fff', borderBottom: '1px solid rgba(59,31,14,0.08)' }}>
          <h2 className="font-playfair text-2xl font-bold" style={{ color: '#3B1F0E' }}>
            {success ? 'Order Confirmed!' : 'Checkout'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: '#6B4C35' }}><X size={20} /></button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="mx-auto mb-4" style={{ color: '#2a7a2a' }} />
              <h3 className="font-playfair text-2xl font-bold mb-2" style={{ color: '#3B1F0E' }}>Thank You!</h3>
              <p className="text-sm mb-1" style={{ color: '#6B4C35' }}>Your order <strong>{success}</strong> has been placed.</p>
              <p className="text-sm mb-6" style={{ color: '#A08060' }}>We'll contact you at {form.customer_phone} with delivery updates.</p>
              <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider"
                style={{ background: '#C8973A', color: '#3B1F0E' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Order summary */}
              <div className="mb-5 p-4 rounded-xl text-sm" style={{ background: '#FDF3E3' }}>
                <p className="font-semibold mb-1" style={{ color: '#3B1F0E' }}>Order Summary</p>
                {state.items.map(i => (
                  <div key={i.id} className="flex justify-between text-xs py-0.5" style={{ color: '#6B4C35' }}>
                    <span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 mt-1" style={{ borderTop: '1px solid rgba(59,31,14,0.12)', color: '#3B1F0E' }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name *', key: 'customer_name', placeholder: 'Ramesh Kumar', col: 2 },
                  { label: 'Phone *', key: 'customer_phone', placeholder: '+91 9999999999', col: 1 },
                  { label: 'Email', key: 'customer_email', placeholder: 'you@email.com', col: 1 },
                  { label: 'Address *', key: 'address', placeholder: 'Flat, Street, Area', col: 2 },
                  { label: 'City *', key: 'city', placeholder: 'Chennai', col: 1 },
                  { label: 'State', key: 'state', placeholder: 'Tamil Nadu', col: 1 },
                  { label: 'Pincode *', key: 'pincode', placeholder: '600001', col: 1 },
                ].map(f => (
                  <div key={f.key} className={f.col === 2 ? 'col-span-2' : 'col-span-1'}>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ border: '1.5px solid rgba(59,31,14,0.15)', background: '#FBF6EE', color: '#3B1F0E' }}
                      onFocus={e => (e.target.style.borderColor = '#C8973A')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Payment Method</label>
                  <select value={form.payment_method} onChange={e => set('payment_method', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid rgba(59,31,14,0.15)', background: '#FBF6EE', color: '#3B1F0E' }}>
                    {['UPI / PhonePe / GPay', 'Net Banking', 'Credit / Debit Card', 'Cash on Delivery'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    rows={2} placeholder="Any special instructions..."
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                    style={{ border: '1.5px solid rgba(59,31,14,0.15)', background: '#FBF6EE', color: '#3B1F0E' }} />
                </div>
              </div>

              <button onClick={placeOrder} disabled={loading}
                className="w-full mt-5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60"
                style={{ background: '#C8973A', color: '#3B1F0E' }}>
                {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
