import { Hono } from 'hono';
import { z } from 'zod';
import { calculateElements } from '../utils/saju';
import { generateUUID } from '../utils/uuid';
import { authMiddleware } from '../middleware/auth';
import type { Element, BirthBranch, Gender, UserTier } from '@osaekwoon/shared';

type Bindings = {
  DB: D1Database;
};

type Variables = {
  tossUserKey: string;
};

const usersRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// --- Zod Schemas ---

const createUserSchema = z.object({
  tossUserKey: z.string().min(1),
  nickname: z.string().min(1).max(10),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.enum([
    '자', '축', '인', '묘', '진', '사',
    '오', '미', '신', '유', '술', '해', 'unknown',
  ]),
  gender: z.enum(['female', 'male', 'none']),
});

const updateUserSchema = z.object({
  nickname: z.string().min(1).max(10).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  birthTime: z.enum([
    '자', '축', '인', '묘', '진', '사',
    '오', '미', '신', '유', '술', '해', 'unknown',
  ]).optional(),
  gender: z.enum(['female', 'male', 'none']).optional(),
});

// --- Helpers ---

/** 프리미엄 만료 체크: 기간이 지났으면 'free'로 다운그레이드 */
function resolvedTier(row: Record<string, unknown>): UserTier {
  const tier = (row.tier as string) || 'free';
  if (tier !== 'premium') return 'free';
  const expiresAt = row.premium_expires_at as number | null;
  if (expiresAt && Date.now() > expiresAt) return 'free';
  return 'premium';
}

function userRowToResponse(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    tossUserKey: row.toss_user_key as string,
    nickname: row.nickname as string,
    birthDate: row.birth_date as string,
    birthTime: row.birth_time as BirthBranch,
    gender: row.gender as Gender,
    elements: {
      wood: row.element_wood as number,
      fire: row.element_fire as number,
      earth: row.element_earth as number,
      metal: row.element_metal as number,
      water: row.element_water as number,
    },
    weakestElement: row.weakest_element as Element,
    tier: resolvedTier(row),
    premiumExpiresAt: (row.premium_expires_at as number) || null,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  };
}

// --- POST /api/users ---
usersRoute.post('/', async (c) => {
  const body = await c.req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: '입력값이 올바르지 않습니다', code: 'VALIDATION_ERROR' },
      400
    );
  }

  const { tossUserKey, nickname, birthDate, birthTime, gender } = parsed.data;

  // 중복 체크
  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (existing) {
    return c.json(
      { error: '이미 등록된 사용자입니다', code: 'USER_EXISTS' },
      409
    );
  }

  // 사주 오행 계산
  const { elements, weakestElement } = calculateElements(birthDate, birthTime);

  const id = generateUUID();
  const now = Date.now();

  await c.env.DB.prepare(
    `INSERT INTO users (id, toss_user_key, nickname, birth_date, birth_time, gender,
     element_wood, element_fire, element_earth, element_metal, element_water,
     weakest_element, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id, tossUserKey, nickname, birthDate, birthTime, gender,
      elements.wood, elements.fire, elements.earth, elements.metal, elements.water,
      weakestElement, now, now
    )
    .run();

  const user = {
    id,
    tossUserKey,
    nickname,
    birthDate,
    birthTime: birthTime as BirthBranch,
    gender: gender as Gender,
    elements,
    weakestElement,
    tier: 'free' as UserTier,
    premiumExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  };

  return c.json({ user, weakestElement, elements }, 201);
});

// --- GET /api/users/me ---
usersRoute.get('/me', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const row = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!row) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  return c.json({ user: userRowToResponse(row) });
});

// --- PATCH /api/users/me ---
usersRoute.patch('/me', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');
  const body = await c.req.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { error: '입력값이 올바르지 않습니다', code: 'VALIDATION_ERROR' },
      400
    );
  }

  const row = await c.env.DB.prepare(
    'SELECT * FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!row) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = row.id as string;
  const updates = parsed.data;
  const newNickname = updates.nickname ?? (row.nickname as string);
  const newBirthDate = updates.birthDate ?? (row.birth_date as string);
  const newBirthTime = updates.birthTime ?? (row.birth_time as string);
  const newGender = updates.gender ?? (row.gender as string);

  // 사주 정보 변경 여부 확인
  const sajuChanged =
    newBirthDate !== (row.birth_date as string) ||
    newBirthTime !== (row.birth_time as string);

  // 오행 재계산 (사주 변경 여부와 관계없이 항상 계산하여 일관성 보장)
  const { elements, weakestElement } = calculateElements(newBirthDate, newBirthTime);
  const now = Date.now();

  // users 테이블 업데이트
  await c.env.DB.prepare(
    `UPDATE users SET nickname = ?, birth_date = ?, birth_time = ?, gender = ?,
     element_wood = ?, element_fire = ?, element_earth = ?, element_metal = ?, element_water = ?,
     weakest_element = ?, updated_at = ?
     WHERE toss_user_key = ?`
  )
    .bind(
      newNickname, newBirthDate, newBirthTime, newGender,
      elements.wood, elements.fire, elements.earth, elements.metal, elements.water,
      weakestElement, now, tossUserKey
    )
    .run();

  // 중요: 오늘 날짜의 daily_fortunes 캐시 무효화
  // 사주가 바뀌면 오행이 달라지므로 오늘의 컬러도 반드시 재산출해야 함
  const today = new Date().toISOString().slice(0, 10);
  const deleteResult = await c.env.DB.prepare(
    'DELETE FROM daily_fortunes WHERE user_id = ? AND date = ?'
  )
    .bind(userId, today)
    .run();

  const user = {
    id: userId,
    tossUserKey,
    nickname: newNickname,
    birthDate: newBirthDate,
    birthTime: newBirthTime as BirthBranch,
    gender: newGender as Gender,
    elements,
    weakestElement,
    tier: resolvedTier(row),
    premiumExpiresAt: (row.premium_expires_at as number) || null,
    createdAt: row.created_at as number,
    updatedAt: now,
  };

  return c.json({ user, elements, weakestElement });
});

// --- DELETE /api/users/me ---
usersRoute.delete('/me', authMiddleware, async (c) => {
  const tossUserKey = c.get('tossUserKey');

  const row = await c.env.DB.prepare(
    'SELECT id FROM users WHERE toss_user_key = ?'
  )
    .bind(tossUserKey)
    .first();

  if (!row) {
    return c.json({ error: '사용자를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
  }

  const userId = row.id as string;

  // 관련 데이터 모두 삭제 (순서 중요: FK 참조 먼저)
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM daily_fortunes WHERE user_id = ?').bind(userId),
    c.env.DB.prepare('DELETE FROM card_readings WHERE user_id = ?').bind(userId),
    c.env.DB.prepare('DELETE FROM mission_logs WHERE user_id = ?').bind(userId),
    c.env.DB.prepare('DELETE FROM card_collections WHERE user_id = ?').bind(userId),
    c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId),
  ]);

  return c.json({ success: true, message: '모든 데이터가 삭제되었습니다' });
});

export { usersRoute };
