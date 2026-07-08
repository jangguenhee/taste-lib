// 서재 동기화 — "로컬 우선 + 로그인 후 클라우드 사본" (PRD §7 개정판).
// 쓰기: localStorage 즉시 → 로그인 상태면 Supabase에 upsert (백그라운드)
// 복귀: 로컬이 비어 있고 클라우드에 서재가 있으면 복원

import { supabase } from "./supabase";
import type { Library } from "./library";

/** 로그인 상태면 서재를 클라우드에 저장. 실패해도 조용히 넘어감 (로컬이 원본). */
export async function pushLibrary(lib: Library): Promise<void> {
  try {
    const { data: sess } = await supabase().auth.getSession();
    const user = sess.session?.user;
    if (!user) return;
    await supabase()
      .from("libraries")
      .upsert({
        user_id: user.id,
        data: lib,
        updated_at: new Date().toISOString(),
      });
  } catch {
    // 네트워크 실패 등 — 로컬이 항상 원본이므로 무시
  }
}

/** 클라우드에 저장된 서재 가져오기 (없으면 null) */
export async function pullLibrary(): Promise<Library | null> {
  try {
    const { data: sess } = await supabase().auth.getSession();
    const user = sess.session?.user;
    if (!user) return null;
    const { data } = await supabase()
      .from("libraries")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();
    return (data?.data as Library) ?? null;
  } catch {
    return null;
  }
}

/** 클라우드 서재 삭제 (데이터 주권 — §7) */
export async function deleteCloudLibrary(): Promise<void> {
  const { data: sess } = await supabase().auth.getSession();
  const user = sess.session?.user;
  if (!user) return;
  await supabase().from("libraries").delete().eq("user_id", user.id);
}
