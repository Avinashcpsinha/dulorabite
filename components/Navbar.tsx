'use client';
import Link from 'next/link';
import { useCart } from './CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { totalItems, dispatch } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ background: 'rgba(59,31,14,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,151,58,0.25)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-playfair text-2xl font-black" style={{ color: '#E8B96A' }}>DuloraBite</span>
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(253,243,227,0.45)', marginTop: '-3px' }}>Crafted with Love</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {[['/', 'Home'], ['/products', 'Products'], ['/#story', 'Our Story'], ['/#contact', 'Reseller']].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(253,243,227,0.75)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E8B96A')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,243,227,0.75)')}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button onClick={() => dispatch({ type: 'OPEN' })}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ background: 'rgba(200,151,58,0.15)', border: '1px solid rgba(200,151,58,0.35)', color: '#E8B96A' }}>
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#C8973A', color: '#3B1F0E' }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin link */}
          <Link href="/admin" className="hidden md:inline-flex px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200"
            style={{ background: '#C8973A', color: '#3B1F0E' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E8B96A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C8973A')}>
            Admin
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden" style={{ color: '#E8B96A' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: 'rgba(59,31,14,0.98)' }}>
          {[['/', 'Home'], ['/products', 'Products'], ['/#story', 'Our Story'], ['/#contact', 'Reseller'], ['/admin', 'Admin Panel']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className="text-sm py-2 border-b font-medium" style={{ color: 'rgba(253,243,227,0.8)', borderColor: 'rgba(200,151,58,0.15)' }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
