# 오색운 (五色運)

> 사주와 타로로 보는 오늘의 색 · 오행 기반 운세 토스 미니앱

## 개요

**오색운**은 사용자의 사주(생년월일+시)를 기반으로 오행(木火土金水) 분석을 수행하고, 매일 3장의 오행 타로 카드 리딩과 오늘의 색·미션을 제공하는 운세 서비스입니다.

## 주요 기능

### ✅ 구현 완료

| 기능 | 설명 |
|------|------|
| **온보딩** | 닉네임 · 생년월일 · 시간 · 성별 입력 → 사주 오행 분석 |
| **오늘의 운세** | 사주 기반 일진 분석 → 오늘의 컬러 오브 + 운세 메시지 |
| **오행 타로 (50장)** | 5카테고리 (Major 10 / Element 20 / Zodiac 12 / Protection 5 / Luck 3) |
| **3카드 리딩** | 부채꼴 덱 UI → 3장 선택 → 스태거 리빌 애니메이션 → 포지션별 해석 |
| **심화 리딩** | 오행 상생/상극 분석 + 3카드 시너지 패턴 + 행동 조언 |
| **타로 히스토리** | 캘린더형 월별 조회 + 일자별 리딩 상세 + 통계 |
| **일일 미션** | 오행 컬러 기반 3개 미션 + 주간 히스토리 |
| **내 정보 (프로필)** | 사주 오행 분포 차트 + 활동 통계 + 카드 오행 통계 |
| **공유 기능** | Canvas API로 타로결과/컬러 공유 이미지 생성 + Web Share API |
| **카드 이미지** | 50장 + 뒷면, WebP 최적화 (2.1MB) |
| **PWA 지원** | manifest.json, apple-touch-icon, OG 메타태그 |
| **에러 처리** | React ErrorBoundary + 사용자 친화적 복구 UI |

## 기술 스택

| 계층 | 기술 |
|------|------|
| **Frontend** | React 18 · React Router · React Query · Zustand · framer-motion · Tailwind CSS |
| **Backend** | Hono 4 · Cloudflare Workers · D1 (SQLite) |
| **Build** | Vite 6 · TypeScript · pnpm workspaces |
| **개발환경** | PM2 · wrangler dev --local |

## 프로젝트 구조

```
webapp/
├── apps/
│   ├── web/                      # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── splash/       # SplashScreen (자동 라우팅)
│   │   │   │   ├── onboarding/   # 온보딩 + 사주 수정 (editMode)
│   │   │   │   ├── home/         # 메인홈 + BottomTabBar
│   │   │   │   ├── tarot/        # 타로 카드 드로우 + 리딩 + 심화 리딩 + 히스토리
│   │   │   │   ├── mission/      # 일일 미션 + 주간 히스토리
│   │   │   │   └── profile/      # 내 정보 (사주 분석 + 통계)
│   │   │   ├── shared/
│   │   │   │   ├── api/          # ky 클라이언트 + 엔드포인트
│   │   │   │   ├── components/   # Toast, ShareModal, BottomSheet, ErrorBoundary
│   │   │   │   ├── stores/       # Zustand userStore
│   │   │   │   └── utils/        # shareImage (Canvas), helpers
│   │   │   └── data/             # cards.json, cardImages.ts
│   │   └── public/
│   │       └── static/cards/     # 51 WebP 카드 이미지 (~2.1MB)
│   └── api/                      # Hono Workers API
│       └── src/
│           ├── routes/           # users, tarot, missions, dailyFortune
│           ├── utils/            # cardDraw, deepReading (오행 분석 엔진)
│           └── db/               # D1 migrations + seed
└── packages/
    └── shared/                   # 공유 타입/상수 (Element, User, DESIGN_TOKENS)
```

## 라우트 맵

### 프론트엔드 (React Router)

| 경로 | 화면 |
|------|------|
| `/` | SplashScreen → 자동 분기 (온보딩/홈) |
| `/onboarding` | 온보딩 (3단계) |
| `/onboarding?mode=edit` | 사주 수정 (step 2부터) |
| `/home` | 메인 홈 (컬러 오브 + 타로 요약 + 미션) |
| `/tarot` | 타로 카드 드로우 + 리딩 결과 |
| `/tarot/history` | 캘린더형 타로 히스토리 |
| `/mission` | 일일 미션 3종 + 주간 히스토리 |
| `/profile` | 내 정보 (사주 차트 + 통계) |

### API (Hono)

| Method | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/users` | 유저 생성 |
| `GET` | `/api/users/me` | 내 정보 조회 |
| `PATCH` | `/api/users/me` | 정보 수정 |
| `DELETE` | `/api/users/me` | 계정 삭제 |
| `GET` | `/api/daily-fortune` | 오늘의 운세 |
| `GET` | `/api/daily-fortune/missions` | 오늘의 미션 목록 |
| `GET` | `/api/tarot/status` | 오늘 타로 상태 |
| `POST` | `/api/tarot/draw` | 3카드 드로우 |
| `GET` | `/api/tarot/history` | 타로 히스토리 |
| `POST` | `/api/tarot/deep-reading` | 심화 리딩 (오행 분석) |
| `GET` | `/api/missions/today` | 오늘 미션 조회 |
| `POST` | `/api/missions/complete` | 미션 완료 |
| `POST` | `/api/missions/uncomplete` | 미션 완료 취소 |
| `GET` | `/api/missions/history` | 미션 히스토리 |

## 하단 탭바

| 탭 | 아이콘 | 경로 |
|----|--------|------|
| 홈 | `fa-home` | `/home` |
| 타로 | `fa-moon` | `/tarot` |
| 미션 | `fa-star` | `/mission` |
| 히스토리 | `fa-calendar-alt` | `/tarot/history` |
| 내 정보 | `fa-user` | `/profile` |

## 데이터 모델

### D1 테이블

- `users` — 닉네임, 생년월일, 시간, 성별, 오행분포(JSON), 가장약한오행
- `daily_fortunes` — 일별 운세, 컬러, 미션 3종
- `card_readings` — 타로 드로우 기록 (3장 카드 + 리딩 메시지)
- `mission_logs` — 미션 완료 기록
- `card_collections` — 카드 수집 히스토리

### 오행 시스템

- **5원소**: 木(나무) · 火(불) · 土(대지) · 金(금속) · 水(물)
- **상생(相生)**: 木→火→土→金→水→木
- **상극(相剋)**: 木→土→水→火→金→木
- **조화도**: 대길 · 길 · 평 · 소흉 · 흉

## 디자인 토큰

```
bg-top: #0F1028 (심야 남색)
gold:   #D4AF37 (금장)
ivory:  #F5F0E1 (상아색 텍스트)
서체:    Gowun Batang (한글 본문), Cormorant Garamond (라틴), Pretendard (UI)
```

## 로컬 개발

```bash
pnpm install
pm2 start ecosystem.config.cjs   # API (8787) + Web (3000) 동시 기동
# http://localhost:3000
```

## 배포

- **플랫폼**: Cloudflare Pages + Workers
- **상태**: 개발 중 (로컬 D1)
- **최종 수정**: 2026-07-31
