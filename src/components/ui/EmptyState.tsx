interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 border-t border-border max-w-lg">
      <span className="block w-10 h-1 bg-primary mb-5" aria-hidden="true" />
      <h3 className="font-display text-3xl text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}