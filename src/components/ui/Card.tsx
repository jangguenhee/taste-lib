interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", selected, onClick }: CardProps) {
  const interactive = onClick
    ? "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
    : "";
  const border = selected
    ? "border-accent ring-1 ring-accent"
    : "border-line/60";
  return (
    <div
      onClick={onClick}
      className={`bg-card paper-shadow border ${border} rounded-2xl p-6 transition-all ${interactive} ${className}`}
    >
      {children}
    </div>
  );
}
