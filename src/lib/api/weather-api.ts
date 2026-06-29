/**
 * 기상청 단기예보 API 클라이언트 (getVilageFcst)
 * https://www.data.go.kr/data/15084084/openapi.do
 *
 * 주의(과거 버그 수정):
 *  1) Vercel 서버리스는 UTC로 동작 → base_date/base_time을 반드시 KST(UTC+9)로 계산.
 *  2) 응답은 여러 fcstTime(시간별)을 담으므로, 카테고리별 '첫 항목'이 아니라
 *     '현재 시각에 가장 가까운 예보 슬롯'을 골라야 현재 기온이 나온다(과거: 새벽값 노출).
 *  3) 격자(nx,ny)는 cityConfig.weatherGrid 사용(영주=89,111 / 안동=91,106).
 */

import { getActiveCity } from "@/config/city";

const WEATHER_API_BASE =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const API_KEY = process.env.WEATHER_API_KEY || "";

interface WeatherData {
  temperature: number;
  sky: string;
  precipitation: string;
  humidity: number;
  windSpeed: number;
  recommendation: string;
  observedAt: string; // 예: "오늘 20시 기준"
}

interface FcstItem {
  category: string;
  fcstValue: string;
  fcstDate: string;
  fcstTime: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 서버 TZ와 무관하게 KST 벽시계 구성요소 반환 */
function kstParts() {
  const k = new Date(Date.now() + 9 * 3600 * 1000);
  return {
    y: k.getUTCFullYear(),
    mo: k.getUTCMonth() + 1,
    d: k.getUTCDate(),
    h: k.getUTCHours(),
    mi: k.getUTCMinutes(),
  };
}

/** KST 기준 가장 최근 발표(02·05·08·11·14·17·20·23시, 발표 후 ~15분 여유) */
function baseDateTime() {
  const p = kstParts();
  const bases = [23, 20, 17, 14, 11, 8, 5, 2];
  let bh = -1;
  for (const b of bases) {
    if (p.h > b || (p.h === b && p.mi >= 15)) {
      bh = b;
      break;
    }
  }
  let y = p.y,
    mo = p.mo,
    d = p.d;
  if (bh === -1) {
    // 02:15 이전 → 전날 23시 발표
    const prev = new Date(Date.UTC(p.y, p.mo - 1, p.d) - 24 * 3600 * 1000);
    y = prev.getUTCFullYear();
    mo = prev.getUTCMonth() + 1;
    d = prev.getUTCDate();
    bh = 23;
  }
  return { baseDate: `${y}${pad(mo)}${pad(d)}`, baseTime: `${pad(bh)}00`, kst: p };
}

export async function getYeongjuWeather(): Promise<WeatherData | null> {
  const { baseDate, baseTime, kst } = baseDateTime();
  const grid = getActiveCity().weatherGrid;

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    pageNo: "1",
    numOfRows: "300",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(grid.nx),
    ny: String(grid.ny),
  });

  try {
    const response = await fetch(`${WEATHER_API_BASE}?${params}`, {
      next: { revalidate: 1800 }, // 30분 캐시
    });
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

    const data = await response.json();
    const items: FcstItem[] = data.response?.body?.items?.item || [];
    if (!items.length) return null;

    return parseWeatherItems(items, kst);
  } catch (error) {
    console.error("기상청 API 호출 실패:", error);
    return null;
  }
}

function parseWeatherItems(
  items: FcstItem[],
  kst: { y: number; mo: number; d: number; h: number; mi: number }
): WeatherData {
  // 현재 KST 시각(HH00)에 가장 가까운(과거쪽) 예보 슬롯을 선택 = 현재 기온
  const nowStamp = `${kst.y}${pad(kst.mo)}${pad(kst.d)}${pad(kst.h)}00`;
  const stamps = Array.from(
    new Set(items.map((i) => `${i.fcstDate}${i.fcstTime}`))
  ).sort();
  const past = stamps.filter((s) => s <= nowStamp);
  const target = past.length ? past[past.length - 1] : stamps[0];

  const values: Record<string, string> = {};
  for (const it of items) {
    if (`${it.fcstDate}${it.fcstTime}` === target) {
      values[it.category] = it.fcstValue;
    }
  }

  const temp = Number(values["TMP"] ?? 0);
  const skyCode = values["SKY"] || "1";
  const ptyCode = values["PTY"] || "0";
  const humidity = Number(values["REH"] ?? 0);
  const windSpeed = Number(values["WSD"] ?? 0);

  const skyMap: Record<string, string> = { "1": "맑음", "3": "구름많음", "4": "흐림" };
  const ptyMap: Record<string, string> = {
    "0": "없음",
    "1": "비",
    "2": "비/눈",
    "3": "눈",
    "4": "소나기",
    "5": "빗방울",
    "6": "빗방울눈날림",
    "7": "눈날림",
  };

  const sky = skyMap[skyCode] || "맑음";
  const precipitation = ptyMap[ptyCode] || "없음";

  // target = "YYYYMMDDHH00" → 시각 라벨
  const targetHour = target.slice(8, 10);
  const sameDay = target.slice(0, 8) === `${kst.y}${pad(kst.mo)}${pad(kst.d)}`;
  const observedAt = `${sameDay ? "오늘" : ""} ${Number(targetHour)}시 기준`.trim();

  return {
    temperature: temp,
    sky,
    precipitation,
    humidity,
    windSpeed,
    recommendation: getVisitRecommendation(temp, sky, precipitation),
    observedAt,
  };
}

function getVisitRecommendation(temp: number, sky: string, precipitation: string): string {
  if (precipitation !== "없음") {
    if (precipitation === "비" || precipitation === "소나기" || precipitation === "빗방울") {
      return "비가 예상됩니다. 실내 문화유산 방문을 추천합니다. 우산을 꼭 챙기세요!";
    }
    return "눈이 내리는 날의 문화유산은 특별히 아름답습니다. 따뜻하게 입고 겨울 절경을 감상해보세요.";
  }

  if (sky === "맑음") {
    if (temp >= 20 && temp <= 28) {
      return "야외 탐방에 완벽한 날씨입니다! 야외 문화유산 탐방을 추천합니다.";
    }
    if (temp < 5) {
      return "맑지만 춥습니다. 겨울 문화유산 탐방에 좋은 날씨입니다. 방한 준비를 하세요.";
    }
    if (temp >= 29) {
      return "맑고 더운 날씨입니다. 그늘·실내 동선을 곁들이고 수분을 충분히 섭취하세요.";
    }
    return "날씨가 좋아 모든 문화유산 탐방에 적합합니다. 야외 문화유산을 꼭 놓치지 마세요!";
  }

  return "구름이 있지만 탐방에 무리는 없습니다. 실내·실외 문화유산을 천천히 둘러보세요.";
}
