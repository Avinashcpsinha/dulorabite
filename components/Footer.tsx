'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1A0D06', borderTop: '1px solid rgba(200,151,58,0.12)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-playfair text-3xl font-black block mb-1" style={{ color: '#E8B96A' }}>DuloraBite</span>
            <span className="text-xs tracking-widest uppercase block mb-4" style={{ color: 'rgba(253,243,227,0.35)' }}>Crafted with Love</span>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(253,243,227,0.45)' }}>
              Premium homemade chocolates, cookies and lollipops. No preservatives, no palm oil — just pure, honest indulgence for the whole family.
            </p>
            <div className="flex gap-3 mt-5">
              {['FSSAI ✓', 'GST ✓', '100% Veg ✓'].map(b => (
                <span key={b} className="text-xs font-semibold px-3 py-1.5 rounded"
                  style={{ background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.2)', color: '#E8B96A' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C8973A' }}>Products</h4>
            <ul className="space-y-2.5">
              {['Cookies', 'Chocolates', 'Lollipops', 'Energy Bars'].map(p => (
                <li key={p}><Link href="/products" className="text-sm transition-colors"
                  style={{ color: 'rgba(253,243,227,0.45)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E8B96A')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,243,227,0.45)')}>
                  {p}
                </Link></li>
              ))}
              <li className="pt-2">
                <a href="/images/DuloraBite_Catalogue.png" download 
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all inline-block"
                  style={{ background: 'rgba(200,151,58,0.1)', border: '1px solid rgba(200,151,58,0.2)', color: '#E8B96A' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,151,58,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,151,58,0.1)')}>
                  Download Catalog ↓
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C8973A' }}>Company</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/products', 'Products'], ['/#story', 'Our Story'], ['/#contact', 'Reseller']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'rgba(253,243,227,0.75)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E8B96A')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,243,227,0.75)')}>
                  {label}
                </Link></li>
              ))}
            </ul>
            <div className="mt-5 text-xs space-y-1" style={{ color: 'rgba(253,243,227,0.3)' }}>
              <p>sk.hifi.traders@gmail.com</p>
              <p>+91 9902396359</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(200,151,58,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(253,243,227,0.25)' }}>
            © 2025 DuloraBite / SK HiFi Traders · GST: 33FRFPS0340E322 · FSSAI: 21225008003991
          </p>
          <p className="text-xs" style={{ color: 'rgba(253,243,227,0.25)' }}>
            886, 6th Main Road, Madipakkam, Chennai 600091
          </p>
        </div>
      </div>
    </footer>
  );
}
