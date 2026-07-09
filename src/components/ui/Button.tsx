"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold rounded-xl px-6 py-2.5 disabled:opacity-30 transition-colors";
  const styles =
    variant === "primary"
      ? "bg-accent text-background hover:bg-accent/90 paper-shadow"
      : "text-muted hover:text-foreground";
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={`${base} ${styles} ${className}`}
      {...props}
    />
  );
}
