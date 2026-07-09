"use client";

// 이메일 매직링크 로그인 — "서재를 잠가두기".
// 비밀번호 없음: 메일로 온 링크 클릭 한 번. (§7 개정: 익명 시작 → 간직할 때 이메일)

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface EmailLockProps {
  title?: string;
  desc?: string;
  /** "이 기기에만 저장" 건너뛰기 허용 여부 */
  onSkip?: () => void;
}

export function EmailLock({
  title = "서재를 잃어버리지 않게 잠가둘까요?",
  desc = "이메일 하나면 돼요. 이름도, 비밀번호도 안 받아요 — 메일로 온 링크를 누르면 어떤 기기에서든 당신의 서재가 열려요.",
  onSkip,
}: EmailLockProps) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"input" | "sending" | "sent" | "error">(
    "input"
  );

  async function sendLink() {
    const addr = email.trim();
    if (!addr.includes("@")) return;
    setPhase("sending");
    const { error } = await supabase().auth.signInWithOtp({
      email: addr,
      options: {
        emailRedirectTo: `${window.location.origin}/journey`,
      },
    });
    setPhase(error ? "error" : "sent");
  }

  if (phase === "sent") {
    return (
      <Card className="border-accent/50 text-center">
        <p className="text-3xl mb-3">📬</p>
        <p className="font-semibold mb-2">메일을 보냈어요</p>
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-foreground">{email.trim()}</strong> 의
          받은편지함을 확인해주세요.
          <br />
          링크를 누르면 이 서재가 당신 것으로 잠깁니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-accent/50">
      <p className="font-semibold mb-1.5">🔐 {title}</p>
      <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendLink();
          }}
          placeholder="이메일 주소"
          className="flex-1 bg-background border border-line rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <Button
          onClick={sendLink}
          disabled={!email.includes("@") || phase === "sending"}
        >
          {phase === "sending" ? "보내는 중…" : "링크 받기"}
        </Button>
      </div>
      {phase === "error" && (
        <p className="text-sm text-red-700 mt-2">
          메일 전송에 문제가 있었어요. 잠시 후 다시 시도해주세요.
        </p>
      )}
      {onSkip && (
        <button
          onClick={onSkip}
          className="text-xs text-muted hover:text-foreground mt-3 underline underline-offset-2"
        >
          괜찮아요, 이 기기에만 저장할게요
        </button>
      )}
    </Card>
  );
}
