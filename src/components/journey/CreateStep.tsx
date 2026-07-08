"use client";

// ⑦ 첫 콘텐츠 — 끌림이 첫 창작물이 되는 순간. 북극성 지표(창작자 전환)의 완성점.
// "방금 당신이 한 말, 이미 콘텐츠예요."

import { useEffect, useState } from "react";
import { aiPost } from "@/lib/ai";
import type { CreateResult } from "@/lib/fixtures";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Thinking } from "@/components/ui/Thinking";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { EmailLock } from "@/components/auth/EmailLock";
import type { StepProps } from "./types";

export function CreateStep({ lib, update }: StepProps) {
  const [result, setResult] = useState<CreateResult | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [showLock, setShowLock] = useState(false);

  function keep() {
    if (!result) return;
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
    });
  }

  // "간직하기" = 적재의 순간 — 로그인 안 되어 있으면 여기서 제안 (건너뛰기 가능)
  async function onKeepClick() {
    const { data } = await supabase().auth.getSession();
    if (data.session) {
      keep();
    } else {
      setShowLock(true);
    }
  }

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

      {showLock ? (
        <div className="mb-4">
          <EmailLock
            title="이 서재에 적재하려면, 이메일 하나면 돼요"
            desc="당신의 첫 콘텐츠와 페르소나가 어떤 기기에서든 열리게 잠가둘게요. 메일의 링크를 누른 뒤 돌아오면 이어집니다."
            onSkip={keep}
          />
        </div>
      ) : (
        <div className="text-center">
          <Button onClick={onKeepClick}>서재에 간직할게요 →</Button>
        </div>
      )}
    </div>
  );
}
