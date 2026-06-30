import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { getActiveCity } from "@/config/city";
import { isEn } from "@/config/locale";
import { cityLabel } from "@/i18n/ui";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
  preload: false,
});

const _city = getActiveCity();
const _tagline = isEn() ? "AI Heritage Guide Platform" : "AI 문화유산 해설 플랫폼";
const _ogDesc = isEn()
  ? `An AI Sunbi guide narrates the millennium-old heritage of ${cityLabel()}.`
  : `${_city.name}의 천년 문화유산을 AI 선비 해설사가 안내합니다`;
export const metadata: Metadata = {
  metadataBase: new URL("https://yeongju-sunbi-ai.vercel.app"),
  title: `${_city.brand.title} - ${_tagline}`,
  description: _city.brand.description,
  keywords: _city.brand.keywords,
  openGraph: {
    title: `${_city.brand.title} - ${_tagline}`,
    description: _ogDesc,
    locale: isEn() ? "en_US" : "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={isEn() ? "en" : "ko"} className={notoSansKr.variable}>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
