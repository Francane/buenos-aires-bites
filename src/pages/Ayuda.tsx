import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import BackgroundFX from '@/components/layout/BackgroundFX';

export default function Ayuda() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <BackgroundFX />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> WeEat
        </button>
        <h1 className="font-display text-3xl font-bold text-foreground">{t.help.title}</h1>
        <p className="text-muted-foreground mt-1 mb-8">{t.help.subtitle}</p>

        <div className="space-y-3">
          {t.help.faq.map((item, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
              >
                {item.q}
                {openIdx === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
