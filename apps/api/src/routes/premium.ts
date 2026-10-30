import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
  /** Cloudflare secret. 형식: "CODE1:30,CODE2:7" (코드:부여일수, 쉼표 구분) */
  PROMO_CODES?: string;
};

const MAX_PROMO_DAYS = 365;

/** PROMO_CODES secret 파싱 → { CODE: days }. 잘못된 항목은 무시. */
function parsePromoCodes(raw: string | undefined): Record<string, number> {
  const result: Record<string, number> = {};
  if (!raw) return result;
  for (const entry of raw.split(',')) {
    const [code, days] = entry.split(':').map((v) => v?.trim());
    const n = Number(days);
    if (code && Number.isInteger(n) && n > 0 && n <= MAX_PROMO_DAYS) {
      result[code.toUpperCase()] = n;
    }
  }
  return result;
}
type Variables = { tossUserKey: string };

const premiumRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

/**
 * GET /api/premium/status — 프리미엄 상태 조회
 */
premiumRoute.get('/status', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT tier, premium_expires_at, premium_started_at FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const tier = (user.tier as string) || 'free';
  const expiresAt = user.premium_expires_at as number | null;
  const isPremium = tier === 'premium' && (!expiresAt || Date.now() <= expiresAt);

  return c.json({
    tier: isPremium ? 'premium' : 'free',
    isPremium,
    expiresAt: isPremium ? expiresAt : null,
    startedAt: isPremium ? (user.premium_started_at as number) : null,
  });
});

/**
 * POST /api/premium/activate — 프로모 코드로 프리미엄 활성화
 *
 * 결제 연동 전이므로 **프로모 코드로만** 활성화한다.
 * 코드 목록은 Cloudflare secret `PROMO_CODES`에서 읽는다 (코드/Git에 하드코딩 금지).
 * 향후 토스 결제 연동 시 서버 측 결제 검증을 거친 별도 경로로 확장.
 *
 * Body: { promoCode: string }
 */
premiumRoute.post('/activate', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  let body: { promoCode?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: '잘못된 요청입니다', code: 'INVALID_BODY' }, 400);
  }

  const promoCode =
    typeof body.promoCode === 'string' ? body.promoCode.trim().toUpperCase() : '';

  // 결제 연동 전: 프로모 코드 없는 활성화(durationDays 직접 지정 등)는 전부 거부
  if (!promoCode) {
    return c.json(
      { error: '프로모 코드가 필요합니다', code: 'PROMO_REQUIRED' },
      400
    );
  }

  const validPromoCodes = parsePromoCodes(c.env.PROMO_CODES);
  const grantDays = validPromoCodes[promoCode];
  if (!grantDays) {
    return c.json({ error: '유효하지 않은 프로모 코드입니다', code: 'INVALID_PROMO' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, tier, premium_expires_at FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = user.id as string;
  const now = Date.now();
  const currentExpires = user.premium_expires_at as number | null;

  // 기존 프리미엄이 남아 있으면 그 위에 연장
  const baseTime = currentExpires && currentExpires > now ? currentExpires : now;
  const newExpiresAt = baseTime + grantDays * 24 * 60 * 60 * 1000;

  await c.env.DB.prepare(
    `UPDATE users SET tier = 'premium', premium_expires_at = ?, premium_started_at = COALESCE(premium_started_at, ?), updated_at = ?
     WHERE id = ?`
  )
    .bind(newExpiresAt, now, now, userId)
    .run();

  return c.json({
    success: true,
    tier: 'premium',
    expiresAt: newExpiresAt,
    grantedDays: grantDays,
  });
});

export { premiumRoute };
