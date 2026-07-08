// 추천 접지(grounding) — "AI가 고르고, 시스템이 검증" (PRD §6.3)
// 2단계: ALADIN_TTB_KEY 있으면 실존 검증(하드) / 없으면 검색 링크(소프트 — 절대 404 없음)

export interface ProposedItem {
  kind: "book" | "class" | "video";
  title: string;
  creator?: string; // 저자·채널명 등
  reason: string;
}

export interface GroundedItem {
  kind: "book" | "class" | "video";
  title: string;
  reason: string;
  url: string;
  verified: boolean; // 하드 접지(실존 확인) 여부
}

function searchUrl(kind: ProposedItem["kind"], q: string): string {
  const enc = encodeURIComponent(q);
  switch (kind) {
    case "book":
      return `https://search.kyobobook.co.kr/search?keyword=${enc}`;
    case "class":
      return `https://class101.net/ko/search?query=${enc}`;
    case "video":
      return `https://www.youtube.com/results?search_query=${enc}`;
  }
}

/** 알라딘 OpenAPI로 책 실존 검증. 키 없거나 실패하면 null. */
async function verifyBookAladin(
  title: string,
  creator?: string
): Promise<{ title: string; url: string } | null> {
  const key = process.env.ALADIN_TTB_KEY;
  if (!key) return null;
  try {
    const q = encodeURIComponent(title);
    const res = await fetch(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${key}&Query=${q}&QueryType=Title&MaxResults=5&SearchTarget=Book&output=js&Version=20131101`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      item?: { title: string; author: string; link: string }[];
    };
    const items = data.item ?? [];
    // 제목 느슨 매칭 (+ 저자명 있으면 가산)
    const norm = (s: string) => s.replace(/\s/g, "").toLowerCase();
    const hit =
      items.find(
        (it) =>
          norm(it.title).includes(norm(title)) &&
          (!creator || norm(it.author).includes(norm(creator)))
      ) ?? items.find((it) => norm(it.title).includes(norm(title)));
    if (!hit) return null;
    const author = hit.author.split("(")[0].trim();
    return { title: `${hit.title.split("-")[0].trim()} — ${author}`, url: hit.link };
  } catch {
    return null;
  }
}

/** 제안 항목 하나를 접지: 실존 검증 시도 → 안 되면 검색 링크 */
export async function groundItem(p: ProposedItem): Promise<GroundedItem> {
  if (p.kind === "book") {
    const verified = await verifyBookAladin(p.title, p.creator);
    if (verified) {
      return { kind: p.kind, title: verified.title, reason: p.reason, url: verified.url, verified: true };
    }
  }
  const q = p.creator ? `${p.title} ${p.creator}` : p.title;
  return {
    kind: p.kind,
    title: p.creator ? `${p.title} — ${p.creator}` : p.title,
    reason: p.reason,
    url: searchUrl(p.kind, q),
    verified: false,
  };
}

export async function groundAll(items: ProposedItem[]): Promise<GroundedItem[]> {
  return Promise.all(items.map(groundItem));
}
