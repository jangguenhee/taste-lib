import { NextResponse } from "next/server";
import { defineFixture, type DefineResult } from "@/lib/fixtures";
import { generateJSON, realAiEnabled, VOICE } from "@/lib/server/claude";

// ④ 정의 — 입어보고 고른 옷을 "나의 페르소나 정의서"로 완성.
// 이 문서는 스냅샷이 아니라 살아있는 문서 — 서재가 자라면 함께 자란다.

const SCHEMA = {
  type: "object",
  properties: {
    concept: { type: "string", description: "캐릭터 컨셉 이름 (선택한 페르소나 이름 유지·발전)" },
    positioning: { type: "string", description: "포지셔닝 한 줄" },
    raw: {
      type: "string",
      description: [
        "정의서 전문 (마크다운). 반드시 이 섹션 구조로:",
        "## 캐릭터 컨셉 / ## 포지셔닝 한 줄 / ## 콘텐츠 기둥 (3가지, 각각 예시 제목 포함) /",
        "## 말투 가이드 (이렇게 말한다·이렇게는 말고, 각 예문 2개 — 본인 답변의 실제 말투 반영) /",
        "## 차별화 포인트 (거울에서 발견한 숨은 강점 기반) / ## 피해야 할 것 (안티 페르소나 기반)",
      ].join(" "),
    },
  },
  required: ["concept", "positioning", "raw"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    choice?: string;
    mirror?: { patterns: string[]; strengths: string[]; summary: string };
    answers?: Record<string, string>;
  };

  if (realAiEnabled() && body.choice && body.mirror) {
    try {
      const data = await generateJSON<DefineResult>({
        system: VOICE,
        schema: SCHEMA as unknown as Record<string, unknown>,
        maxTokens: 3500,
        prompt: [
          `이 사람이 입어보고 "이건 나 같다"고 고른 페르소나:`,
          `"${body.choice}"`,
          ``,
          `거울 분석 (이 사람의 실제 결):`,
          JSON.stringify(body.mirror, null, 2),
          ``,
          `원본 답변:`,
          JSON.stringify(body.answers ?? {}, null, 2),
          ``,
          `당신의 일: 이 선택을 "나의 페르소나 정의서"로 완성하세요.`,
          `- 말투 가이드의 예문은 이 사람이 실제로 쓴 문장의 온도를 따라야 해요 (답변에서 말투를 관찰).`,
          `- 콘텐츠 기둥의 예시 제목은 이 사람이 내일 당장 만들 수 있을 만큼 구체적으로.`,
          `- 피해야 할 것은 anti_persona 답변에 뿌리를 두고.`,
          `- 과장 금지. 이 사람이 읽고 "이거 나잖아"라고 느끼는 게 목표.`,
        ].join("\n"),
      });
      return NextResponse.json({ mock: false, data });
    } catch (err) {
      console.error("[define] real AI failed, falling back:", err);
    }
  }

  await new Promise((r) => setTimeout(r, 1200));
  return NextResponse.json({
    mock: true,
    data: defineFixture(body.choice ?? ""),
  });
}
