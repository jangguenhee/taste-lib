// 여정 상태머신 — 단계는 별도 저장하지 않고 서재(Library)의 데이터로부터 파생한다.
// 각 단계가 자기 결과를 서재에 적재하면 다음 단계가 자동으로 열린다.
// (source of truth가 하나 → 새로고침·중단에도 항상 올바른 위치로 복귀)

import type { Library } from "./library";
import { INTERVIEW_QUESTIONS } from "@/content/questions";

export type StepId =
  | "discover" // ① 발굴
  | "mirror" // ② 거울
  | "tryon" // ③ 입어보기
  | "define" // ④ 정의
  | "experience" // ⑤ 경험하기
  | "reflect" // ⑥-a 지금 감상
  | "create" // ⑦ 첫 콘텐츠
  | "done";

export interface StepMeta {
  actNo: 1 | 2 | 3 | 4;
  act: string;
  title: string;
}

export const STEP_META: Record<StepId, StepMeta> = {
  discover: { actNo: 1, act: "1막 · 나를 마주하기", title: "발굴" },
  mirror: { actNo: 1, act: "1막 · 나를 마주하기", title: "거울" },
  tryon: { actNo: 2, act: "2막 · 되고 싶은 나", title: "입어보기" },
  define: { actNo: 2, act: "2막 · 되고 싶은 나", title: "정의" },
  experience: { actNo: 3, act: "3막 · 살아내기", title: "경험하기" },
  reflect: { actNo: 4, act: "4막 · 표현하기", title: "지금 감상" },
  create: { actNo: 4, act: "4막 · 표현하기", title: "첫 콘텐츠" },
  done: { actNo: 4, act: "여정 완료", title: "서재" },
};

export function deriveStep(lib: Library): StepId {
  const answered = INTERVIEW_QUESTIONS.filter((q) => lib.answers[q.id]).length;
  if (answered < INTERVIEW_QUESTIONS.length) return "discover";
  if (!lib.mirror) return "mirror";
  if (!lib.tryonChoice) return "tryon";
  if (!lib.persona) return "define";
  if (!lib.experiences.some((e) => e.pickedAt)) return "experience";
  if (!lib.reflection) return "reflect";
  if (lib.contents.length === 0) return "create";
  return "done";
}
