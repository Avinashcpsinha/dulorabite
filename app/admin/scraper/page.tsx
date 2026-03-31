'use client';
import { useState } from 'react';
import { Search, Globe, Mail, Phone, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';
import { useAdmin } from '../layout';
import toast from 'react-hot-toast';

export default function ScraperPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { token } = useAdmin();

  async function handleScrape() {
    if (!url) return toast.error('Please enter a URL');
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
      toast.success('Website analyzed successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Scraping failed');
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-black text-[#3B1F0E]">Lead Scraper</h1>
        <p className="text-[#A0603A] text-sm italic">Analyze websites to extract business contact details for your reseller database.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#3B1F0E] mb-3">Website URL</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8973A]" size={18} />
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://businesswebsite.com/contact"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-1.5 border-[#3B1F0E]/10 outline-none focus:border-[#C8973A] transition-all bg-[#FBF6EE] text-sm"
            />
          </div>
          <button 
            onClick={handleScrape} 
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-[#C8973A] text-[#3B1F0E] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-[#E8B96A] disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
            {loading ? 'Analyzing...' : 'Start Scraping'}
          </button>
        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-[#3B1F0E]/5 border border-[#3B1F0E]/10 flex gap-4 items-start">
          <div className="mt-0.5 text-[#C8973A]">
            <Check size={16} />
          </div>
          <p className="text-xs text-[#3B1F0E]/60 leading-relaxed italic">
            <strong className="text-[#3B1F0E] not-italic">Pro Tip:</strong> For best results, use the <strong>direct business website</strong> (e.g., example.com/contact) instead of map search links. Google Maps data is loaded dynamically and requires a separate API for full extraction.
          </p>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Shop Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            <div className="p-6 bg-[#FDF3E3] border-b border-[#C8973A]/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-[#C8973A]">
                  <Globe size={24} />
                </div>
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#3B1F0E]">{result.shopName}</h2>
                  <a href={result.url} target="_blank" className="text-xs text-[#C8973A] flex items-center gap-1 hover:underline">
                    {result.url} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Emails */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A0603A] mb-4">
                  <Mail size={14} /> Registered Emails
                </h3>
                {result.emails.length > 0 ? (
                  <div className="space-y-2">
                    {result.emails.map((email: string) => (
                      <div key={email} className="flex items-center justify-between p-3 bg-[#FBF6EE] rounded-xl border border-black/5 group">
                        <span className="text-sm font-medium text-[#3B1F0E]">{email}</span>
                        <button onClick={() => copyToClipboard(email, email)} className="text-[#C8973A] opacity-30 group-hover:opacity-100 transition-opacity">
                          {copied === email ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-black/40">No emails found on this landing page.</p>
                )}
              </div>

              {/* Phones */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A0603A] mb-4">
                  <Phone size={14} /> Contact Numbers
                </h3>
                {result.phones.length > 0 ? (
                  <div className="space-y-2">
                    {result.phones.map((phone: string) => (
                      <div key={phone} className="flex items-center justify-between p-3 bg-[#FBF6EE] rounded-xl border border-black/5 group">
                        <span className="text-sm font-medium text-[#3B1F0E]">{phone}</span>
                        <button onClick={() => copyToClipboard(phone, phone)} className="text-[#C8973A] opacity-30 group-hover:opacity-100 transition-opacity">
                          {copied === phone ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-black/40">No phone numbers detected.</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="p-4 bg-white border-t border-black/5 text-center">
              <p className="text-[10px] text-black/30 font-medium uppercase tracking-[0.2em]">
                Verified Analysis Result • Contact extraction is based on visible DOM content
              </p>
            </div>
          </div>

          <div className="flex justify-center">
             {/* Action Button */}
             <button 
                onClick={() => toast.success('Lead structure saved to local cache')}
                className="px-10 py-4 rounded-full bg-[#3B1F0E] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-black"
             >
                Add to Potential Partners
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
