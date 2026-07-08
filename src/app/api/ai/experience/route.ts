import { NextResponse } from "next/server";
import { EXPERIENCE_FIXTURE, type ExperienceItem } from "@/lib/fixtures";
import { generateJSON, realAiEnabled, VOICE } from "@/lib/server/claude";
import { groundAll, type ProposedItem } from "@/lib/server/ground";

// ⑤ 경험하기 — 페르소나를 바로 살아보게 하는 "너다운 경험" 추천.
// "AI가 고르고, 시스템이 검증"(PRD §6.3): 제안 → 접지(알라딘 검증 or 검색 링크) → 링크 부착.
// 매체는 책에 한정하지 않는다 — 이 사람에게 맞는 조합 (책·클래스·영상).

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          kind: { type: "string", enum: ["book", "class", "video"] },
          title: { type: "string", description: "정확한 제목 (책이면 실제 출간 도서명)" },
          creator: { type: "string", description: "저자·강사·채널명" },
          reason: {
            type: "string",
            description: "왜 '이 사람다운' 경험인지 — 페르소나·취향을 근거로 1~2문장, 앱 보이스로",
          },
        },
        required: ["kind", "title", "creator", "reason"],
        additionalProperties: false,
      },
      description: "4개. 이 사람에게 맞는 매체 조합 (책 최소 2 + 클래스나 영상 1~2)",
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    persona?: { concept: string; positioning: string };
    tastes?: { name: string }[];
    mirror?: { summary: string };
  };

  if (realAiEnabled() && body.persona) {
    try {
      const proposed = await generateJSON<{ items: ProposedItem[] }>({
        system: VOICE,
        schema: SCHEMA as unknown as Record<string, unknown>,
        prompt: [
          `이 사람의 페르소나: ${body.persona.concept} — ${body.persona.positioning}`,
          body.mirror ? `거울 요약: ${body.mirror.summary}` : "",
          `이미 서재에 있는 취향: ${(body.tastes ?? []).map((t) => t.name).join(", ") || "(없음)"}`,
          ``,
          `당신의 일: 이 사람이 자기를 발견할 "너다운 경험" 4개를 고르세요.`,
          `- 책 최소 2개 + 이 사람에게 맞으면 온라인 클래스나 유튜브 영상·채널 1~2개.`,
          `- 책은 실제로 출간된 한국어 도서만, 제목·저자를 정확히. 확신 없는 책은 고르지 마세요.`,
          `- 이미 서재에 있는 것은 추천하지 마세요 (그건 이미 만났으니까).`,
          `- reason은 "당신 같은 사람은 ~"의 큐레이터 톤으로, 이 사람의 실제 결을 근거로.`,
        ].join("\n"),
      });

      // 접지: 실존 검증(알라딘, 키 있을 때) 또는 검색 링크 (절대 404 없음)
      const grounded = await groundAll(proposed.items);
      const data: ExperienceItem[] = grounded.map((g) => ({
        kind: g.kind,
        title: g.title,
        reason: g.reason,
        url: g.url,
      }));
      return NextResponse.json({
        mock: false,
        verified: grounded.filter((g) => g.verified).length,
        data,
      });
    } catch (err) {
      console.error("[experience] real AI failed, falling back:", err);
    }
  }

  await new Promise((r) => setTimeout(r, 1200));
  return NextResponse.json({ mock: true, data: EXPERIENCE_FIXTURE });
}
