import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-5">
        <div
          aria-hidden
          className="absolute inset-0 -m-4 rounded-full bg-primary/10 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative h-16 w-16 rounded-2xl glass-strong flex items-center justify-center"
        >
          {icon ?? <SearchX className="h-7 w-7 text-muted-foreground" />}
        </motion.div>
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
