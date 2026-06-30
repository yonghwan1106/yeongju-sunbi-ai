import { yeongjuCity } from "./cities/yeongju";
import { andongCity } from "./cities/andong";
import type { CityConfig } from "./cities/types";

/**
 * andong 브랜치 전용 — 안동 도시로 고정(라이브 데모용).
 * 동일 코드·아키텍처에서 데이터팩만 교체해 "전국 확장 프레임워크"를 라이브로 입증한다.
 * (main/master 영주 기본값은 영향 없음 — 이 변경은 andong 브랜치에만 존재)
 */
export function getActiveCity(): CityConfig {
  if (process.env.NEXT_PUBLIC_CITY_ID === "yeongju") return yeongjuCity;
  return andongCity;
}
