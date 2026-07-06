"use client";

// ⑤ 경험하기 — 페르소나를 바로 살아보게 하는 첫 실행 = 소비.
// 주의: 여기서 링크로 내보내지 않는다. 끌리는 것을 "고르기"만 하고
// ⑥-a(지금 감상) → ⑦(첫 콘텐츠)를 지난 뒤에 내보낸다. (journey-map §3막)

import { useEffect, useState } from "react";
import { aiPost } from "@/lib/ai";
import type { ExperienceItem } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { StepProps } from "./types";

const KIND_LABEL = { book: "📖 책", class: "🎨 클래스" } as const;

export function ExperienceStep({ lib, update }: StepProps) {
  const [items, setItems] = useState<ExperienceItem[] | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    aiPost<ExperienceItem[]>("experience", {
      persona: lib.persona,
      tastes: lib.tastes,
    })
      .then((res) => {
        if (cancelled) return;
        setItems(res.data);
        setIsMock(res.mock);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) {
    return <Thinking message="당신다운 경험을 고르고 있어요…" />;
  }

  function confirm() {
    if (selected === null || !items) return;
    update({
      experiences: items.map((item, i) => ({
        kind: item.kind,
        title: item.title,
        reason: item.reason,
        url: item.url,
        ...(i === selected ? { pickedAt: new Date().toISOString() } : {}),
      })),
    });
  }

  return (
    <div className="mt-4">
      <SampleBadge show={isMock} />
      <h2 className="text-2xl font-bold mb-2">🧭 경험하기</h2>
      <p className="text-muted mb-8">
        <strong className="text-foreground">{lib.persona?.concept}</strong>
        인 당신이 자기를 발견할 만한 것들이에요.
        <br />
        지금 가장 끌리는 하나를 골라보세요.
      </p>

      <div className="space-y-3 mb-10">
        {items.map((item, i) => (
          <Card key={i} selected={selected === i} onClick={() => setSelected(i)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-accent mb-1.5">
                  {KIND_LABEL[item.kind]}
                </p>
                <p className="font-bold mb-1.5">{item.title}</p>
                <p className="text-sm text-muted">{item.reason}</p>
              </div>
              <span
                className={`shrink-0 w-5 h-5 rounded-full border ${
                  selected === i ? "bg-accent border-accent" : "border-line"
                }`}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button disabled={selected === null} onClick={confirm}>
          이게 끌려요 →
        </Button>
      </div>
    </div>
  );
}
