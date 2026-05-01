/**
 * 기상청 단기예보 API 클라이언트
 * https://www.data.go.kr/data/15084084/openapi.do
 */

const WEATHER_API_BASE =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const API_KEY = process.env.WEATHER_API_KEY || "";

// 영주시 격자 좌표 (기상청 격자)
const YEONGJU_NX = 71;
const YEONGJU_NY = 122;

interface WeatherData {
  temperature: number;
  sky: string;
  precipitation: string;
  humidity: number;
  windSpeed: number;
  recommendation: string;
}

export async function getYeongjuWeather(): Promise<WeatherData | null> {
  const now = new Date();
  const baseDate = formatDate(now);
  const baseTime = getBaseTime(now);

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    pageNo: "1",
    numOfRows: "100",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(YEONGJU_NX),
    ny: String(YEONGJU_NY),
  });

  try {
    const response = await fetch(`${WEATHER_API_BASE}?${params}`, {
      next: { revalidate: 1800 }, // 30분 캐시
    });

    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

    const data = await response.json();
    const items = data.response?.body?.items?.item || [];

    return parseWeatherItems(items);
  } catch (error) {
    console.error("기상청 API 호출 실패:", error);
    return null;
  }
}

function parseWeatherItems(items: Array<{ category: string; fcstValue: string }>): WeatherData {
  const values: Record<string, string> = {};
  for (const item of items) {
    if (!values[item.category]) {
      values[item.category] = item.fcstValue;
    }
  }

  const temp = Number(values["TMP"] || 0);
  const skyCode = values["SKY"] || "1";
  const ptyCode = values["PTY"] || "0";
  const humidity = Number(values["REH"] || 0);
  const windSpeed = Number(values["WSD"] || 0);

  const skyMap: Record<string, string> = {
    "1": "맑음",
    "3": "구름많음",
    "4": "흐림",
  };

  const ptyMap: Record<string, string> = {
    "0": "없음",
    "1": "비",
    "2": "비/눈",
    "3": "눈",
    "4": "소나기",
  };

  const sky = skyMap[skyCode] || "맑음";
  const precipitation = ptyMap[ptyCode] || "없음";

  return {
    temperature: temp,
    sky,
    precipitation,
    humidity,
    windSpeed,
    recommendation: getVisitRecommendation(temp, sky, precipitation),
  };
}

function getVisitRecommendation(temp: number, sky: string, precipitation: string): string {
  if (precipitation !== "없음") {
    if (precipitation === "비" || precipitation === "소나기") {
      return "비가 예상됩니다. 실내 문화유산(소수서원 영정각, 선비촌 체험관) 방문을 추천합니다. 우산을 꼭 챙기세요!";
    }
    if (precipitation === "눈") {
      return "눈이 내리는 날의 부석사는 특별히 아름답습니다. 따뜻하게 입고 겨울 절경을 감상해보세요.";
    }
  }

  if (sky === "맑음") {
    if (temp >= 20 && temp <= 28) {
      return "야외 탐방에 완벽한 날씨입니다! 무섬마을 외나무다리와 소백산 죽령옛길을 추천합니다.";
    }
    if (temp < 5) {
      return "맑지만 춥습니다. 소백산 상고대(눈꽃)를 감상하기 좋은 날씨입니다. 방한 준비를 하세요.";
    }
    return "날씨가 좋아 모든 문화유산 탐방에 적합합니다. 부석사 석양은 꼭 놓치지 마세요!";
  }

  return "구름이 있지만 탐방에 무리는 없습니다. 소수서원과 선비촌 일대를 천천히 둘러보세요.";
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function getBaseTime(date: Date): string {
  const hour = date.getHours();
  // 기상청 단기예보 발표 시각: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300
  const baseTimes = [23, 20, 17, 14, 11, 8, 5, 2];
  for (const bt of baseTimes) {
    if (hour >= bt) return String(bt).padStart(2, "0") + "00";
  }
  return "2300"; // 이전 날 23시
}
