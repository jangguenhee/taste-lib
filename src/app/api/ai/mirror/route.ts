import { NextResponse } from "next/server";
import { MIRROR_FIXTURE, type MirrorResult } from "@/lib/fixtures";
import { generateJSON, realAiEnabled, VOICE } from "@/lib/server/claude";

// ② 거울 — "어떻게 알았지?"의 순간. 우선순위 2️⃣에서 실 AI 연동됨.

const SCHEMA = {
  type: "object",
  properties: {
    patterns: {
      type: "array",
      items: { type: "string" },
      description: "답변에서 반복적으로 드러난 결 3가지. 각각 사용자의 실제 문구를 인용해 2~3문장.",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "본인은 당연하게 여기지만 실제로는 드문 숨은 강점 2가지. 각 1~2문장.",
    },
    summary: {
      type: "string",
      description: "이 사람이 어떤 사람인지 따뜻하게 요약하고, 이 결이 페르소나의 뼈대가 될 것임을 알려주는 3~4문장.",
    },
  },
  required: ["patterns", "strengths", "summary"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    answers?: Record<string, string>;
    tastes?: { name: string }[];
  };

  if (realAiEnabled() && body.answers) {
    try {
      const data = await generateJSON<MirrorResult>({
        system: VOICE,
        schema: SCHEMA as unknown as Record<string, unknown>,
        prompt: [
          `한 사람이 자신을 찾기 위한 인터뷰에 답했습니다. 이 사람은 "자기를 잃어버린 것 같다"고 느끼는 사람일 수 있습니다.`,
          ``,
          `## 인터뷰 답변`,
          JSON.stringify(body.answers, null, 2),
          ``,
          `## 서재에 적재한 취향`,
          (body.tastes ?? []).map((t) => t.name).join(", ") || "(없음)",
          ``,
          `당신의 일: 이 사람 본인은 못 보는 것을 거울처럼 비춰주세요.`,
          `- patterns: 여러 답변을 가로질러 반복된 결 3가지. 반드시 실제 답변 문구를 인용.`,
          `- strengths: 본인이 당연하게 여기는 숨은 강점 2가지.`,
          `- summary: "당신의 서가를 비춰보면 ~한 사람이 서 있어요" 톤의 요약.`,
          `읽는 사람이 "어떻게 알았지?"라고 느끼는 것이 목표입니다.`,
          ``,
          `중요: taste_dump 항목은 이 사람이 평소에 모아둔 문장·메모·스크랩 원본입니다.`,
          `이건 답변보다 더 정직한 소스예요 — 무엇을 '모았는지'뿐 아니라 어떤 언어와 온도에 끌리는지가 담겨 있습니다. 적극적으로 인용하고 분석하세요.`,
          `단, 정보가 적으면 적은 대로 깊이 읽되 절대 지어내지 마세요. 근거 없는 단정보다 "이 답 하나에서 이만큼 보여요"가 낫습니다.`,
        ].join("\n"),
      });
      return NextResponse.json({ mock: false, data });
    } catch (err) {
      console.error("[mirror] real AI failed, falling back to fixture:", err);
      // 실패해도 여정이 끊기지 않도록 픽스처로 폴백
    }
  }

  await new Promise((r) => setTimeout(r, 1500));
  return NextResponse.json({ mock: true, data: MIRROR_FIXTURE });
}
