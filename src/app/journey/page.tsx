"use client";

// 여정 컨테이너 — 현재 ① 발굴(인터뷰 + 취향 첫 적재)까지 구현.
// ②거울 이후는 journey-map.md 순서대로 단계 추가 예정.

import { useEffect, useState } from "react";
import Link from "next/link";
import { INTERVIEW_QUESTIONS } from "@/content/questions";
import {
  loadLibrary,
  saveLibrary,
  emptyLibrary,
  type Library,
  type TasteItem,
} from "@/lib/library";

type Phase = "interview" | "done";

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

export default function JourneyPage() {
  const [phase, setPhase] = useState<Phase>("interview");
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [library, setLibrary] = useState<Library>(emptyLibrary);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  // 이어하기: 이미 답한 문항이 있으면 그 다음부터
  useEffect(() => {
    const lib = loadLibrary();
    setLibrary(lib);
    const answered = INTERVIEW_QUESTIONS.filter((q) => lib.answers[q.id]);
    if (answered.length >= INTERVIEW_QUESTIONS.length) {
      setPhase("done");
    } else {
      setCurrent(answered.length);
      setHistory(
        answered.map((q) => ({ q: q.question, a: lib.answers[q.id] }))
      );
    }
  }, []);

  const total = INTERVIEW_QUESTIONS.length;
  const q = INTERVIEW_QUESTIONS[Math.min(current, total - 1)];

  function submit() {
    const answer = input.trim();
    if (!answer) return;

    const next: Library = {
      ...library,
      answers: { ...library.answers, [q.id]: answer },
      tastes: q.taste
        ? [...library.tastes, ...parseTastes(answer)]
        : library.tastes,
    };
    saveLibrary(next); // 문항마다 즉시 적재 — 끊겨도 유실 없음
    setLibrary(next);
    setHistory([...history, { q: q.question, a: answer }]);
    setInput("");

    if (current + 1 >= total) {
      setPhase("done");
    } else {
      setCurrent(current + 1);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 취향 서재
        </Link>

        {phase === "interview" && (
          <>
            {/* 진행 표시 */}
            <div className="flex gap-1.5 my-6 flex-wrap">
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
              {history.map((h, i) => (
                <details key={i} className="group">
                  <summary className="text-sm text-muted cursor-pointer list-none truncate">
                    ✓ {h.q}
                  </summary>
                  <p className="text-sm mt-1 pl-4 border-l-2 border-line text-foreground/80">
                    {h.a}
                  </p>
                </details>
              ))}
            </div>

            {/* 현재 질문 */}
            <div className="bg-card border border-line rounded-2xl rounded-tl-sm p-6 mb-4">
              <p className="text-xs text-accent mb-2">
                {q.taste ? "취향 적재" : `질문 ${current + 1} / ${total}`}
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
              placeholder="편하게, 짧게 적어도 괜찮아요…"
              rows={4}
              className="w-full bg-card border border-line rounded-xl p-4 text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-muted">
                답변은 이 브라우저에만 저장돼요
              </p>
              <button
                onClick={submit}
                disabled={!input.trim()}
                className="bg-accent text-background font-semibold rounded-lg px-6 py-2.5 disabled:opacity-30 hover:opacity-90 transition-opacity"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {phase === "done" && (
          <div className="mt-10 text-center">
            <p className="text-5xl mb-6">📚</p>
            <h2 className="text-2xl font-bold mb-3">
              첫 적재가 끝났어요
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              답변 {Object.keys(library.answers).length}개와 취향{" "}
              {library.tastes.length}권이 서재에 꽂혔습니다.
              <br />
              이제 이 서가를 비추면, 당신이 보이기 시작할 거예요.
            </p>
            <div className="bg-card border border-line rounded-xl p-6 text-left mb-8">
              <p className="text-xs text-accent mb-3">당신의 첫 장서</p>
              <div className="flex flex-wrap gap-2">
                {library.tastes.map((t, i) => (
                  <span
                    key={i}
                    className="text-sm bg-accent-soft text-foreground/90 rounded-lg px-3 py-1.5"
                  >
                    {t.name}
                  </span>
                ))}
                {library.tastes.length === 0 && (
                  <span className="text-sm text-muted">
                    (취향 답변에서 장서를 만들지 못했어요)
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted">
              다음 단계 <strong className="text-foreground">② 거울</strong> —
              당신의 답변에서 반복된 패턴을 비춰드릴게요. (준비 중)
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
