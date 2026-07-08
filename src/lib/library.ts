// 취향 서재 저장소 — local-first (PRD §7).
// 모든 사용자 데이터는 브라우저 localStorage에만 존재한다. 서버 저장 없음.
// v1.5 "서재 루프"에서 적재(append)가 계속되는 구조를 전제로 스키마를 설계.

export interface TasteItem {
  type: "book" | "creator" | "webtoon" | "artist" | "etc";
  name: string;
  note?: string;
  addedAt: string; // ISO
}

export interface Persona {
  concept: string; // 캐릭터 컨셉 한 줄
  positioning: string;
  raw: string; // 정의서 전문 (markdown)
  updatedAt: string; // 살아있는 문서 — 갱신 시각
}

export interface Recommendation {
  kind: "book" | "class" | "video";
  title: string;
  reason: string;
  url?: string; // 제휴 링크
  pickedAt?: string; // 사용자가 고른 시각 (⑥-a 진입점)
}

export interface ContentCard {
  title: string;
  hook: string;
  caption: string;
  whyMe: string; // 왜 이게 너다운지
  createdAt: string;
}

export interface Library {
  version: 1;
  answers: Record<string, string>; // ① 인터뷰 답변
  tastes: TasteItem[]; // ① 취향 적재 (이후 계속 자람)
  mirror?: { patterns: string[]; strengths: string[]; summary: string }; // ②
  tryonChoice?: string; // ③ 입어본 후보 중 선택한 컨셉 id
  persona?: Persona; // ④
  experiences: Recommendation[]; // ⑤
  reflection?: string; // ⑥-a 지금 감상 (끌림의 이유)
  contents: ContentCard[]; // ⑦
}

const KEY = "taste-library.v1";

export function emptyLibrary(): Library {
  return { version: 1, answers: {}, tastes: [], experiences: [], contents: [] };
}

export function loadLibrary(): Library {
  if (typeof window === "undefined") return emptyLibrary();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyLibrary();
    const parsed = JSON.parse(raw) as Library;
    if (parsed.version !== 1) return emptyLibrary(); // 향후 마이그레이션 지점
    return parsed;
  } catch {
    return emptyLibrary();
  }
}

export function saveLibrary(lib: Library): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lib));
}

export function clearLibrary(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

/** 데이터 주권: 서재 전체를 JSON으로 내보내기 */
export function exportLibrary(lib: Library): string {
  return JSON.stringify(lib, null, 2);
}
