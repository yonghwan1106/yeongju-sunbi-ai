import { heritageData, getHeritageById } from "@/data/heritage";
import { getQuizByHeritage } from "@/data/quiz";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  MapPin,
  Clock,
  Ticket,
  CalendarX,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeritageDetailTabs from "@/components/heritage/HeritageDetailTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return heritageData.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const heritage = getHeritageById(id);
  if (!heritage) return { title: "문화유산을 찾을 수 없습니다" };
  return {
    title: `${heritage.name} - 영주선비AI`,
    description: heritage.description,
  };
}

const categoryColors: Record<string, string> = {
  유네스코: "bg-amber-500 text-white",
  국보: "bg-red-600 text-white",
  보물: "bg-blue-600 text-white",
  사적: "bg-green-600 text-white",
  명승: "bg-emerald-600 text-white",
  천연기념물: "bg-teal-600 text-white",
  민속문화재: "bg-purple-600 text-white",
};

const categoryGradients: Record<string, string> = {
  유네스코: "from-amber-700 via-amber-500 to-yellow-400",
  국보: "from-red-800 via-red-600 to-rose-400",
  보물: "from-blue-800 via-blue-600 to-sky-400",
  사적: "from-green-800 via-green-600 to-emerald-400",
  명승: "from-emerald-800 via-emerald-600 to-green-400",
  민속문화재: "from-purple-800 via-purple-600 to-violet-400",
};

export default async function HeritageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const heritage = getHeritageById(id);
  if (!heritage) notFound();

  const quizzes = getQuizByHeritage(heritage.id);
  const currentIndex = heritageData.findIndex((h) => h.id === heritage.id);
  const prevHeritage = currentIndex > 0 ? heritageData[currentIndex - 1] : null;
  const nextHeritage =
    currentIndex < heritageData.length - 1 ? heritageData[currentIndex + 1] : null;

  const gradient =
    categoryGradients[heritage.category] ?? categoryGradients["유네스코"];

  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 pattern-bg opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <Link
            href="/heritage"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            문화유산 목록
          </Link>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit ${categoryColors[heritage.category] ?? "bg-gray-500 text-white"}`}
          >
            {heritage.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {heritage.name}
          </h1>
          <p className="text-white/80 text-sm md:text-base">{heritage.nameEn}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {heritage.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Tabbed content */}
        <div className="mt-8">
          <HeritageDetailTabs heritage={heritage} />
        </div>

        {/* Visit Info Card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-[var(--shadow-warm-sm)] border border-[var(--color-parchment)]">
          <h3 className="text-lg font-bold text-[var(--color-primary-800)] mb-4">
            방문 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[var(--color-earth-500)] font-medium">위치</p>
                <p className="text-[var(--color-charcoal)] text-sm">{heritage.location.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[var(--color-earth-500)] font-medium">운영 시간</p>
                <p className="text-[var(--color-charcoal)] text-sm">{heritage.visitInfo.hours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[var(--color-earth-500)] font-medium">입장료</p>
                <p className="text-[var(--color-charcoal)] text-sm">{heritage.visitInfo.fee}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarX className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[var(--color-earth-500)] font-medium">휴관일</p>
                <p className="text-[var(--color-charcoal)] text-sm">{heritage.visitInfo.closedDays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI 해설사 CTA */}
        <div className="mt-6 bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-700)] rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">
                {heritage.name}에 대해 더 궁금하신가요?
              </h3>
              <p className="text-white/80 text-sm mt-1">
                AI 선비 해설사에게 자유롭게 질문해보세요
              </p>
            </div>
            <Link
              href={`/chat?q=${encodeURIComponent(`${heritage.name}에 대해 자세히 알려주세요`)}`}
              className="inline-flex items-center gap-2 bg-white text-[var(--color-accent-700)] px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition shrink-0"
            >
              <MessageCircle className="w-5 h-5" />
              AI 해설사에게 질문하기
            </Link>
          </div>
        </div>

        {/* Related Quiz */}
        {quizzes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-[var(--color-primary-800)] mb-4">
              관련 퀴즈 ({quizzes.length}문제)
            </h3>
            <div className="grid gap-3">
              {quizzes.slice(0, 3).map((quiz, idx) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg p-4 shadow-[var(--shadow-warm-sm)] border border-[var(--color-parchment)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      Q{idx + 1}
                    </span>
                    <p className="text-[var(--color-charcoal)] text-sm">
                      {quiz.question}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
                      quiz.difficulty === "easy"
                        ? "bg-green-100 text-green-700"
                        : quiz.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quiz.difficulty === "easy"
                      ? "쉬움"
                      : quiz.difficulty === "medium"
                        ? "보통"
                        : "어려움"}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/quiz"
              className="inline-block mt-4 text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] font-medium text-sm"
            >
              전체 퀴즈 도전하기 →
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center border-t border-[var(--color-parchment)] pt-6">
          {prevHeritage ? (
            <Link
              href={`/heritage/${prevHeritage.id}`}
              className="flex items-center gap-2 text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)]"
            >
              <ChevronLeft className="w-5 h-5" />
              <div>
                <p className="text-xs text-[var(--color-earth-400)]">이전</p>
                <p className="font-medium">{prevHeritage.name}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextHeritage ? (
            <Link
              href={`/heritage/${nextHeritage.id}`}
              className="flex items-center gap-2 text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] text-right"
            >
              <div>
                <p className="text-xs text-[var(--color-earth-400)]">다음</p>
                <p className="font-medium">{nextHeritage.name}</p>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
