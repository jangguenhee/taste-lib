"use client";

// ③ 입어보기 — 페르소나 후보를 제시하고 반응으로 자기를 발견하게 한다.
// 자기를 잃은 사람은 무(無)에서 정의하지 못한다. 선택지가 거울이 된다.

import { useEffect, useState } from "react";
import { aiPost } from "@/lib/ai";
import type { TryonResult } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { StepProps } from "./types";

export function TryOnStep({ lib, update }: StepProps) {
  const [result, setResult] = useState<TryonResult | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    aiPost<TryonResult>("tryon", { mirror: lib.mirror, tastes: lib.tastes })
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
    return <Thinking message="당신에게 어울릴 모습들을 준비하고 있어요…" />;
  }

  return (
    <div className="mt-4">
      <SampleBadge show={isMock} />
      <h2 className="text-2xl font-bold mb-2">👗 입어보기</h2>
      <p className="text-muted mb-8">
        세 가지 모습을 준비했어요. 정답은 없어요 — 입어보고{" "}
        <strong className="text-foreground">&ldquo;이건 나 같다&rdquo;</strong>
        는 느낌을 따라가세요.
      </p>

      <div className="space-y-3 mb-10">
        {result.candidates.map((c) => (
          <Card
            key={c.id}
            selected={selected === c.id}
            onClick={() => setSelected(c.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-lg mb-1">{c.name}</p>
                <p className="text-sm text-foreground/80 mb-2">{c.concept}</p>
                <p className="text-sm text-muted">{c.desc}</p>
              </div>
              <span
                className={`shrink-0 w-5 h-5 rounded-full border ${
                  selected === c.id
                    ? "bg-accent border-accent"
                    : "border-line"
                }`}
              />
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm font-semibold mb-3 text-muted">
        이 결에서 실제로 활동 중인 사람들
      </p>
      <div className="space-y-2 mb-10">
        {result.references.map((r) => (
          <div
            key={r.name}
            className="flex items-baseline gap-3 text-sm border-b border-line pb-2"
          >
            <span className="shrink-0 font-medium">{r.name}</span>
            <span className="shrink-0 text-xs text-accent">{r.platform}</span>
            <span className="text-muted">{r.why}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          disabled={!selected}
          onClick={() => selected && update({ tryonChoice: selected })}
        >
          이 옷이 나 같아요 →
        </Button>
      </div>
    </div>
  );
}
