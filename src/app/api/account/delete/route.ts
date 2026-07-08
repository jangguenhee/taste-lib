import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 계정 완전 삭제 — auth 사용자 삭제는 service 키로만 가능하므로 서버에서 처리.
// 서재 데이터(libraries)는 on delete cascade로 함께 삭제됨.

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // 토큰으로 본인 확인 — 남의 계정은 지울 수 없음
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
