import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getDailyMissions } from '../utils/dailyMission';
import type { Element } from '@osaekwoon/shared';

type Bindings = { DB: D1Database };
type Variables = { tossUserKey: string };

const missionsRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- GET /api/missions/today --- 오늘의 3미션 + 완료 상태
missionsRoute.get('/today', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

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
  const today = getTodayString();
  const missions = getDailyMissions(weakestElement, today);

  // 오늘 완료된 미션 조회
  const completedRows = await c.env.DB.prepare(
    'SELECT mission_id, completed_at FROM mission_logs WHERE user_id = ? AND date = ?'
  )
    .bind(userId, today)
    .all();

  const completedMap: Record<string, number> = {};
  for (const row of completedRows.results) {
    completedMap[row.mission_id as string] = row.completed_at as number;
  }

  const missionsWithStatus = missions.map((m) => ({
    ...m,
    completed: !!completedMap[m.mission_id],
    completedAt: completedMap[m.mission_id] || null,
  }));

  const completedCount = missionsWithStatus.filter((m) => m.completed).length;

  return c.json({
    date: today,
    missions: missionsWithStatus,
    completedCount,
    totalCount: missions.length,
  });
});

// --- POST /api/missions/complete --- 미션 완료 처리
missionsRoute.post('/complete', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');
  const body = await c.req.json();
  const missionId = body.missionId as string;

  if (!missionId) {
    return c.json({ error: 'missionId가 필요합니다', code: 'VALIDATION_ERROR' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = user.id as string;
  const today = getTodayString();

  // 오늘의 미션인지 확인
  const weakestElement = user.weakest_element as Element;
  const todayMissions = getDailyMissions(weakestElement, today);
  const validMission = todayMissions.find((m) => m.mission_id === missionId);
  if (!validMission) {
    return c.json({ error: '오늘의 미션이 아닙니다', code: 'INVALID_MISSION' }, 400);
  }

  // 이미 완료된 미션인지 확인
  const existing = await c.env.DB.prepare(
    'SELECT id FROM mission_logs WHERE user_id = ? AND mission_id = ? AND date = ?'
  )
    .bind(userId, missionId, today)
    .first();

  if (existing) {
    return c.json({ error: '이미 완료한 미션이에요', code: 'ALREADY_COMPLETED' }, 409);
  }

  const now = Date.now();
  await c.env.DB.prepare(
    'INSERT INTO mission_logs (user_id, mission_id, date, completed_at) VALUES (?, ?, ?, ?)'
  )
    .bind(userId, missionId, today, now)
    .run();

  return c.json({
    success: true,
    missionId,
    completedAt: now,
  });
});

// --- POST /api/missions/uncomplete --- 미션 완료 취소
missionsRoute.post('/uncomplete', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');
  const body = await c.req.json();
  const missionId = body.missionId as string;

  if (!missionId) {
    return c.json({ error: 'missionId가 필요합니다', code: 'VALIDATION_ERROR' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!user) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = user.id as string;
  const today = getTodayString();

  await c.env.DB.prepare(
    'DELETE FROM mission_logs WHERE user_id = ? AND mission_id = ? AND date = ?'
  )
    .bind(userId, missionId, today)
    .run();

  return c.json({ success: true, missionId });
});

// --- GET /api/missions/history --- 최근 7일 미션 히스토리
missionsRoute.get('/history', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

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

  // 최근 7일 날짜 목록
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${dd}`);
  }

  // 7일간 완료 기록 조회
  const logs = await c.env.DB.prepare(
    `SELECT mission_id, date, completed_at FROM mission_logs
     WHERE user_id = ? AND date >= ?
     ORDER BY date DESC, completed_at ASC`
  )
    .bind(userId, days[days.length - 1])
    .all();

  const logMap: Record<string, string[]> = {};
  for (const row of logs.results) {
    const date = row.date as string;
    if (!logMap[date]) logMap[date] = [];
    logMap[date].push(row.mission_id as string);
  }

  const history = days.map((date) => {
    const missions = getDailyMissions(weakestElement, date);
    const completedIds = logMap[date] || [];
    return {
      date,
      totalCount: missions.length,
      completedCount: completedIds.length,
      missions: missions.map((m) => ({
        mission_id: m.mission_id,
        text: m.text,
        element: m.element,
        category: m.category,
        completed: completedIds.includes(m.mission_id),
      })),
    };
  });

  return c.json({ history });
});

export { missionsRoute };
