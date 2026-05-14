import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/i18n/LocaleProvider';
import BackgroundFX from '@/components/layout/BackgroundFX';

export default function Contacto() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    toast.success(t.contact.success);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <BackgroundFX />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Bites
        </button>
        <h1 className="font-display text-3xl font-bold text-foreground">{t.contact.title}</h1>
        <p className="text-muted-foreground mt-1 mb-8">{t.contact.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.contact.name}</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.contact.namePlaceholder} required className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.contact.email}</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.contact.emailPlaceholder} required className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.contact.message}</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder={t.contact.messagePlaceholder} rows={5} required className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4" /> {t.contact.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
