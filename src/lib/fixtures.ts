// 목업 픽스처 — MOCK_AI 모드에서 API 라우트가 반환하는 샘플 결과.
// 실연동(우선순위 2️⃣: ②거울·⑦창작부터) 전까지 여정 전체를 관통 가능하게 한다.
// UI에는 mock: true 플래그로 "미리보기 샘플" 배지가 표시된다.

export interface MirrorResult {
  patterns: string[];
  strengths: string[];
  summary: string;
}

export interface TryonCandidate {
  id: string;
  name: string;
  concept: string;
  desc: string;
}

export interface TryonReference {
  name: string;
  platform: string;
  why: string;
}

export interface TryonResult {
  candidates: TryonCandidate[];
  references: TryonReference[];
}

export interface DefineResult {
  concept: string;
  positioning: string;
  raw: string;
}

export interface ExperienceItem {
  kind: "book" | "class" | "video";
  title: string;
  reason: string;
  url: string;
}

export interface CreateResult {
  title: string;
  hook: string;
  caption: string;
  whyMe: string;
}

export const MIRROR_FIXTURE: MirrorResult = {
  patterns: [
    "당신은 '진짜'와 '척'을 구분하는 표현을 반복해서 썼어요. 진정성이 당신의 판단 기준이에요.",
    "여러 답변에서 '기록'과 '저장'이 등장해요. 당신은 흘러가는 것을 붙잡아두는 사람이에요.",
    "거창한 목표보다 '꾸준히', '작게'라는 말을 골랐어요. 당신의 속도는 폭발이 아니라 축적이에요.",
  ],
  strengths: [
    "당연하게 여기고 있지만 — 좋아하는 것의 '이유'를 설명할 수 있다는 건 드문 능력이에요.",
    "싫어하는 것이 명확해요. 그건 이미 방향이 절반쯤 정해져 있다는 뜻이에요.",
  ],
  summary:
    "당신의 서가를 비춰보면, '조용히 오래 좋아하는 사람'이 서 있어요. 트렌드를 쫓기보다 자기 속도로 깊어지는 쪽. 이 결이 당신 페르소나의 뼈대가 될 거예요.",
};

export const TRYON_FIXTURE: TryonResult = {
  candidates: [
    {
      id: "curator",
      name: "조용한 큐레이터",
      concept: "좋아하는 것들을 천천히 수집하고, 왜 좋은지 담담하게 건네는 사람",
      desc: "화려한 리뷰가 아니라 '이게 왜 내 마음에 남았는지'를 말해요. 신뢰로 쌓이는 타입.",
    },
    {
      id: "recorder",
      name: "다정한 기록자",
      concept: "일상의 스치는 순간을 붙잡아 문장과 장면으로 남기는 사람",
      desc: "대단한 사건이 아니라 사소한 발견을 다뤄요. '나도 저런 적 있어'를 부르는 타입.",
    },
    {
      id: "explorer",
      name: "느린 탐험가",
      concept: "한 가지 주제를 오래 파고들며 그 여정 자체를 보여주는 사람",
      desc: "결과보다 과정을 공유해요. 함께 성장하는 느낌을 주는 타입.",
    },
  ],
  references: [
    { name: "(샘플) 기록형 에세이 계정", platform: "인스타그램", why: "사소한 일상을 문장으로 승화 — '다정한 기록자'의 좋은 예" },
    { name: "(샘플) 북큐레이션 계정", platform: "인스타그램", why: "책 소개가 아닌 '왜 지금 이 책인지'로 차별화" },
    { name: "(샘플) 브이로그 채널", platform: "유튜브", why: "화려함 없이 톤 하나로 구독자를 모으는 사례" },
    { name: "(샘플) 취향 아카이브 계정", platform: "틱톡", why: "수집한 것들을 짧은 리듬으로 보여주는 형식" },
    { name: "(샘플) 문장 수집 계정", platform: "스레드", why: "저장하고 싶은 문장 하나로 승부하는 미니멀 전략" },
  ],
};

