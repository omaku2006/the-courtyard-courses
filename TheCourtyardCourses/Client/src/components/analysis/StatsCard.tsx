interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

const StatsCard = ({ icon, label, value, highlight }: StatsCardProps) => {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-sm border-2 border-border bg-surface">
      <span className="no-margin text-accent">{icon}</span>
      <span className="no-margin font-heading uppercase tracking-wider text-text-muted" style={{ fontSize: '0.625rem' }}>
        {label}
      </span>
      <span
        className={`no-margin font-heading font-bold ${highlight ? 'text-accent' : 'text-text'}`}
        style={{ fontSize: '1.125rem' }}
      >
        {value}
      </span>
    </div>
  );
};

export default StatsCard;
