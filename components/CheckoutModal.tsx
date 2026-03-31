'use client';
import { useState } from 'react';
import { useCart } from './CartContext';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch, total } = useCart();
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
            id: i.id,
            name: i.name,
            quantity: i.qty,
            price: i.price,
          })),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong while placing your order.');
      }
      
      dispatch({ type: 'CLEAR' });
      setSuccess(data.order_code || 'SUCCESS');
      toast.success('Order placed successfully!');
    } catch (e: any) {
      console.error('Checkout error:', e);
      toast.error(e.message || 'Failed to place order. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: '#fff' }}>
        <div className="sticky top-0 flex items-center justify-between p-6 z-10 bg-white border-b border-gray-100">
          <h2 className="font-playfair text-2xl font-bold" style={{ color: '#3B1F0E' }}>
            {success ? 'Success!' : 'Finalize Order'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" style={{ color: '#6B4C35' }}><X size={20} /></button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} style={{ color: '#2a7a2a' }} />
              </div>
              <h3 className="font-playfair text-3xl font-bold mb-3" style={{ color: '#3B1F0E' }}>Delicious!</h3>
              <p className="text-lg font-medium mb-1" style={{ color: '#6B4C35' }}>Order ID: <span className="text-amber-700 font-bold">{success}</span></p>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">We've received your order and sent a confirmation email. Sit back and relax!</p>
              <button 
                onClick={onClose} 
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-amber-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ background: '#C8973A', color: '#fff' }}>
                Return to Shop
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 p-5 rounded-2xl border border-amber-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, #FDF3E3 100%)' }}>
                <div className="flex items-center gap-2 mb-3 text-amber-800">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Order Summary</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {state.items.map(i => (
                    <div key={i.id} className="flex justify-between text-sm items-center" style={{ color: '#6B4C35' }}>
                      <span className="font-medium">{i.name} <span className="text-xs opacity-60">× {i.qty}</span></span>
                      <span className="font-bold">₹{i.price * i.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-black pt-4 mt-3 border-t border-amber-200/50 text-lg" style={{ color: '#3B1F0E' }}>
                  <span>Grand Total</span><span>₹{total}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', key: 'customer_name', placeholder: 'Your Name', col: 2 },
                  { label: 'Phone *', key: 'customer_phone', placeholder: '98765 43210', col: 1 },
                  { label: 'Email', key: 'customer_email', placeholder: 'hello@example.com', col: 1 },
                  { label: 'Address *', key: 'address', placeholder: 'House/Street/Landmark', col: 2 },
                  { label: 'City *', key: 'city', placeholder: 'Your City', col: 1 },
                  { label: 'State', key: 'state', placeholder: 'Your State', col: 1 },
                  { label: 'Pincode *', key: 'pincode', placeholder: '000000', col: 1 },
                ].map(f => (
                  <div key={f.key} className={f.col === 2 ? 'col-span-2' : 'col-span-1'}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#A0603A' }}>{f.label}</label>
                    <input 
                      value={(form as any)[f.key]} 
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm border-2 border-transparent focus:bg-white focus:border-amber-400 outline-none transition-all shadow-sm"
                      style={{ background: '#F8F5F1', color: '#3B1F0E' }}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#A0603A' }}>Payment Method</label>
                  <select 
                    value={form.payment_method} 
                    onChange={e => set('payment_method', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm border-2 border-transparent focus:bg-white focus:border-amber-400 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                    style={{ background: '#F8F5F1', color: '#3B1F0E' }}>
                    {['UPI / PhonePe / GPay', 'Net Banking', 'Credit / Debit Card', 'Cash on Delivery'].map(m => (
                      <option key={m} className="py-2 text-base">{m}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#A0603A' }}>Special Instructions</label>
                  <textarea 
                    value={form.notes} 
                    onChange={e => set('notes', e.target.value)}
                    rows={2} 
                    placeholder="Leave a message..."
                    className="w-full px-4 py-3 rounded-xl text-sm border-2 border-transparent focus:bg-white focus:border-amber-400 outline-none transition-all shadow-sm resize-none"
                    style={{ background: '#F8F5F1', color: '#3B1F0E' }} 
                  />
                </div>
              </div>

              <button 
                onClick={placeOrder} 
                disabled={loading}
                className="w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-200/50 hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #D4A74F 0%, #B8862D 100%)', color: '#fff' }}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Order • ₹{total}</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
