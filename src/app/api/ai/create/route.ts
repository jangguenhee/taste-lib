import { NextResponse } from "next/server";
import { createFixture, type CreateResult } from "@/lib/fixtures";
import { generateJSON, realAiEnabled, VOICE } from "@/lib/server/claude";

// ⑦ 첫 콘텐츠 — "방금 당신이 한 말, 이미 콘텐츠예요." 북극성의 완성점.
// 원칙: AI가 대신 쓰는 게 아니라, 사용자의 문장을 살려서 다듬는다.

const SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "SNS 게시물 제목. 사용자의 끌림이 담긴, 담백하고 진솔한 한 줄.",
    },
    hook: {
      type: "string",
      description: "첫 3초에 시선을 잡는 문장. 사용자의 원문에서 가장 힘 있는 부분.",
    },
    caption: {
      type: "string",
      description: "게시물 본문 (4~7줄, 줄바꿈 포함). 사용자의 원문 문장을 반드시 그대로 포함하고, 앞뒤로 자연스럽게 감싼다. 페르소나의 말투로.",
    },
    whyMe: {
      type: "string",
      description: "왜 이 콘텐츠가 이 사람다운지, 그리고 방금 창작이 일어났음을 알려주는 1~2문장.",
    },
  },
  required: ["title", "hook", "caption", "whyMe"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    reflection?: string;
    concept?: string;
    pickedTitle?: string;
  };

  if (realAiEnabled() && body.reflection) {
    try {
      const data = await generateJSON<CreateResult>({
        system: VOICE,
        schema: SCHEMA as unknown as Record<string, unknown>,
        prompt: [
          `한 사람이 방금 생애 첫 콘텐츠를 만들기 직전입니다. 소비만 하던 사람이 만드는 사람이 되는 순간이에요.`,
          ``,
          `## 이 사람의 페르소나`,
          body.concept ?? "(미정)",
          ``,
          `## 이 사람이 고른 것`,
          body.pickedTitle ?? "(책 또는 클래스)",
          ``,
          `## 이 사람이 쓴 끌림의 이유 (원문)`,
          `"${body.reflection}"`,
          ``,
          `당신의 일: 이 원문을 SNS에 올릴 수 있는 첫 콘텐츠 카드로 다듬으세요.`,
          `절대 규칙:`,
          `- caption에는 사용자의 원문 문장이 그대로(또는 거의 그대로) 살아 있어야 합니다. 당신의 화려한 문장으로 대체하지 마세요.`,
          `- 과장·클리셰 금지 ("인생책", "강추", "이거 모르면 손해" 금지).`,
          `- 이 사람의 페르소나 말투를 따르되, 원문의 온도를 지키세요.`,
          `- whyMe는 "당신이 쓴 문장을 살렸어요. 끌림을 설명할 수 있다는 것 — 그게 창작의 시작이에요" 같은 톤.`,
        ].join("\n"),
      });
      return NextResponse.json({ mock: false, data });
    } catch (err) {
      console.error("[create] real AI failed, falling back to fixture:", err);
    }
  }

  await new Promise((r) => setTimeout(r, 1500));
  return NextResponse.json({
    mock: true,
    data: createFixture(body.reflection ?? "", body.concept ?? "나"),
  });
}
