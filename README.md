# 오색운(五色運) - 토스 앱인토스 미니앱

사주와 타로를 결합한 한국 전통 운세 서비스. 1단계: 스플래시 + 온보딩 + 홈(오늘의 컬러) 화면.

## 프로젝트 개요

- **타깃**: 20~30대 여성, 토스 앱 내 미니앱
- **기술**: React 18 + TypeScript + Vite 6 + Tailwind 3 (프론트) / Hono 4 + Cloudflare Workers + D1 (백엔드)
- **구조**: pnpm 모노레포 (`apps/web`, `apps/api`, `packages/shared`)

## 1단계 구현 범위

### 화면 (3개)
| 경로 | 화면 | 설명 |
|------|------|------|
| `/` | 스플래시 | "오색운" 로고 페이드인, 2초 후 사용자 체크 → 라우팅 |
| `/onboarding` | 온보딩 | 3단계: 환영 → 사주 입력 → 완료 (API 등록) |
| `/home` | 홈 | 오늘의 컬러 오브 + 미션 카드 + 하단 탭바 |

### API 엔드포인트 (4개)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/users` | 사용자 등록 (온보딩 완료 시) |
| `GET` | `/api/users/me` | 현재 사용자 조회 (x-toss-user-key 헤더) |
| `PATCH` | `/api/users/me` | 사주 정보 수정 |
| `GET` | `/api/daily-fortune` | 오늘의 컬러·미션 조회 (?date=YYYY-MM-DD) |

### 데이터 모델
- **users**: 사용자 프로필 + 사주 오행(목·화·토·금·수) 점수
- **daily_fortunes**: 날짜별 컬러/미션 캐시
- **card_readings / mission_logs / card_collections**: 2단계 이후 사용 (스키마만 정의)

### 스토리지
- Cloudflare D1 (SQLite) - `--local` 모드로 로컬 개발

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# DB 마이그레이션 (로컬)
cd apps/api
npx wrangler d1 execute osaekwoon-db --local --file=src/db/migrations/0001_init.sql

# 백엔드 실행 (포트 8787)
cd ../..
pnpm dev:api

# 프론트엔드 실행 (포트 3000, /api → 8787 프록시)
pnpm dev:web
```

## 모노레포 구조

```
osaekwoon/
├── apps/
│   ├── web/          # React 프론트엔드 (Vite dev server, 포트 3000)
│   │   └── src/
│   │       ├── features/splash/      # 스플래시 화면
│   │       ├── features/onboarding/  # 온보딩 3단계
│   │       ├── features/home/        # 홈 (오늘의 컬러)
│   │       └── shared/               # API 클라이언트, Zustand 스토어
│   └── api/          # Hono 백엔드 (Wrangler dev, 포트 8787)
│       └── src/
│           ├── routes/               # users, dailyFortune
│           ├── middleware/           # 인증 미들웨어
│           ├── utils/                # 사주 계산, 컬러 산출
│           └── db/migrations/        # D1 마이그레이션
├── packages/
│   └── shared/       # 공통 타입, 상수
├── ecosystem.config.cjs  # PM2 설정
└── pnpm-workspace.yaml
```

## 디자인

- **배경**: #0F1028 → #2A1B4A 그라데이션 (다크 only)
- **오방색**: 청(#4A6FA5) 적(#C84B4B) 황(#E8B84A) 백(#F0EDE5) 흑(#2C2C3E)
- **폰트**: Pretendard(본문), Gowun Batang(감성), Cormorant Garamond(숫자)
- **무드**: 새벽 3시의 신비로움, 차분하고 몽환적

## 개발 환경

- `dev-user-001` 토큰으로 자동 폴백 (토스 SDK 미지원 환경)
- Vite 프록시: `/api/*` → `localhost:8787` (CORS 문제 없이 개발)
- Zustand persist로 클라이언트 캐시 (진실 원본은 백엔드)

## 미구현 / 다음 단계

- [ ] 타로 카드 리딩 (50장 카드 데이터 + 선택 UI)
- [ ] 미션 완료 기능
- [ ] 다이어리 (운세 기록)
- [ ] QR 스캔 (실물 타로카드 연동)
- [ ] 토스 SDK 실 연동 (`@apps-in-toss/web-framework`)
- [ ] Cloudflare Pages 배포
- [ ] 결제/구독 기능

## 배포

- **플랫폼**: Cloudflare Pages (프론트) + Cloudflare Workers (백엔드)
- **상태**: 로컬 개발 환경 완성
- **마지막 업데이트**: 2026-06-01
