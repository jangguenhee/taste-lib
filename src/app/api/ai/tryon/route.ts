import { NextResponse } from "next/server";
import { TRYON_FIXTURE, type TryonResult } from "@/lib/fixtures";
import { generateJSON, realAiEnabled, VOICE } from "@/lib/server/claude";

// ③ 입어보기 — 거울에서 발견한 결로 페르소나 후보 3벌을 짓는다.
// 자기를 잃은 사람은 무에서 정의하지 못한다 — 선택지가 거울이 된다.

const SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "영문 슬러그 (예: quiet-curator)" },
          name: { type: "string", description: "페르소나 이름. 예: '조용한 큐레이터'" },
          concept: { type: "string", description: "이 사람이 어떤 사람인지 한 문장" },
          desc: { type: "string", description: "이 옷을 입으면 어떤 콘텐츠를 하게 되는지 1~2문장" },
        },
        required: ["id", "name", "concept", "desc"],
        additionalProperties: false,
      },
      description: "서로 확실히 다른 결의 페르소나 후보 3개",
    },
    references: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          platform: { type: "string" },
          why: { type: "string", description: "이 결과 어떻게 닮았고 뭘 참고할지 한 문장" },
        },
        required: ["name", "platform", "why"],
        additionalProperties: false,
      },
      description: "이 결에서 활동 중인 참고 인물·계정 3~5개",
    },
  },
  required: ["candidates", "references"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    mirror?: { patterns: string[]; strengths: string[]; summary: string };
    tastes?: { name: string }[];
    answers?: Record<string, string>;
  };

  if (realAiEnabled() && body.mirror) {
    try {
      const data = await generateJSON<TryonResult>({
        system: VOICE,
        schema: SCHEMA as unknown as Record<string, unknown>,
        maxTokens: 3500,
        prompt: [
          `한 사람의 거울 분석 결과입니다:`,
          JSON.stringify(body.mirror, null, 2),
          ``,
          `이 사람의 취향: ${(body.tastes ?? []).map((t) => t.name).join(", ") || "(없음)"}`,
          body.answers ? `원본 답변 일부: ${JSON.stringify(body.answers)}` : "",
          ``,
          `당신의 일: 이 사람이 "입어볼 수 있는" 페르소나 후보 3벌을 지으세요.`,
          `- 세 후보는 서로 확실히 다른 결이어야 해요 (셋 다 비슷하면 선택이 무의미).`,
          `- 각각 거울에서 발견된 실제 결에 뿌리를 둬야 해요. 근거 없는 옷은 금지.`,
          `- name은 한국어로 감각 있게 (예: "조용한 큐레이터", "다정한 기록자").`,
          ``,
          `references 규칙 (중요 — 정직함이 신뢰):`,
          `- 실존이 확실한, 대중적으로 잘 알려진 크리에이터·작가·채널만 이름을 쓰세요.`,
          `- 확신이 없으면 이름 대신 찾는 법을 쓰세요. 예: name="'북튜버 에세이 낭독'으로 검색해보세요", platform="유튜브".`,
          `- 지어낸 계정명은 절대 금지.`,
        ].join("\n"),
      });
      return NextResponse.json({ mock: false, data });
    } catch (err) {
      console.error("[tryon] real AI failed, falling back:", err);
    }
  }

  await new Promise((r) => setTimeout(r, 1200));
  return NextResponse.json({ mock: true, data: TRYON_FIXTURE });
}
