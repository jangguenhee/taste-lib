// 목업 모드 표시 — 실제 분석이 아닌 샘플 결과임을 정직하게 알린다.

export function SampleBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-block text-[11px] text-muted border border-line rounded-full px-2.5 py-0.5 mb-3">
      미리보기 샘플 — 실제 분석은 준비 중이에요
    </span>
  );
}
