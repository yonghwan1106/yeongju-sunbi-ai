// 문화유산 관련 타입
export interface Heritage {
  id: string;
  name: string;
  nameEn: string;
  category: "유네스코" | "국보" | "보물" | "사적" | "명승" | "천연기념물" | "민속문화재";
  description: string;
  history: string;
  architecture?: string;
  hiddenStory?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  visitInfo: {
    hours: string;
    fee: string;
    closedDays: string;
  };
  tags: string[];
  stampId?: string;
}

// 퀴즈 관련 타입
export interface QuizQuestion {
  id: string;
  heritageId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: "역사" | "건축" | "문화" | "인물" | "자연";
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  badges: Badge[];
}

// 스탬프투어 관련 타입
export interface StampSpot {
  id: string;
  heritageId: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  stampImage: string;
  collected: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
}

// 채팅 관련 타입
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: DataSource[];
}

export interface DataSource {
  name: string;
  provider: string;
  url?: string;
}

// 공공데이터 API 응답 타입
export interface TourAPIResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: TourItem[] };
      totalCount: number;
    };
  };
}

export interface TourItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string;
  mapy: string;
  firstimage?: string;
  overview?: string;
}

export interface HeritageAPIResponse {
  response: {
    body: {
      items: { item: HeritageItem[] };
      totalCount: number;
    };
  };
}

export interface HeritageItem {
  ccbaKdcd: string;
  ccbaAsno: string;
  ccbaMnm1: string;
  ccbaCtcdNm: string;
  ccsiName: string;
  ccbaLcad: string;
  content: string;
  imageUrl?: string;
}

// 날씨 API 타입
export interface WeatherInfo {
  temperature: number;
  sky: "맑음" | "구름많음" | "흐림";
  precipitation: "없음" | "비" | "눈" | "비/눈";
  recommendation: string;
}

// 코스 추천 타입
export interface CourseRecommendation {
  id: string;
  name: string;
  duration: string;
  spots: Heritage[];
  theme: "역사탐방" | "건축감상" | "선비체험" | "자연힐링" | "가족나들이";
  description: string;
}
