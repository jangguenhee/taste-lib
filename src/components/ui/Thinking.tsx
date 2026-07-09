"use client";

// 로딩 상태 — AI가 "생각하는" 순간의 연출.
// 점 세 개 ● ● ● = 결·곁·겹 (브랜드 모티프): 기다림조차 브랜드의 언어로.

export function Thinking({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="flex gap-1.5 mb-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p
        className="text-[10px] text-muted/70 tracking-[0.5em] mb-5 select-none"
        aria-hidden
      >
        결곁겹
      </p>
      <p className="text-muted">{message}</p>
    </div>
  );
}
