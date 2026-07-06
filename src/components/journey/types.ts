import type { Library } from "@/lib/library";

// 모든 여정 단계 컴포넌트가 공유하는 계약:
// 서재(lib)를 읽고, 결과를 update(patch)로 적재하면 다음 단계가 자동으로 열린다.
export interface StepProps {
  lib: Library;
  update: (patch: Partial<Library>) => void;
}
