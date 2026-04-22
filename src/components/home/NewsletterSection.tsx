import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

export default function NewsletterSection() {
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden ring-1 ring-primary/20"
        >
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent bg-[length:200%_200%]"
            style={{ animation: 'gradient-pan 12s ease infinite' }}
          />
          {/* Floating internal orbs */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary-foreground) / 0.6), transparent 70%)',
              animation: 'orb-float-1 14s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(var(--accent) / 0.7), transparent 70%)',
              animation: 'orb-float-2 18s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm mb-6 ring-1 ring-primary-foreground/30"
            >
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </motion.div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              {locale === 'es' ? 'No te pierdas ningún descubrimiento' : "Don't miss any discovery"}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10">
              {locale === 'es'
                ? 'Recibí los mejores lugares nuevos y recomendaciones semanales directo en tu inbox.'
                : 'Get the best new spots and weekly recommendations straight to your inbox.'}
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground font-semibold"
              >
                <CheckCircle className="h-5 w-5" />
                {locale === 'es' ? '¡Listo! Te mantendremos al día.' : "You're in! We'll keep you posted."}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={locale === 'es' ? 'Tu email' : 'Your email'}
                  className="flex-1 px-5 py-3.5 rounded-xl bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-foreground/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  {locale === 'es' ? 'Suscribirse' : 'Subscribe'}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
