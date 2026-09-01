import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { drawThreeCards, generateReadingMessage } from '../utils/cardDraw';
import { generateDeepReading } from '../utils/deepReading';
// id is AUTOINCREMENT — no UUID needed for card_readings
import type { Element, UserTier } from '@osaekwoon/shared';
import { TIER_LIMITS } from '@osaekwoon/shared';

type Bindings = {
  DB: D1Database;
};

type Variables = {
  tossUserKey: string;
};

const tarotRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- GET /api/tarot/status --- 오늘 이미 리딩했는지 확인
tarotRoute.get('/status', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const today = getTodayString();
  const todayReading = await c.env.DB.prepare(
    'SELECT * FROM card_readings WHERE user_id = ? AND date = ?'
  )
    .bind(user.id as string, today)
    .first();

  if (todayReading) {
    return c.json({
      hasReadToday: true,
      todayReading: {
        date: todayReading.date as string,
        cards: JSON.parse(todayReading.cards_json as string),
        readingText: todayReading.reading_text as string,
        createdAt: todayReading.created_at as number,
      },
    });
  }

  return c.json({ hasReadToday: false, todayReading: null });
});

// --- POST /api/tarot/draw --- 3카드 뽑기
tarotRoute.post('/draw', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const today = getTodayString();
  const userId = user.id as string;

  // 하루 1회 제한 체크
  const existing = await c.env.DB.prepare(
    'SELECT * FROM card_readings WHERE user_id = ? AND date = ?'
  )
    .bind(userId, today)
    .first();

  if (existing) {
    return c.json(
      {
        error: '오늘은 이미 카드를 뽑으셨어요',
        code: 'ALREADY_READ_TODAY',
        existing: {
          date: existing.date as string,
          cards: JSON.parse(existing.cards_json as string),
          readingText: existing.reading_text as string,
        },
      },
      409
    );
  }

  const birthYear = new Date((user.birth_date as string) + 'T00:00:00').getFullYear();
  const weakestElement = user.weakest_element as Element;
  const nickname = user.nickname as string;

  const drawnCards = drawThreeCards(weakestElement, birthYear);
  const readingMessage = generateReadingMessage(drawnCards, nickname);

  const now = Date.now();

  await c.env.DB.prepare(
    `INSERT INTO card_readings (user_id, date, card_ids, reading_text, cards_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      userId,
      today,
      drawnCards.map((c) => c.card_id).join(','),
      readingMessage,
      JSON.stringify(drawnCards),
      now
    )
    .run();

  return c.json({
    date: today,
    cards: drawnCards,
    readingMessage,
    nickname,
  });
});

// --- GET /api/tarot/history --- 과거 리딩 조회 (무료: 3일, 프리미엄: 30일)
tarotRoute.get('/history', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  // 티어에 따른 히스토리 제한
  const tier = ((user.tier as string) || 'free') as UserTier;
  const expiresAt = user.premium_expires_at as number | null;
  const isPremium = tier === 'premium' && (!expiresAt || Date.now() <= expiresAt);
  const limits = TIER_LIMITS[isPremium ? 'premium' : 'free'];

  const readings = await c.env.DB.prepare(
    `SELECT * FROM card_readings WHERE user_id = ? ORDER BY date DESC LIMIT ?`
  )
    .bind(user.id as string, limits.tarotHistoryDays)
    .all();

  return c.json({
    readings: readings.results.map((r: Record<string, unknown>) => ({
      date: r.date as string,
      cards: JSON.parse(r.cards_json as string),
      readingText: r.reading_text as string,
      createdAt: r.created_at as number,
    })),
    tier: isPremium ? 'premium' : 'free',
    maxDays: limits.tarotHistoryDays,
  });
});

// --- POST /api/tarot/deep-reading --- 심화 리딩 (오행 분석 + 시너지) [프리미엄]
tarotRoute.post('/deep-reading', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  // 프리미엄 체크
  const tier = ((user.tier as string) || 'free') as UserTier;
  const expiresAt = user.premium_expires_at as number | null;
  const isPremium = tier === 'premium' && (!expiresAt || Date.now() <= expiresAt);
  const limits = TIER_LIMITS[isPremium ? 'premium' : 'free'];

  if (!limits.deepReadingEnabled) {
    return c.json({
      error: '심화 리딩은 프리미엄 기능입니다',
      code: 'PREMIUM_REQUIRED',
      feature: 'deep_reading',
    }, 403);
  }

  const today = getTodayString();
  const todayReading = await c.env.DB.prepare(
    'SELECT * FROM card_readings WHERE user_id = ? AND date = ?'
  )
    .bind(user.id as string, today)
    .first();

  if (!todayReading) {
    return c.json(
      { error: '오늘의 리딩이 없습니다. 먼저 카드를 뽑아주세요.', code: 'NO_READING' },
      400
    );
  }

  const cards = JSON.parse(todayReading.cards_json as string);
  const deepReading = generateDeepReading(cards);

  return c.json({
    date: today,
    cards,
    deepReading,
  });
});

export { tarotRoute };
