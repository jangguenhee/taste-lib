"use client";

// 랜딩 배경 — 결·곁·겹 세 구슬이 아침 빛처럼 아주 느리게 떠다닌다.
// 차분함을 깨지 않는 동적임. (Pass 2에서 "떨어져 쌓이는" 물리 모션으로 확장 예정)

import { motion } from "framer-motion";

const ORBS = [
  { char: "결", size: 130, x: "8%", y: "12%", dur: 13, color: "var(--accent)" },
  { char: "곁", size: 90, x: "78%", y: "22%", dur: 17, color: "var(--warm)" },
  { char: "겹", size: 170, x: "62%", y: "68%", dur: 21, color: "var(--accent)" },
];

export function FloatingGyeol() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((o, i) => (
        <motion.div
          key={o.char}
          className="absolute rounded-full flex items-center justify-center select-none"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: o.color,
            opacity: 0.07,
          }}
          animate={{
            y: [0, -18, 6, 0],
            x: [0, 10, -8, 0],
            scale: [1, 1.04, 0.98, 1],
          }}
          transition={{
            duration: o.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: o.size * 0.34, color: o.color, opacity: 0.5 }}
          >
            {o.char}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
