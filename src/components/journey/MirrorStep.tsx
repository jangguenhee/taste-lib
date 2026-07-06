"use client";

// ② 거울 — 답변·취향에서 본인이 못 보는 패턴을 되비춘다. "어떻게 알았지?"의 순간.

import { useState } from "react";
import { aiPost } from "@/lib/ai";
import type { MirrorResult } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { StepProps } from "./types";

type Phase = "intro" | "loading" | "result";

export function MirrorStep({ lib, update }: StepProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<MirrorResult | null>(null);
  const [isMock, setIsMock] = useState(false);

  async function analyze() {
    setPhase("loading");
    try {
      const res = await aiPost<MirrorResult>("mirror", {
        answers: lib.answers,
        tastes: lib.tastes,
      });
      setResult(res.data);
      setIsMock(res.mock);
      setPhase("result");
    } catch {
      setPhase("intro"); // 실패 시 다시 시도 가능
    }
  }

  if (phase === "intro") {
    return (
      <div className="text-center mt-8">
        <p className="text-5xl mb-6">📚</p>
        <h2 className="text-2xl font-bold mb-3">첫 적재가 끝났어요</h2>
        <p className="text-muted leading-relaxed mb-8">
          답변 {Object.keys(lib.answers).length}개와 취향 {lib.tastes.length}
          권이 서재에 꽂혔습니다.
          <br />
          이제 이 서가를 비추면, 당신이 보이기 시작할 거예요.
        </p>
        {lib.tastes.length > 0 && (
          <Card className="text-left mb-8">
            <p className="text-xs text-accent mb-3">당신의 첫 장서</p>
            <div className="flex flex-wrap gap-2">
              {lib.tastes.map((t, i) => (
                <span
                  key={i}
                  className="text-sm bg-accent-soft text-foreground/90 rounded-lg px-3 py-1.5"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </Card>
        )}
        <Button onClick={analyze}>🪞 서가 비추기 →</Button>
      </div>
    );
  }

  if (phase === "loading") {
    return <Thinking message="당신의 답변을 천천히 다시 읽고 있어요…" />;
  }

  return (
    <div className="mt-4">
      <SampleBadge show={isMock} />
      <h2 className="text-2xl font-bold mb-2">🪞 거울</h2>
      <p className="text-muted mb-8">
        당신 답변에서 계속 나온 것들이에요. 본인은 잘 못 보는 것들.
      </p>

      <div className="space-y-3 mb-8">
        {result?.patterns.map((p, i) => (
          <Card key={i}>
            <p className="text-xs text-accent mb-1.5">반복된 결 {i + 1}</p>
            <p className="leading-relaxed">{p}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-3 mb-8">
        {result?.strengths.map((s, i) => (
          <Card key={i} className="border-accent/40">
            <p className="text-xs text-accent mb-1.5">숨은 강점</p>
            <p className="leading-relaxed">{s}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-accent-soft border-accent/40 mb-8">
        <p className="leading-relaxed">{result?.summary}</p>
      </Card>

      <div className="text-center">
        <Button onClick={() => result && update({ mirror: result })}>
          이 모습, 더 자세히 볼래요 →
        </Button>
      </div>
    </div>
  );
}
