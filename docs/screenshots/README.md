# Demo Screenshots

심사·시연용 자동 캡처본. 데스크탑(1440×900) + 모바일(iPhone 14 Pro 390×844 deviceScaleFactor 3) 두 사이즈로 8 페이지를 캡처합니다.

## 캡처 명령

```bash
# 1) Dev 서버 기동 (한글 경로에서 Turbopack 회피)
npx next dev --port 3404 --webpack

# 2) 같은 호스트에서 Playwright 스크립트 실행
SCREEN_ROOT="$(pwd)/docs/screenshots" node scripts/capture-screens.mjs
```

스크립트가 없다면 `docs/demo-script.md` 의 캡처 절차를 참고해 ad-hoc Playwright 스크립트를 작성하면 됩니다.

## 파일 목록

| 번호 | 페이지 | URL | 데스크탑 | 모바일 |
|---|---|---|---|---|
| 01 | 홈 (Contest 배지) | `/` | `01-home-desktop.png` | `01-home-mobile.png` |
| 02 | 문화유산 + 선비 계보 | `/heritage` | `02-heritage-list-desktop.png` | `02-heritage-list-mobile.png` |
| 03 | 부석사 상세 | `/heritage/buseoksa` | `03-heritage-detail-desktop.png` | `03-heritage-detail-mobile.png` |
| 04 | 추천 코스 | `/courses` | `04-courses-desktop.png` | `04-courses-mobile.png` |
| 05 | AI 해설사 | `/chat` | `05-chat-desktop.png` | `05-chat-mobile.png` |
| 06 | 선비 퀴즈 | `/quiz` | `06-quiz-desktop.png` | `06-quiz-mobile.png` |
| 07 | 스탬프투어 | `/stamp-tour` | `07-stamp-tour-desktop.png` | `07-stamp-tour-mobile.png` |
| 08 | 공공데이터 출처 | `/data-sources` | `08-data-sources-desktop.png` | `08-data-sources-mobile.png` |

## Vercel main 브랜치 보호 (수동 작업)

자동화할 수 없는 외부 설정. 다음 단계로 직접 수행해주세요.

1. <https://github.com/yonghwan1106/yeongju-sunbi-ai/settings/branches> 진입
2. **Add rule** → Branch name pattern `main`
3. 체크: "Require a pull request before merging" / "Require status checks to pass before merging"
4. 저장
5. `master` 는 자동 배포 트랙이므로 직접 푸시 허용 유지 (현재 워크플로: `git push origin main:master` 로 fast-forward)
