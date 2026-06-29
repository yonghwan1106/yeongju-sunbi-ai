import { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  CloudSun,
  MapPin,
  BookOpen,
  Library,
  ExternalLink,
  Database,
  Zap,
} from "lucide-react";
import { getActiveCity } from "@/config/city";

const _dsCity = getActiveCity();

export const metadata: Metadata = {
  title: `공공데이터 활용 내역 | ${_dsCity.brand.title}`,
  description: `${_dsCity.brand.title}가 활용하는 5개 정부·공공기관 데이터 출처`,
};

interface DataSource {
  id: number;
  provider: string;
  providerEn: string;
  endpoint: string;
  providerUrl: string;
  accessType: "REST" | "GET" | "Static";
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  usage: string;
  tools: string[];
  example: string;
}

const _top1 = _dsCity.dataPack.heritage[0]?.name ?? _dsCity.name;
const _fig1 = _dsCity.dataPack.figures[0]?.name ?? "주요 인물";

const sources: DataSource[] = [
  {
    id: 1,
    provider: "문화재청 국가문화유산포털",
    providerEn: "Cultural Heritage Administration (CHA)",
    endpoint: "http://www.cha.go.kr/cha/SearchKindOpenapiList.do",
    providerUrl: "https://www.cha.go.kr",
    accessType: "REST",
    icon: <Landmark className="w-6 h-6" />,
    iconBg: "bg-amber-100 text-amber-700",
    accentColor: "border-amber-400",
    usage:
      `${_dsCity.name} 지역 문화유산을 문화재청 국가문화유산포털 OpenAPI(무인증)로 실시간 조회합니다. AI 해설사가 유산 검색 시 공식 지정문화유산 목록을 실시간 호출하고, 큐레이션 해설과 함께 문화재청을 출처로 표기합니다.`,
    tools: ["searchHeritage"],
    example: `${_top1} 관련 국보 지정 정보를 알려주세요`,
  },
  {
    id: 2,
    provider: "한국관광공사 TourAPI 4.0",
    providerEn: "Korea Tourism Organization (KTO)",
    endpoint: "https://apis.data.go.kr/B551011/KorService2",
    providerUrl: "https://www.visitkorea.or.kr",
    accessType: "REST",
    icon: <MapPin className="w-6 h-6" />,
    iconBg: "bg-emerald-100 text-emerald-700",
    accentColor: "border-emerald-400",
    usage:
      `${_dsCity.name} 시내 관광지·맛집·숙박·축제 5개 콘텐츠 타입을 실시간으로 검색합니다. 코스 추천 시 인접 명소를 자동 보강하며, 최신 행사·축제 정보를 반영하여 계절별 맞춤 추천을 제공합니다.`,
    tools: ["searchTourSpots", "planTourCourse"],
    example: `${_top1} 근처 한식당 추천`,
  },
  {
    id: 3,
    provider: "기상청 단기예보 API",
    providerEn: "Korea Meteorological Administration (KMA)",
    endpoint:
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
    providerUrl: "https://www.kma.go.kr",
    accessType: "GET",
    icon: <CloudSun className="w-6 h-6" />,
    iconBg: "bg-sky-100 text-sky-700",
    accentColor: "border-sky-400",
    usage:
      `${_dsCity.name}(NX=${_dsCity.weatherGrid.nx}, NY=${_dsCity.weatherGrid.ny}) 좌표 기준 3시간 단위 단기예보를 실시간으로 조회합니다. 방문 추천 코스에 날씨 변수를 반영하여 우천·강설 시 실내 대안 코스를 자동 제시합니다.`,
    tools: ["getWeather"],
    example: `오늘 ${_dsCity.name} 날씨 어때요? ${_top1} 가도 될까요`,
  },
  {
    id: 4,
    provider: "국립중앙박물관 e-Museum",
    providerEn: "National Museum of Korea",
    endpoint: "http://www.emuseum.go.kr/openapi",
    providerUrl: "https://www.museum.go.kr",
    accessType: "REST",
    icon: <Library className="w-6 h-6" />,
    iconBg: "bg-violet-100 text-violet-700",
    accentColor: "border-violet-400",
    usage:
      `${_dsCity.name} 출토 또는 관련 유물을 검색합니다. 큐레이션된 정적 데이터를 fallback으로 항상 보유하여 API 장애 시에도 핵심 유물 정보를 안정적으로 제공합니다.`,
    tools: ["searchMuseum"],
    example: `${_top1}과 관련된 박물관 유물을 찾아주세요`,
  },
  {
    id: 5,
    provider: "한국학중앙연구원 한국민족문화대백과",
    providerEn: "Academy of Korean Studies (AKS)",
    endpoint: "http://encykorea.aks.ac.kr/openapi",
    providerUrl: "https://www.aks.ac.kr",
    accessType: "Static",
    icon: <BookOpen className="w-6 h-6" />,
    iconBg: "bg-rose-100 text-rose-700",
    accentColor: "border-rose-400",
    usage:
      `${_dsCity.name} 선비문화 인물 백과 항목을 검색합니다. 현재 정적 큐레이션 항목으로 서비스하며, 한국학 전문 출처로 AI 답변의 학술적 신뢰성을 보강합니다.`,
    tools: ["searchEncyclopedia"],
    example: `${_fig1}이 누구인가요?`,
  },
];

