// 브라우저용 Supabase 클라이언트 (싱글턴).
// 아키텍처: 모든 데이터 접근은 브라우저에서 RLS로 보호됨 (본인 서재만).
// 매직링크 세션은 URL에서 자동 감지되어 localStorage에 저장된다.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: true, persistSession: true } }
    );
  }
  return client;
}
