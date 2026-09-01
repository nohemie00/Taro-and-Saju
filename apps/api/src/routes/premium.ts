import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };
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
 * POST /api/premium/activate — 프리미엄 활성화
 * 
 * 현재는 결제 연동 전이므로, 프로모션/쿠폰 방식으로 활성화.
 * 향후 토스 결제 API 연동 시 이 엔드포인트를 확장.
 * 
 * Body: { durationDays: number, promoCode?: string }
 */
premiumRoute.post('/activate', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');
  const body = await c.req.json();
  const durationDays = (body.durationDays as number) || 30;
  const promoCode = body.promoCode as string | undefined;

  // 프로모 코드 검증 (향후 확장 가능)
  const validPromoCodes: Record<string, number> = {
    'OSAEKWOON2026': 30,    // 30일 무료 체험
    'PREMIUM7': 7,           // 7일 체험
    'PREMIUM30': 30,         // 30일
  };

  let grantDays = 0;
  if (promoCode && validPromoCodes[promoCode]) {
    grantDays = validPromoCodes[promoCode];
  } else if (!promoCode) {
    // 프로모 코드 없이 직접 활성화 (향후 결제 연동)
    grantDays = durationDays;
  } else {
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
