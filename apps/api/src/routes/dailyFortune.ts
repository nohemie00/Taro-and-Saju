import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getDailyColor } from '../utils/dailyColor';
import { getDailyMission, getDailyMissions } from '../utils/dailyMission';
import type { Element } from '@osaekwoon/shared';

type Bindings = {
  DB: D1Database;
};

type Variables = {
  tossUserKey: string;
};

const dailyFortuneRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- GET /api/daily-fortune ---
dailyFortuneRoute.get('/', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');
  const dateParam = c.req.query('date');
  const date = dateParam || getTodayString();

  // 날짜 형식 검증
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json(
      { error: '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)', code: 'VALIDATION_ERROR' },
      400
    );
  }

  // 사용자 조회
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = user.id as string;
  const weakestElement = user.weakest_element as Element;
  const birthDate = user.birth_date as string;
  const birthMonth = new Date(birthDate + 'T00:00:00').getMonth() + 1;

  // 캐시 확인
  const cached = await c.env.DB.prepare(
    'SELECT * FROM daily_fortunes WHERE user_id = ? AND date = ?'
  )
    .bind(userId, date)
    .first();

  if (cached) {
    return c.json({
      date: cached.date as string,
      colorName: cached.color_name as string,
      colorHex: cached.color_hex as string,
      missionText: cached.mission_text as string,
      missionId: (cached.mission_id as string) || null,
    });
  }

  // 새로 산출
  const { colorName, colorHex } = getDailyColor(weakestElement, birthMonth, date);
  const mission = getDailyMission(weakestElement, date);
  const now = Date.now();

  await c.env.DB.prepare(
    `INSERT INTO daily_fortunes (user_id, date, color_name, color_hex, mission_id, mission_text, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(userId, date, colorName, colorHex, mission.mission_id, mission.text, now)
    .run();

  return c.json({
    date,
    colorName,
    colorHex,
    missionText: mission.text,
    missionId: mission.mission_id,
  });
});

// --- GET /api/daily-fortune/missions (3단계 준비용 — 3개 미션 반환) ---
dailyFortuneRoute.get('/missions', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const weakestElement = user.weakest_element as Element;
  const today = getTodayString();
  const missions = getDailyMissions(weakestElement, today);

  return c.json({ date: today, missions });
});

export { dailyFortuneRoute };
