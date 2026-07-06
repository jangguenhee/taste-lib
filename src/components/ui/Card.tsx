interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", selected, onClick }: CardProps) {
  const interactive = onClick
    ? "cursor-pointer hover:border-accent/60 transition-colors"
    : "";
  const border = selected ? "border-accent" : "border-line";
  return (
    <div
      onClick={onClick}
      className={`bg-card border ${border} rounded-2xl p-6 ${interactive} ${className}`}
    >
      {children}
    </div>
  );
}
