interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  id?: string;
}

const GAP = 2;
const RADIUS = 2;

const ToggleButton = ({ checked, onChange, size = 30, id }: ToggleButtonProps) => {
  const knobSize = size - GAP * 2;

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative transition-colors duration-300"
      style={{
        width: size * 2,
        height: size,
        borderRadius: RADIUS,
        backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-border)',
        boxShadow: checked ? '0 0 12px rgba(201, 168, 106, 0.4)' : 'none',
      }}
    >
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{
          width: knobSize,
          height: knobSize,
          top: GAP,
          left: checked ? `calc(100% - ${knobSize + GAP}px)` : GAP,
          borderRadius: RADIUS,
          backgroundColor: checked ? 'var(--color-light)' : 'var(--color-text-primary)',
        }}
      />
    </button>
  );
};

export default ToggleButton;
