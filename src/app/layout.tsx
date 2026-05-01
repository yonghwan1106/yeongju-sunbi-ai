import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "영주선비AI - AI 문화유산 해설 플랫폼",
  description:
    "유네스코 세계유산 부석사·소수서원을 비롯한 영주의 천년 문화유산을 AI가 생생하게 해설해드립니다. 공공데이터 기반 대화형 AI 해설사, 선비문화 퀴즈, 디지털 스탬프투어를 만나보세요.",
  keywords: ["영주", "문화유산", "AI 해설사", "부석사", "소수서원", "선비문화", "유네스코", "공공데이터"],
  openGraph: {
    title: "영주선비AI - AI 문화유산 해설 플랫폼",
    description: "영주의 천년 문화유산을 AI 선비 해설사가 안내합니다",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
