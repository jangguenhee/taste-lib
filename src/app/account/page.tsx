"use client";

// 내 서재 (계정 관리) — 이메일 확인 · 로그아웃 · 서재 완전 삭제 (§7 데이터 주권)

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { clearLibrary, loadLibrary } from "@/lib/library";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ tastes: 0, contents: 0 });
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase()
      .auth.getSession()
      .then(({ data }) => setEmail(data.session?.user.email ?? null));
    const lib = loadLibrary();
    setStats({ tastes: lib.tastes.length, contents: lib.contents.length });
  }, []);

  async function logout() {
    await supabase().auth.signOut();
    window.location.href = "/";
  }

  async function deleteEverything() {
    setBusy(true);
    try {
      const { data } = await supabase().auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        await fetch("/api/account/delete", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await supabase().auth.signOut();
    } finally {
      clearLibrary();
      window.location.href = "/";
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <Link href="/journey" className="text-sm text-muted hover:text-foreground">
          ← 여정으로
        </Link>

        <h1 className="text-2xl font-bold mt-6 mb-8">🔐 내 서재</h1>

        <Card className="mb-4">
          <p className="text-xs text-accent mb-1.5">잠긴 이메일</p>
          <p className="font-medium">{email ?? "로그인되어 있지 않아요"}</p>
        </Card>

        <Card className="mb-8">
          <p className="text-xs text-accent mb-1.5">이 기기의 서재</p>
          <p className="text-sm text-foreground/80">
            장서 {stats.tastes}권 · 콘텐츠 {stats.contents}편
          </p>
        </Card>

        {email && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={logout}>
              로그아웃 (서재는 남아 있어요)
            </Button>

            <Card className="border-red-900/50">
              <p className="font-semibold mb-1.5 text-red-300">
                서재 완전히 지우기
              </p>
              <p className="text-sm text-muted mb-4">
                계정과 서재의 모든 것이 흔적 없이 삭제돼요. 되돌릴 수 없어요 —
                당신의 데이터는 언제나 당신 것입니다.
              </p>
              {confirming ? (
                <div className="flex gap-3 items-center">
                  <Button onClick={deleteEverything} disabled={busy}>
                    {busy ? "지우는 중…" : "네, 전부 지워주세요"}
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirming(false)}>
                    아니요
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={() => setConfirming(true)}>
                  지우기…
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
