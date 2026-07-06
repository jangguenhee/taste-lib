"use client";

// ⑥-a 지금 감상 — 방금의 "끌림"을 반응으로 바꾼다. 창작의 문턱 제거.
// 기대와 끌림도 훌륭한 감상이다 — 시간 공백 없이 소비→창작을 잇는 다리. (PRD §6.1)

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StepProps } from "./types";

export function ReflectStep({ lib, update }: StepProps) {
  const [input, setInput] = useState("");
  const picked = lib.experiences.find((e) => e.pickedAt);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">💭 지금 감상</h2>
      <p className="text-muted mb-8">
        아직 만나기 전인데도, 마음이 먼저 움직였잖아요. 그 순간을 붙잡아볼게요.
      </p>

      <Card className="mb-6">
        <p className="text-xs text-accent mb-1.5">당신이 고른 것</p>
        <p className="font-bold">{picked?.title}</p>
      </Card>

      <div className="bg-card border border-line rounded-2xl rounded-tl-sm p-6 mb-4">
        <p className="text-lg font-semibold leading-relaxed mb-2">
          이것의 <span className="text-accent">뭐가</span> 당신을 끌었어요?
        </p>
        <p className="text-sm text-muted">
          💡 한 문장이어도 좋아요. &ldquo;그냥 제목이 나 같아서&rdquo; — 그것도
          완전한 답이에요.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="솔직하게, 당신의 말로…"
        rows={4}
        className="w-full bg-card border border-line rounded-xl p-4 text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
      />
      <div className="flex justify-end mt-3">
        <Button
          disabled={!input.trim()}
          onClick={() => update({ reflection: input.trim() })}
        >
          이렇게 끌렸어요 →
        </Button>
      </div>
    </div>
  );
}