export function defineFixture(choice: string): DefineResult {
  const chosen =
    TRYON_FIXTURE.candidates.find((c) => c.id === choice) ??
    TRYON_FIXTURE.candidates[0];
  return {
    concept: chosen.name,
    positioning: `${chosen.concept} — 당신의 속도로.`,
    raw: [
      `## 캐릭터 컨셉`,
      `**${chosen.name}** — ${chosen.concept}`,
      ``,
      `## 포지셔닝 한 줄`,
      `빠르게 소비되는 피드 속에서, 천천히 신뢰로 쌓이는 계정.`,
      ``,
      `## 콘텐츠 기둥`,
      `1. **오늘의 수집** — 마음에 남은 것 하나와 그 이유`,
      `2. **다시 꺼낸 것** — 오래 좋아해온 것을 지금의 시선으로`,
      `3. **서가 공개** — 내 취향의 지도를 조금씩 보여주기`,
      ``,
      `## 말투 가이드`,
      `- 이렇게: "이게 왜 좋았냐면요," / "별거 아닌데, 자꾸 생각나요."`,
      `- 이렇게는 말고: "인생템 발견!!" / "이거 모르면 손해"`,
      ``,
      `## 차별화 포인트`,
      `취향의 '목록'이 아니라 '이유'를 말할 수 있는 사람. 그게 당신이 이미 가진 무기예요.`,
    ].join("\n"),
  };
}

export const EXPERIENCE_FIXTURE: ExperienceItem[] = [
  {
    kind: "book",
    title: "쓰기의 말들 — 은유",
    reason: "기록하는 사람으로 살고 싶은 당신에게, '쓰는 삶'의 문턱을 낮춰주는 책이에요.",
    url: "https://search.kyobobook.co.kr/search?keyword=%EC%93%B0%EA%B8%B0%EC%9D%98%20%EB%A7%90%EB%93%A4",
  },
  {
    kind: "book",
    title: "기록하기로 했습니다 — 김신지",
    reason: "당신의 저장 폴더가 왜 소중한지, 이 책이 대신 말해줄 거예요.",
    url: "https://search.kyobobook.co.kr/search?keyword=%EA%B8%B0%EB%A1%9D%ED%95%98%EA%B8%B0%EB%A1%9C%20%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4",
  },
  {
    kind: "book",
    title: "아무튼, 메모 — 정혜윤",
    reason: "조용히 수집하는 사람의 기쁨을 아는 작가의 이야기예요.",
    url: "https://search.kyobobook.co.kr/search?keyword=%EC%95%84%EB%AC%B4%ED%8A%BC%20%EB%A9%94%EB%AA%A8",
  },
  {
    kind: "class",
    title: "(샘플) 나만의 기록법 온라인 클래스",
    reason: "쌓아둔 취향을 콘텐츠로 바꾸는 손을 만들어줘요.",
    url: "https://class101.net/search?query=%EA%B8%B0%EB%A1%9D",
  },
];

export function createFixture(reflection: string, concept: string): CreateResult {
  const quote = reflection.trim().slice(0, 80);
  return {
    title: "내가 이 책에 끌린 이유를 적어보았다",
    hook: `"${quote}${reflection.length > 80 ? "…" : ""}"`,
    caption: [
      `아직 읽기 전인데, 벌써 마음이 기울었다.`,
      ``,
      `"${quote}${reflection.length > 80 ? "…" : ""}"`,
      ``,
      `— 라고 적어놓고 보니, 이건 책 이야기가 아니라 내 이야기였다.`,
      `${concept}의 서재, 첫 페이지.`,
    ].join("\n"),
    whyMe: "당신이 방금 쓴 문장을 그대로 살렸어요. 끌림을 설명할 수 있다는 것 — 그게 창작의 시작이에요.",
  };
}
