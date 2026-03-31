'use client';
import { useCart } from './CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { state, dispatch, subtotal, deliveryCharge, total, totalItems } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!state.isOpen && !checkoutOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => dispatch({ type: 'CLOSE' })}>
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col animate-slide-in-right"
            style={{ background: '#FBF6EE' }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(59,31,14,0.08)' }}>
              <div>
                <h2 className="font-playfair text-2xl font-bold" style={{ color: '#3B1F0E' }}>Your Cart</h2>
                <p className="text-xs mt-0.5" style={{ color: '#A08060' }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => dispatch({ type: 'CLOSE' })} className="p-2 rounded-lg transition-colors"
                style={{ color: '#6B4C35' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,31,14,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <ShoppingBag size={48} style={{ color: 'rgba(59,31,14,0.15)' }} />
                  <p className="font-playfair text-lg font-bold" style={{ color: '#3B1F0E' }}>Your cart is empty</p>
                  <p className="text-sm text-center" style={{ color: '#A08060' }}>Add some delicious DuloraBite treats!</p>
                  <button onClick={() => dispatch({ type: 'CLOSE' })} className="mt-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
                    style={{ background: '#3B1F0E', color: '#E8B96A' }}>
                    Shop Now
                  </button>
                </div>
              ) : state.items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl" style={{ background: '#fff', boxShadow: '0 2px 10px rgba(59,31,14,0.06)' }}>
                  <img src={`/images/${item.image}`} alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e: any) => { e.target.src = '/images/DuloraBite_Catalogue.png'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#3B1F0E' }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#A08060' }}>{item.weight}</p>
                    <p className="font-bold text-sm mt-1" style={{ color: '#C8973A' }}>₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch({ type: 'DECREMENT', id: item.id })}
                        className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(59,31,14,0.06)' }}>
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold" style={{ color: '#3B1F0E' }}>{item.qty}</span>
                      <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}
                        className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(59,31,14,0.06)' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                      className="p-1 rounded transition-colors" style={{ color: '#cc4444' }}>
                      <Trash2 size={14} />
                    </button>
                    <span className="text-sm font-bold" style={{ color: '#3B1F0E' }}>₹{item.price * item.qty}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="p-5" style={{ borderTop: '1px solid rgba(59,31,14,0.08)' }}>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm" style={{ color: '#6B4C35' }}>
                    <span>Subtotal</span><span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#6B4C35' }}>
                    <span>Delivery</span>
                    <span style={{ color: deliveryCharge === 0 ? '#2a7a2a' : '#6B4C35' }}>
                      {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs" style={{ color: '#C8973A' }}>Add ₹{499 - subtotal} more for free delivery</p>
                  )}
                  <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid rgba(59,31,14,0.1)', color: '#3B1F0E' }}>
                    <span className="font-playfair text-lg">Total</span>
                    <span className="font-playfair text-lg">₹{total}</span>
                  </div>
                </div>
                <button onClick={() => { dispatch({ type: 'CLOSE' }); setCheckoutOpen(true); }}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
                  style={{ background: '#3B1F0E', color: '#E8B96A' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#C8973A')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#3B1F0E')}>
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
