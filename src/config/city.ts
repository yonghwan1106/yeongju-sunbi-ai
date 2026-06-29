import { yeongjuCity } from "./cities/yeongju";
import { andongCity } from "./cities/andong";
import type { CityConfig } from "./cities/types";

/**
 * 활성 도시 설정을 반환한다.
 *
 * NEXT_PUBLIC_CITY_ID 환경변수로 도시를 선택한다.
 * 이 변수는 Next.js 빌드 타임에 인라인되므로 배포당 도시가 고정된다.
 *
 * - "andong"  → 안동선비AI
 * - 그 외 / 미설정 → 영주선비AI (기본)
 */
export function getActiveCity(): CityConfig {
  if (process.env.NEXT_PUBLIC_CITY_ID === "andong") {
    return andongCity;
  }
  return yeongjuCity;
}
