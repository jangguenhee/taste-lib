"use client";

// 로딩 상태 — 여정 중 AI가 "생각하는" 순간의 연출.
// 기계적 스피너 대신 앱 보이스로 말을 건다.

export function Thinking({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
}
