import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { drawThreeCards, generateReadingMessage } from '../utils/cardDraw';
// id is AUTOINCREMENT — no UUID needed for card_readings
import type { Element } from '@osaekwoon/shared';

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

// --- GET /api/tarot/history --- 과거 리딩 조회
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

  const readings = await c.env.DB.prepare(
    'SELECT * FROM card_readings WHERE user_id = ? ORDER BY date DESC LIMIT 30'
  )
    .bind(user.id as string)
    .all();

  return c.json({
    readings: readings.results.map((r: Record<string, unknown>) => ({
      date: r.date as string,
      cards: JSON.parse(r.cards_json as string),
      readingText: r.reading_text as string,
      createdAt: r.created_at as number,
    })),
  });
});

export { tarotRoute };
