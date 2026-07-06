"use client";

// ⑦ 첫 콘텐츠 — 끌림이 첫 창작물이 되는 순간. 북극성 지표(창작자 전환)의 완성점.
// "방금 당신이 한 말, 이미 콘텐츠예요."

import { useEffect, useState } from "react";
import { aiPost } from "@/lib/ai";
import type { CreateResult } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { StepProps } from "./types";

export function CreateStep({ lib, update }: StepProps) {
  const [result, setResult] = useState<CreateResult | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    aiPost<CreateResult>("create", {
      reflection: lib.reflection,
      concept: lib.persona?.concept,
      pickedTitle: lib.experiences.find((e) => e.pickedAt)?.title,
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
    return <Thinking message="당신의 말을 다듬고 있어요… 거의 다 됐어요." />;
  }

  return (
    <div className="mt-4">
      <SampleBadge show={isMock} />
      <h2 className="text-2xl font-bold mb-2">✨ 당신의 첫 콘텐츠</h2>
      <p className="text-muted mb-8">{result.whyMe}</p>

      {/* 콘텐츠 카드 — 이후 이미지 공유 카드(P1)의 원형 */}
      <Card className="border-accent/50 mb-8">
        <p className="text-xs text-accent mb-3">
          {lib.persona?.concept} · 첫 번째 기록
        </p>
        <p className="font-bold text-xl mb-4">{result.title}</p>
        <p className="whitespace-pre-line leading-relaxed text-foreground/90">
          {result.caption}
        </p>
      </Card>

      <div className="text-center">
        <Button
          onClick={() =>
            update({
              contents: [
                ...lib.contents,
                {
                  title: result.title,
                  hook: result.hook,
                  caption: result.caption,
                  whyMe: result.whyMe,
                  createdAt: new Date().toISOString(),
                },
              ],
            })
          }
        >
          서재에 간직할게요 →
        </Button>
      </div>
    </div>
  );
}
