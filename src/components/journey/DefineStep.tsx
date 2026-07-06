"use client";

// ④ 정의 — 선택한 방향을 "나의 페르소나 정의서"로 확정.
// 이 문서는 스냅샷이 아니라 살아있는 문서 — 이후 적재마다 자란다(v1.5).

import { useEffect, useState } from "react";
import { aiPost } from "@/lib/ai";
import type { DefineResult } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { StepProps } from "./types";

/** 정의서 마크다운(경량)을 화면용으로 렌더 */
function renderRaw(raw: string) {
  return raw.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <p key={i} className="text-xs text-accent mt-5 mb-1.5 first:mt-0">
          {line.replace("## ", "")}
        </p>
      );
    }
    if (line.trim() === "") return null;
    return (
      <p
        key={i}
        className="leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{
          __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
        }}
      />
    );
  });
}

export function DefineStep({ lib, update }: StepProps) {
  const [result, setResult] = useState<DefineResult | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    aiPost<DefineResult>("define", {
      choice: lib.tryonChoice,
      mirror: lib.mirror,
      answers: lib.answers,
    })
      .then((res) => {
        if (cancelled) return;
        setResult(res.data);
        setIsMock(res.mock);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return <Thinking message="당신의 정의서를 쓰고 있어요…" />;
  }

  return (
    <div className="mt-4">
      <SampleBadge show={isMock} />
      <h2 className="text-2xl font-bold mb-2">📜 나의 페르소나 정의서</h2>
      <p className="text-muted mb-8">
        여기까지 온 당신이 고른 모습이에요. 완벽할 필요 없어요 — 이 문서는
        앞으로 당신과 함께 자랍니다.
      </p>

      <Card className="mb-8">{renderRaw(result.raw)}</Card>

      <div className="text-center">
        <Button
          onClick={() =>
            update({
              persona: {
                concept: result.concept,
                positioning: result.positioning,
                raw: result.raw,
                updatedAt: new Date().toISOString(),
              },
            })
          }
        >
          이 모습으로 살아볼게요 →
        </Button>
      </div>
    </div>
  );
}
