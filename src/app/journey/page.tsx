"use client";

// 여정 컨테이너 — 서재 상태를 들고, 현재 단계 컴포넌트를 렌더할 뿐.
// 단계 전환 로직은 journey-machine(deriveStep), 화면은 components/journey/*.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadLibrary,
  saveLibrary,
  emptyLibrary,
  type Library,
} from "@/lib/library";
import { deriveStep, STEP_META } from "@/lib/journey-machine";
import { ActsProgress } from "@/components/ui/ActsProgress";
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

  // localStorage는 클라이언트에만 있으므로 마운트 후 로드
  useEffect(() => {
    setLib(loadLibrary());
  }, []);

  if (!lib) return null;

  const step = deriveStep(lib);
  const meta = STEP_META[step];
  const StepComponent = STEP_COMPONENTS[step];

  // 각 단계가 결과를 서재에 적재하는 유일한 통로 — 저장과 화면 갱신을 함께
  function update(patch: Partial<Library>) {
    const next = { ...(lib ?? emptyLibrary()), ...patch };
    saveLibrary(next);
    setLib(next);
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← 취향 서재
          </Link>
          <p className="text-xs text-muted">{meta.act}</p>
        </div>

        <ActsProgress current={meta.actNo} />

        <StepComponent lib={lib} update={update} />
      </div>
    </main>
  );
}
