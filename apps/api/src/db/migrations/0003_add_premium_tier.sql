-- 오색운 3단계: 프리미엄 티어 시스템
-- users 테이블에 tier 및 구독 관련 컬럼 추가

-- tier: 'free' | 'premium'
ALTER TABLE users ADD COLUMN tier TEXT DEFAULT 'free';

-- 프리미엄 만료 시점 (Unix timestamp ms, NULL이면 무료)
ALTER TABLE users ADD COLUMN premium_expires_at INTEGER DEFAULT NULL;

-- 프리미엄 구독 시작 시점
ALTER TABLE users ADD COLUMN premium_started_at INTEGER DEFAULT NULL;
