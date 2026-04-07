import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/i18n/LocaleProvider';
import { getNeighborhoods, getCuisines } from '@/data/venues';
import BackgroundFX from '@/components/layout/BackgroundFX';

export default function AgregarLugar() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', neighborhood: '', cuisine: '', description: '' });

  const neighborhoods = getNeighborhoods();
  const cuisines = getCuisines();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return;
    toast.success(t.addPlace.success);
    setForm({ name: '', address: '', neighborhood: '', cuisine: '', description: '' });
  };

  return (
    <div className="min-h-screen">
      <BackgroundFX />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> WeEat
        </button>
        <h1 className="font-display text-3xl font-bold text-foreground">{t.addPlace.title}</h1>
        <p className="text-muted-foreground mt-1 mb-8">{t.addPlace.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.addPlace.name}</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.addPlace.namePlaceholder} required className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.addPlace.address}</label>
            <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder={t.addPlace.addressPlaceholder} required className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.addPlace.neighborhood}</label>
              <select value={form.neighborhood} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">—</option>
                {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.addPlace.cuisine}</label>
              <select value={form.cuisine} onChange={e => setForm(p => ({ ...p, cuisine: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">—</option>
                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.addPlace.description}</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder={t.addPlace.descPlaceholder} rows={4} className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4" /> {t.addPlace.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
