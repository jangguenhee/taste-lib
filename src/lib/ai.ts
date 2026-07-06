// AI 클라이언트 — 여정 UI에서 서버 라우트를 호출하는 유일한 통로.
// 서버가 MOCK_AI 모드면 { mock: true } 와 함께 픽스처가 온다.

export interface AiResponse<T> {
  mock: boolean;
  data: T;
}

export async function aiPost<T>(
  step: "mirror" | "tryon" | "define" | "experience" | "create",
  payload: unknown
): Promise<AiResponse<T>> {
  const res = await fetch(`/api/ai/${step}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  if (!res.ok) {
    throw new Error(`AI 호출 실패 (${step}): ${res.status}`);
  }
  return res.json();
}
