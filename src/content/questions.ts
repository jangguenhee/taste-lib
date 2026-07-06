// ① 발굴 단계 문항.
// 핵심 10문항은 프로토타입(persona_agent/questions.py)에서 검증된 그대로 이식.
// 취향 적재 문항(taste_*)은 PRD v2.1 "취향 서재" 모델에 따라 신규 추가.

export interface Question {
  id: string;
  question: string;
  hint: string;
  emoji: string;
  /** 취향 서재에 적재되는 문항 여부 */
  taste?: boolean;
}

export const INTERVIEW_QUESTIONS: Question[] = [
  {
    id: "category",
    question: "어떤 분야의 SNS 콘텐츠를 만들고 싶으신가요?",
    hint: "예: 패션, 뷰티, 음식/맛집, 여행, 운동/헬스, 재테크, 육아, 게임, 인테리어 등",
    emoji: "🎯",
  },
  {
    id: "platforms",
    question: "주로 활동할 플랫폼은 어디인가요?",
    hint: "예: 인스타그램 릴스, 틱톡, 유튜브 쇼츠, 유튜브 롱폼, 블로그 (복수 입력 가능)",
    emoji: "📱",
  },
  {
    id: "target",
    question: "내 콘텐츠를 봐줬으면 하는 사람은 어떤 사람인가요?",
    hint: "나이대, 성별, 상황, 고민 등을 자유롭게. 예: '돈은 없지만 예쁘게 입고 싶은 20대 직장인'",
    emoji: "👥",
  },
  {
    id: "strength",
    question: "주변에서 '이건 네가 잘 알더라'고 듣는 분야가 있나요?",
    hint: "일상적인 것도 OK. '쇼핑을 잘 한다', '맛집을 잘 찾는다', '다이어트를 성공했다' 등",
    emoji: "💪",
  },
  {
    id: "passion",
    question: "돈을 못 받아도 계속 만들 수 있을 것 같은 콘텐츠가 있다면?",
    hint: "진짜 좋아하는 것 vs 잘할 것 같아서 하려는 것 — 이 둘이 겹치는 지점을 찾는 질문입니다",
    emoji: "❤️",
  },
  {
    id: "references",
    question: "자주 보거나 닮고 싶은 크리에이터나 계정이 있나요?",
    hint: "국내외 상관없이. 계정명을 몰라도 '그 분위기'로 설명해도 됩니다",
    emoji: "⭐",
  },
  {
    id: "anti_persona",
    question: "절대 되고 싶지 않은 크리에이터 유형이 있나요?",
    hint: "싫어하는 스타일을 명확히 하면 내 방향이 더 선명해집니다. 예: '광고 티 너무 나는 계정', '너무 완벽한 척하는 계정'",
    emoji: "🚫",
  },
  {
    id: "tone",
    question: "팔로워와 어떤 말투, 어떤 분위기로 소통하고 싶으신가요?",
    hint: "예: 친한 언니처럼 솔직하게, 전문가답게 신뢰감 있게, 유머로 가볍게, 감성적으로 공감하며",
    emoji: "💬",
  },
  {
    id: "differentiation",
    question: "나만이 가진 특이한 경험, 관점, 또는 상황이 있나요?",
    hint: "없어도 괜찮습니다. 예: '직장인이면서 살 30kg 뺐다', '해외에서 살다 왔다', '가성비만 10년째 파고 있다'",
    emoji: "✨",
  },
  {
    id: "goal",
    question: "6개월~1년 후 내 채널이 어떤 모습이면 성공했다고 느낄 것 같나요?",
    hint: "팔로워 수, 월 수익, 브랜드 협찬, 나만의 커뮤니티 — 어떤 기준이든 솔직하게",
    emoji: "🏆",
  },
  // ── 취향 서재: 첫 적재 (신규) ──────────────────────────────
  {
    id: "taste_works",
    question: "요즘 당신을 사로잡은 작품이 있나요? 책, 웹툰, 영화, 음악, 그림 — 무엇이든요.",
    hint: "제목이나 작가 이름만 적어도 충분해요. 여러 개면 더 좋고요. 이것들이 당신 서재의 첫 장서가 됩니다",
    emoji: "📚",
    taste: true,
  },
  {
    id: "taste_saved",
    question: "휴대폰에 저장하거나 캡처해둔 것들은 주로 어떤 것들인가요?",
    hint: "저장 폴더는 거짓말을 안 해요. 옷, 공간, 문장, 밈, 레시피 — 떠오르는 대로",
    emoji: "📌",
    taste: true,
  },
];