const accessTypeBadge: Record<
  DataSource["accessType"],
  { label: string; cls: string }
> = {
  REST: {
    label: "REST",
    cls: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
  },
  GET: {
    label: "GET",
    cls: "bg-sky-100 text-sky-700",
  },
  Static: {
    label: "Static",
    cls: "bg-stone-100 text-stone-600",
  },
};

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary-800)] via-[var(--color-primary-700)] to-[var(--color-earth-700)] text-white overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
              <Database className="w-4 h-4" />
              공공데이터 활용 내역
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              공공데이터 활용 내역
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
              {_dsCity.brand.title}는 5개 정부·공공기관의 데이터를 활용해 답변합니다.
              문화재청·기상청·한국관광공사는 실시간 API로, 국립중앙박물관·민족문화대백과는
              검증된 정적 큐레이션으로 — 모든 답변에 출처를 명시합니다.
            </p>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm text-white/90 mt-2">
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                실시간 API(기상청·관광공사)는{" "}
                <a
                  href="https://www.data.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-amber-300 transition-colors"
                >
                  공공데이터포털 data.go.kr
                </a>
                에서 인증키를 발급받아 사용합니다.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-sm text-[var(--color-charcoal)] opacity-60 mb-8 text-center">
          총 5개 공공기관 데이터 연동 · 실시간 API 3 + 검증 큐레이션 2
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((src) => {
            const badge = accessTypeBadge[src.accessType];
            return (
              <div
                key={src.id}
                className={`relative bg-white rounded-2xl border border-[var(--color-parchment)] shadow-[var(--shadow-warm-sm)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-8px_rgb(139_90_43_/_0.18)] border-l-4 ${src.accentColor}`}
              >
                {/* Access-type badge — top right */}
                <span
                  className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}
                >
                  {badge.label}
                </span>

                <div className="p-6 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 pr-14">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${src.iconBg}`}
                    >
                      {src.icon}
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[var(--color-ink)] leading-snug">
                        {src.provider}
                      </h2>
                      <p className="text-xs text-[var(--color-charcoal)] opacity-60 mt-0.5">
                        {src.providerEn}
                      </p>
                    </div>
                  </div>

                  {/* Endpoint */}
                  <div className="flex items-center gap-2 bg-[var(--color-ivory)] rounded-lg px-3 py-2">
                    <code className="text-xs text-[var(--color-primary-700)] break-all leading-relaxed flex-1">
                      {src.endpoint}
                    </code>
                    <a
                      href={src.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[var(--color-charcoal)] opacity-50 hover:opacity-100 hover:text-[var(--color-primary-600)] transition-colors"
                      aria-label={`${src.provider} 공식 사이트 열기`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Usage prose */}
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide opacity-50 mb-1">
                      이 서비스에서의 활용
                    </p>
                    <p className="text-sm text-[var(--color-charcoal)] leading-relaxed">
                      {src.usage}
                    </p>
                  </div>

                  {/* Tool tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {src.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs rounded-full font-mono"
                      >
                        <Zap className="w-2.5 h-2.5" />
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Example query */}
                  <div className="border-t border-[var(--color-parchment)] pt-3">
                    <p className="text-xs font-semibold text-[var(--color-charcoal)] opacity-50 mb-1.5">
                      샘플 질의
                    </p>
                    <p className="text-sm italic text-[var(--color-primary-700)] bg-[var(--color-primary-50)] rounded-lg px-3 py-2 leading-relaxed">
                      &ldquo;{src.example}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 문화유산 사진 출처 — 영주 빌드 전용 */}
        {_dsCity.id === "yeongju" && (
          <div className="mt-12 rounded-2xl bg-white border border-[var(--color-parchment)] p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--color-ink)] mb-1">
              문화유산 사진 출처
            </h2>
            <p className="text-sm text-[var(--color-charcoal)] opacity-60 mb-4">
              문화유산 페이지의 실제 사진은 자유 이용 라이선스 저작물을 사용했습니다.
            </p>
            <ul className="space-y-1.5 text-sm text-[var(--color-charcoal)] leading-relaxed">
              <li>부석사 — Bernard Gagnon, Wikimedia Commons (CC0)</li>
              <li>소수서원 — Jjw, Wikimedia Commons (CC BY-SA 3.0)</li>
              <li>소백산 — Seonghyeon5836, Wikimedia Commons (CC BY-SA 4.0)</li>
              <li>영주향교 — 포모사, Wikimedia Commons (CC BY-SA 4.0)</li>
              <li>소수박물관 — 한국관광공사 TourAPI (공공누리 제1유형)</li>
              <li>풍기인삼 — Eugene Kim, Wikimedia Commons (CC BY 2.5)</li>
              <li>선비촌·무섬마을 — 별도 제공 사진</li>
            </ul>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl bg-[var(--color-earth-800)] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-white">공공데이터포털 인증키 발급</p>
            <p className="text-sm text-white/70 mt-0.5">
              실시간 API(기상청·한국관광공사)는 공공데이터포털(data.go.kr)에서 무료로 인증키를 발급받아
              사용할 수 있습니다. 누구나 신청 가능합니다.
            </p>
          </div>
          <Link
            href="https://www.data.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-400)] transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-xl"
          >
            data.go.kr
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
