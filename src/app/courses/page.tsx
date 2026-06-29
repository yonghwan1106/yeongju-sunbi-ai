import type { Metadata } from "next";
import { Map } from "lucide-react";
import { coursesData } from "@/data/active";
import CourseCard from "@/components/courses/CourseCard";
import { getActiveCity } from "@/config/city";

const _courseCity = getActiveCity();

export const metadata: Metadata = {
  title: `추천 코스 | ${_courseCity.brand.title}`,
  description:
    `AI 선비가 큐레이션한 ${_courseCity.name} 여행 코스 — 유네스코 반나절부터 가족 2박3일까지, 데이터 기반 ${_courseCity.name} 관광 코스를 만나보세요.`,
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary-800)] via-[var(--color-primary-700)] to-[var(--color-earth-700)] text-white overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
              <Map className="w-4 h-4" />
              큐레이션 여행 코스
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              AI 선비가 큐레이션한 {_courseCity.name} 여행 코스
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              반나절부터 2박3일까지, {_courseCity.name}의 유네스코 세계유산과 선비문화를
              알차게 묶은 코스를 골라 떠나 보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-sm text-[var(--color-charcoal)] opacity-60 mb-6">
          총 {coursesData.length}개의 추천 코스
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coursesData.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
