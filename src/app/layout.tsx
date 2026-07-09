import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 제목·질문 = 명조 (문학적 온도) / 본문 = 고딕 (읽기 편함)
const display = Noto_Serif_KR({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "결·곁·겹 — 너의 결, 너의 곁, 너의 겹",
  description:
    "자기를 잃어버린 것 같은 날, 취향은 아직 당신을 기억하고 있어요. 너의 결을 찾고, 곁이 되어주고, 겹겹이 쌓아가는 취향 서재.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
