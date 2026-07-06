"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold rounded-lg px-6 py-2.5 transition-opacity disabled:opacity-30";
  const styles =
    variant === "primary"
      ? "bg-accent text-background hover:opacity-90"
      : "text-muted hover:text-foreground";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
