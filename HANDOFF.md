# 오색운(五色運) — 작업 인수인계 (2026-10-30)

새 작업 창에서 이 문서를 먼저 읽고 이어서 작업한다.

## 프로젝트 개요
- 사주 오행 + 타로를 결합한 **토스 미니앱** (한국어)
- GitHub: https://github.com/nohemie00/Taro-and-Saju (branch `main`)
- 프로덕션: https://osaekwoon.pages.dev (Cloudflare Pages, **BYOK = 사용자 본인 CF 계정**)
- Cloudflare 계정: nohemie2525@gmail.com / Pages 프로젝트명 `osaekwoon`
- D1: `osaekwoon-db` (ID `acd296cb-1dcc-4835-8ab6-e0b81a0e71c8`), 마이그레이션 0001~0003 원격 적용 완료, 실제 사용자 0명

## 구조 (pnpm 모노레포)
- `apps/web` — React 18 + Vite + React Router + React Query + Zustand + framer-motion + Tailwind
- `apps/api` — Hono 4 (Cloudflare Workers) + D1 raw SQL
- `packages/shared` — 공용 타입/상수 (`UserTier`, `TIER_LIMITS` 등)
- `scripts/build-pages.mjs` — Vite 빌드 → esbuild로 API를 `deploy/_worker.js`로 번들 → `_routes.json`(`/api/*` → Worker)
- 루트 `wrangler.toml` — Pages 설정 + D1 바인딩 `DB`

## 빌드 / 배포 / 로컬 미리보기
```bash
# 배포 (먼저 setup_cloudflare_api_key 도구 호출 필요, wrangler login 금지)
cd /home/user/webapp && node scripts/build-pages.mjs
npx wrangler pages deploy deploy --project-name osaekwoon --branch main

# 원격 DB 조회
npx wrangler d1 execute osaekwoon-db --remote --command="SELECT ..."

# 로컬 미리보기 (주의: --d1 플래그 쓰지 말 것 → wrangler.toml 바인딩 사용)
for f in apps/api/src/db/migrations/*.sql; do npx wrangler d1 execute osaekwoon-db --local --file=$f; done
npx wrangler pages dev deploy --ip 0.0.0.0 --port 3000   # PM2로 실행
```

## 완료된 것
- 프로덕션 배포 + D1 연결, 개인정보처리방침(`/privacy`) / 이용약관(`/terms`)
- 프리미엄 티어 (커밋 `966c03e`)
  - API: `GET /api/premium/status`, `POST /api/premium/activate`(프로모 코드), 심화 리딩 무료 사용자 403 `PREMIUM_REQUIRED`, 타로 히스토리(무료 3 / 프리미엄 30), 미션 히스토리(무료 3일 / 프리미엄 7일)
  - Web: `usePremium` 훅, `PremiumModal`, 심화 리딩 버튼 게이트, 히스토리 업그레이드 배너, 프로필 PREMIUM 배지

## 남은 할 일 (우선순위 순)
1. **[버그] PremiumModal 버튼 잘림** — `apps/web/src/shared/components/PremiumModal.tsx`. `-translate-y-1/2`가 framer-motion transform에 덮여 모달이 아래로 밀림 → flex 중앙 정렬 래퍼로 변경 필요
2. **[버그] "미션 참여일" 오류** — `ProfileScreen.tsx`가 `history.length`(조회 기간)를 표시. `completedCount > 0`인 날만 세야 함
3. **[보안] 프리미엄 무료 활성화 구멍** — `apps/api/src/routes/premium.ts`에서 promoCode 없이 `durationDays`만 보내도 활성화됨 → 결제 연동 전까지 거부
4. **[보안] 프로모 코드 하드코딩** (`OSAEKWOON2026`, `PREMIUM7`, `PREMIUM30`) → Cloudflare secret으로 이동
5. **[기능] Claude 심화 리딩** — 사용자가 Anthropic API 키 준비됨 (아직 미등록).
   - 계획: 규칙 엔진(`apps/api/src/utils/deepReading.ts`)의 오행 분석은 유지, Claude는 문장만 생성, 응답 형식(`DeepReadingResult`) 동일 유지
   - 사용자당 하루 1회 → D1 캐시(마이그레이션 0004), 실패 시 규칙 엔진으로 폴백, 서비스 전체 일일 호출 상한, Haiku 계열 추천
   - 키는 `ANTHROPIC_API_KEY` 이름의 Pages secret으로 등록 (코드/Git에 절대 넣지 않음)
   - 현재 템플릿 문장 문제: 조사 `은(는)`, `을(를)` 노출, 같은 오행 관계 문장 중복
6. **[공개 차단 요소] 토스 사용자 키** — `apps/web/src/shared/api/client.ts`가 `dev-user-001` 고정 → 모든 방문자가 같은 계정. `@apps-in-toss/web-framework` 연동 + 서버 측 검증 필요 (앱인토스 콘솔 정보 필요)
7. GitHub 저장소 공개 여부 확인 (CLI 인증 실패로 미확인)

## 사용자 선호
- 한국어로 소통, 단계별로 확인 후 진행
