'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ChevronRight, Menu, X, Sparkles } from 'lucide-react';

const AdminCtx = createContext<{ token: string; username: string; logout: () => void } | null>(null);
export const useAdmin = () => useContext(AdminCtx)!;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    const u = localStorage.getItem('admin_username') || '';
    if (!t && path !== '/admin') router.push('/admin');
    setToken(t);
    setUsername(u);
  }, []);

  function logout() {
    fetch('/api/auth', { method: 'DELETE' });
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    router.push('/admin');
  }

  // Show login screen if no token and on /admin
  if (!token && path === '/admin') {
    return <LoginScreen onLogin={(t, u) => { setToken(t); setUsername(u); }} />;
  }

  const NAV = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { href: '/admin/products', label: 'Products', icon: <Package size={17} /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={17} /> },
    { href: '/admin/resellers', label: 'Reseller Leads', icon: <Users size={17} /> },
    { href: '/admin/cms', label: 'CMS Content', icon: <Sparkles size={17} /> },
  ];

  return (
    <AdminCtx.Provider value={{ token, username, logout }}>
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: 'var(--font-dm)', background: '#f5f2ef' }}>
        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-40 w-56 flex-shrink-0 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ background: '#fff', borderRight: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="h-16 flex items-center px-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div>
              <p className="font-playfair text-lg font-black" style={{ color: '#3B1F0E' }}>DuloraBite</p>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: '#FDF3E3', color: '#C8973A' }}>Admin</span>
            </div>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1">
            {NAV.map(n => {
              const active = path === n.href;
              return (
                <Link key={n.href} href={n.href} onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: active ? '#FDF3E3' : 'transparent',
                    color: active ? '#3B1F0E' : '#777',
                    borderLeft: active ? '2px solid #C8973A' : '2px solid transparent',
                    fontWeight: active ? 600 : 400,
                  }}>
                  {n.icon}{n.label}
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
          <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#3B1F0E' }}>{username}</p>
            <button onClick={logout} className="flex items-center gap-2 text-xs transition-colors" style={{ color: '#999' }}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6" style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#3B1F0E' }}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <Link href="/" target="_blank" className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{ background: '#FDF3E3', color: '#C8973A', border: '1px solid rgba(200,151,58,0.25)' }}>
                View Site →
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && <div className="fixed inset-0 z-30 md:hidden" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setSidebarOpen(false)} />}
      </div>
    </AdminCtx.Provider>
  );
}

function LoginScreen({ onLogin }: { onLogin: (t: string, u: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function login() {
    if (!username || !password) { setError('Please enter credentials'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
      onLogin(data.token, data.username);
      router.push('/admin/dashboard');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const inp = { border: '1.5px solid rgba(59,31,14,0.15)', borderRadius: '10px', padding: '12px 16px', width: '100%', fontSize: '14px', outline: 'none', background: '#FBF6EE', color: '#3B1F0E', fontFamily: 'inherit' };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#3B1F0E' }}>
      <div className="w-full max-w-sm rounded-2xl p-8 animate-scale-in" style={{ background: '#fff' }}>
        <div className="text-center mb-8">
          <p className="font-playfair text-3xl font-black mb-1" style={{ color: '#3B1F0E' }}>DuloraBite</p>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C8973A' }}>Admin Dashboard</span>
        </div>
        {error && <p className="text-sm text-center mb-4 p-3 rounded-lg" style={{ background: '#fce8e8', color: '#8B2020' }}>{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={inp}
              onFocus={e => (e.target.style.borderColor = '#C8973A')} onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A0603A' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="••••••••••" style={inp}
              onFocus={e => (e.target.style.borderColor = '#C8973A')} onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.15)')} />
          </div>
          <button onClick={login} disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mt-2 disabled:opacity-60"
            style={{ background: '#C8973A', color: '#3B1F0E' }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </div>
        <Link href="/" className="block text-center mt-5 text-xs" style={{ color: '#C8973A' }}>← Back to website</Link>
      </div>
    </div>
  );
}
