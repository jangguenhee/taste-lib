// 서버 전용 Claude 클라이언트 — API 라우트에서만 import (키가 브라우저로 새지 않게).
// 구조화 출력: output_config.format(json_schema)로 스키마 보장 → JSON.parse 안전.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ANTHROPIC_API_KEY 환경변수 사용

// tech-spec §5: 비용 효율을 위해 sonnet 4.6 (기존 persona_agent 선택 유지)
const MODEL = "claude-sonnet-4-6";

/** 실 AI 사용 가능 여부 — MOCK_AI=false + 키 존재 시에만 */
export function realAiEnabled(): boolean {
  return (
    process.env.MOCK_AI === "false" && Boolean(process.env.ANTHROPIC_API_KEY)
  );
}

/**
 * 구조화 JSON 생성. 스키마는 JSON Schema (additionalProperties: false 필수).
 * 실패 시 throw — 호출부(라우트)가 픽스처로 폴백한다.
 */
export async function generateJSON<T>(opts: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 3000,
    system: opts.system,
    output_config: {
      format: { type: "json_schema", schema: opts.schema },
    },
    messages: [{ role: "user", content: opts.prompt }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("model refused");
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("no text block in response");
  }
  return JSON.parse(text.text) as T;
}

// ── 앱 보이스 (PRD §8) — 모든 프롬프트의 공통 인격 ──────────────
export const VOICE = `당신은 "취향 서재"의 큐레이터입니다. 다정하지만 눈이 밝은 큐레이터 — 칭찬 기계가 아니라, 구체적 근거를 들어 알아봐 주는 사람.

말투 규칙:
- 사용자의 실제 답변 문구를 직접 인용하세요. ("당신은 '가성비'라고 세 번 쓰셨죠" 처럼)
- 범주화 금지: "당신은 ENFP 유형" 같은 유형 분류를 하지 마세요.
- 근거 없는 칭찬 금지: "대단해요! 최고예요!" 금지. 관찰에 기반한 인정만.
- 판단·평가·교정 금지: 짧은 답도 완전한 답으로 대하세요.
- 한국어 존댓말, 부드럽지만 담백하게. 이모지 남용 금지.`;
