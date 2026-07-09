import Link from "next/link";
import { FloatingGyeol } from "@/components/ui/FloatingGyeol";

const ACTS = [
  { no: "1막", title: "나를 마주하기", desc: "질문과 취향으로 원재료를 캐냅니다" },
  { no: "2막", title: "되고 싶은 나", desc: "페르소나를 입어보고, 하나로 정합니다" },
  { no: "3막", title: "살아내기", desc: "당신다운 책과 경험을 만납니다" },
  { no: "4막", title: "표현하기", desc: "끌림이 첫 창작물이 됩니다" },
];

const TRUST = [
  { icon: "🔓", text: "로그인 없이 시작해요 — 간직하고 싶어질 때만 이메일 하나" },
  { icon: "📦", text: "이름도 비밀번호도 안 받아요. 서재는 익명으로 안전하게" },
  { icon: "🤝", text: "지우고 싶으면 언제든 흔적 없이 — 당신의 데이터는 당신 것" },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-6 py-16 sm:py-24 relative">
      <FloatingGyeol />
      <div className="w-full max-w-2xl relative">
        {/* 브랜드 */}
        <p className="text-lg font-bold tracking-[0.3em] mb-1.5">결·곁·겹</p>
        <p className="text-sm text-accent tracking-wide mb-8">
          너의 결, 너의 곁, 너의 겹
        </p>

        {/* 히어로 */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-snug mb-5">
          나를 잃어버린 것 같은 날,
          <br />
          <span className="text-accent">취향은 아직 나를 기억하고 있어요.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed mb-10">
          좋아하는 것들을 서재에 적재해 보세요. 그 안에서 당신의 페르소나가
          모습을 드러내고, 오늘 첫 창작물까지 손에 쥐게 됩니다.
          <br />
          소비하던 사람에서, 만드는 사람으로 — 10분이면 충분해요.
        </p>

        {/* CTA */}
        <Link
          href="/journey"
          className="inline-block bg-accent text-background font-semibold rounded-xl px-8 py-4 text-lg hover:opacity-90 transition-opacity"
        >
          서재 열기 →
        </Link>

        {/* 여정 미리보기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-14">
          {ACTS.map((act) => (
            <div
              key={act.no}
              className="bg-card border border-line rounded-xl p-5"
            >
              <p className="text-xs text-accent mb-1">{act.no}</p>
              <p className="font-semibold mb-1">{act.title}</p>
              <p className="text-sm text-muted">{act.desc}</p>
            </div>
          ))}
        </div>

        {/* 신뢰 고지 — PRD §7 */}
        <div className="mt-12 border-t border-line pt-8 space-y-3">
          {TRUST.map((t) => (
            <p key={t.text} className="text-sm text-muted">
              <span className="mr-2">{t.icon}</span>
              {t.text}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
