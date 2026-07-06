"use client";

// ① 발굴 — 인터뷰 + 취향 첫 적재 (journey-map §1막)

import { useState } from "react";
import { INTERVIEW_QUESTIONS } from "@/content/questions";
import type { TasteItem } from "@/lib/library";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./types";

/** 취향 답변(자유 텍스트)을 쉼표/줄바꿈 기준으로 장서 아이템으로 분해 */
function parseTastes(text: string): TasteItem[] {
  return text
    .split(/[,\n·]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((name) => ({
      type: "etc" as const,
      name,
      addedAt: new Date().toISOString(),
    }));
}

export function DiscoverStep({ lib, update }: StepProps) {
  const answeredCount = INTERVIEW_QUESTIONS.filter(
    (q) => lib.answers[q.id]
  ).length;
  const [current, setCurrent] = useState(answeredCount);
  const [input, setInput] = useState("");

  const total = INTERVIEW_QUESTIONS.length;
  const q = INTERVIEW_QUESTIONS[Math.min(current, total - 1)];
  const history = INTERVIEW_QUESTIONS.slice(0, current).filter(
    (item) => lib.answers[item.id]
  );

  function submit() {
    const answer = input.trim();
    if (!answer) return;

    update({
      answers: { ...lib.answers, [q.id]: answer },
      tastes: q.taste ? [...lib.tastes, ...parseTastes(answer)] : lib.tastes,
    }); // 문항마다 즉시 적재 — 끊겨도 유실 없음
    setInput("");
    if (current + 1 < total) setCurrent(current + 1);
  }

  return (
    <>
      {/* 문항 진행 표시 */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {INTERVIEW_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full min-w-4 ${
              i < current
                ? "bg-accent"
                : i === current
                  ? "bg-accent/50"
                  : "bg-line"
            }`}
          />
        ))}
      </div>

      {/* 지난 문답 */}
      <div className="space-y-3 mb-6">
        {history.map((item) => (
          <details key={item.id} className="group">
            <summary className="text-sm text-muted cursor-pointer list-none truncate">
              ✓ {item.question}
            </summary>
            <p className="text-sm mt-1 pl-4 border-l-2 border-line text-foreground/80">
              {lib.answers[item.id]}
            </p>
          </details>
        ))}
      </div>

      {/* 현재 질문 */}
      <div className="bg-card border border-line rounded-2xl rounded-tl-sm p-6 mb-4">
        <p className="text-xs text-accent mb-2">
          {current + 1} / {total}
          {q.taste ? " · 서재에 꽂혀요" : ""}
        </p>
        <p className="text-lg font-semibold leading-relaxed mb-2">
          {q.emoji} {q.question}
        </p>
        <p className="text-sm text-muted">💡 {q.hint}</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder={
          q.long
            ? "여기에 그대로 붙여넣으면 돼요. 정리 안 해도 괜찮아요…"
            : "편하게, 짧게 적어도 괜찮아요…"
        }
        rows={q.long ? 10 : 4}
        className="w-full bg-card border border-line rounded-xl p-4 text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
      />
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-muted">답변은 이 브라우저에만 저장돼요</p>
        <Button onClick={submit} disabled={!input.trim()}>
          다음 →
        </Button>
      </div>
    </>
  );
}
