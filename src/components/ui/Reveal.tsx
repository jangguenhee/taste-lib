"use client";

// 스태거 리빌 — 결과 카드가 한 박자씩 떠오르는 등장.
// 차분하지만 살아있는 움직임 (스프링, 과하지 않게).

import { motion } from "framer-motion";

export function Reveal({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.14,
        type: "spring",
        stiffness: 120,
        damping: 16,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
