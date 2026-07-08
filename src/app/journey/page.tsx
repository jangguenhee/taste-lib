"use client";

// 여정 컨테이너 — 서재 상태를 들고, 현재 단계 컴포넌트를 렌더할 뿐.
// 저장: localStorage 즉시(원본) + 로그인 시 Supabase 백그라운드 사본 (PRD §7 개정).

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadLibrary,
  saveLibrary,
  emptyLibrary,
  type Library,
} from "@/lib/library";
import { deriveStep, STEP_META } from "@/lib/journey-machine";
import { pushLibrary, pullLibrary } from "@/lib/sync";
import { supabase } from "@/lib/supabase";
import { ActsProgress } from "@/components/ui/ActsProgress";
import { EmailLock } from "@/components/auth/EmailLock";
import { DiscoverStep } from "@/components/journey/DiscoverStep";
import { MirrorStep } from "@/components/journey/MirrorStep";
import { TryOnStep } from "@/components/journey/TryOnStep";
import { DefineStep } from "@/components/journey/DefineStep";
import { ExperienceStep } from "@/components/journey/ExperienceStep";
import { ReflectStep } from "@/components/journey/ReflectStep";
import { CreateStep } from "@/components/journey/CreateStep";
import { DoneStep } from "@/components/journey/DoneStep";

const STEP_COMPONENTS = {
  discover: DiscoverStep,
  mirror: MirrorStep,
  tryon: TryOnStep,
  define: DefineStep,
  experience: ExperienceStep,
  reflect: ReflectStep,
  create: CreateStep,
  done: DoneStep,
} as const;

export default function JourneyPage() {
  const [lib, setLib] = useState<Library | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  // 마운트: 로컬 로드 → 세션 확인 → (로컬이 비었으면) 클라우드 복원
  useEffect(() => {
    const local = loadLibrary();
    setLib(local);

    supabase()
      .auth.getSession()
      .then(async ({ data }) => {
        const has = Boolean(data.session);
        setSignedIn(has);
        if (has) {
          const remote = await pullLibrary();
          const localEmpty = Object.keys(local.answers).length === 0;
          if (remote && localEmpty) {
            saveLibrary(remote);
            setLib(remote); // 새 기기에서 서재 복원
          }
        }
      });

    const { data: sub } = supabase().auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
      if (session) pushLibrary(loadLibrary()); // 로그인 직후 현재 서재 백업
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!lib) return null;

  const step = deriveStep(lib);
  const meta = STEP_META[step];
  const StepComponent = STEP_COMPONENTS[step];

  // 저장의 유일한 통로 — 로컬 즉시 + 클라우드 백그라운드
  function update(patch: Partial<Library>) {
    const next = { ...(lib ?? emptyLibrary()), ...patch };
    saveLibrary(next);
    setLib(next);
    pushLibrary(next); // 로그인 상태일 때만 실제 동작
  }

  // ② 거울을 지난 뒤부터, 로그인 전이면 부드럽게 제안 (건너뛰기 가능)
  const showNudge =
    !signedIn &&
    !nudgeDismissed &&
    step !== "discover" &&
    step !== "mirror" &&
    step !== "done";

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← 취향 서재
          </Link>
          <div className="flex items-center gap-3">
            {signedIn && (
              <Link
                href="/account"
                className="text-xs text-muted hover:text-foreground"
              >
                내 서재 🔐
              </Link>
            )}
            <p className="text-xs text-muted">{meta.act}</p>
          </div>
        </div>

        <ActsProgress current={meta.actNo} />

        {showNudge && (
          <div className="mb-6">
            <EmailLock onSkip={() => setNudgeDismissed(true)} />
          </div>
        )}

        <StepComponent lib={lib} update={update} />
      </div>
    </main>
  );
}
