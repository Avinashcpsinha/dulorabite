'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CMSPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) toast.success('Content updated successfully!');
      else toast.error('Failed to update content');
    } catch {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  const inpClass = "w-full p-3 rounded-lg border border-gray-200 focus:border-[#C8973A] outline-none text-sm font-medium";
  const areaClass = "w-full p-3 rounded-lg border border-gray-200 focus:border-[#C8973A] outline-none text-sm min-h-[100px]";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#3B1F0E]">CMS Content</h1>
        <p className="text-gray-500 text-sm">Manage your website's home page sections.</p>
      </div>

      <div className="space-y-8 pb-32">
        {/* Story Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3B1F0E] mb-6 border-b pb-2">Our Story Section</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Subtitle</label>
              <input 
                className={inpClass}
                value={settings.story_subtitle || ''} 
                onChange={e => setSettings({...settings, story_subtitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Title</label>
              <input 
                className={inpClass}
                value={settings.story_title || ''} 
                onChange={e => setSettings({...settings, story_title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Description</label>
              <textarea 
                className={areaClass}
                value={settings.story_description || ''} 
                onChange={e => setSettings({...settings, story_description: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Reseller Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3B1F0E] mb-6 border-b pb-2">Reseller / Partner Section</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Subtitle</label>
              <input 
                className={inpClass}
                value={settings.reseller_subtitle || ''} 
                onChange={e => setSettings({...settings, reseller_subtitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Title</label>
              <input 
                className={inpClass}
                value={settings.reseller_title || ''} 
                onChange={e => setSettings({...settings, reseller_title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0603A] mb-2">Description</label>
              <textarea 
                className={areaClass}
                value={settings.reseller_description || ''} 
                onChange={e => setSettings({...settings, reseller_description: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 md:left-56 bg-white/80 backdrop-blur p-4 border-t border-gray-100 flex justify-end z-20">
        <button 
          onClick={save} 
          disabled={saving}
          className="px-8 py-3 bg-[#C8973A] text-white rounded-xl font-bold shadow-lg shadow-[#C8973A]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
