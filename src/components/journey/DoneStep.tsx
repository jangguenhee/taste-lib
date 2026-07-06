"use client";

// 여정 완료 — 개관식이 끝난 서재. 창작을 마친 "뒤에" 링크로 내보낸다.
// v1.5에서 이 화면이 "서재 홈"(적재→갱신→뻗음 루프의 입구)으로 자란다.

import { clearLibrary } from "@/lib/library";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StepProps } from "./types";

export function DoneStep({ lib }: StepProps) {
  const picked = lib.experiences.find((e) => e.pickedAt);
  const content = lib.contents[lib.contents.length - 1];

  function restart() {
    clearLibrary();
    window.location.href = "/";
  }

  return (
    <div className="mt-4 text-center">
      <p className="text-5xl mb-6">🎉</p>
      <h2 className="text-2xl font-bold mb-3">
        당신은 오늘, 만드는 사람이 됐어요
      </h2>
      <p className="text-muted leading-relaxed mb-10">
        소비만 하던 사람이 자기 언어로 첫 기록을 남겼습니다.
        <br />이 서재는 계속 자랄 거예요.
      </p>

      {content && (
        <Card className="border-accent/50 text-left mb-6">
          <p className="text-xs text-accent mb-3">
            {lib.persona?.concept} · 첫 번째 기록
          </p>
          <p className="font-bold text-lg mb-3">{content.title}</p>
          <p className="whitespace-pre-line leading-relaxed text-sm text-foreground/90">
            {content.caption}
          </p>
        </Card>
      )}

      {picked?.url && (
        <a
          href={picked.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-background font-semibold rounded-xl px-8 py-4 mb-10 hover:opacity-90 transition-opacity"
        >
          이제 진짜로 만나보세요 — {picked.title} →
        </a>
      )}

      <Card className="text-left mb-8">
        <p className="text-xs text-accent mb-3">오늘 서재에 쌓인 것</p>
        <ul className="text-sm text-foreground/80 space-y-1.5">
          <li>📚 장서 {lib.tastes.length}권 (취향)</li>
          <li>📜 페르소나 정의서 1부 — {lib.persona?.concept}</li>
          <li>✍️ 첫 콘텐츠 {lib.contents.length}편</li>
        </ul>
      </Card>

      <p className="text-sm text-muted mb-6">
        다 읽고 나면 돌아오세요. 그 감상이 두 번째 콘텐츠가 될 거예요. (준비
        중)
      </p>

      <Button variant="ghost" onClick={restart}>
        처음부터 다시 열기
      </Button>
    </div>
  );
}
