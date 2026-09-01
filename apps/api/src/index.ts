import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { usersRoute } from './routes/users';
import { dailyFortuneRoute } from './routes/dailyFortune';
import { tarotRoute } from './routes/tarot';
import { missionsRoute } from './routes/missions';
import { premiumRoute } from './routes/premium';

type Bindings = {
  DB: D1Database;
  ENV: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// --- Middleware ---
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: '*',
    credentials: false,
    allowHeaders: ['Content-Type', 'x-toss-user-key'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// --- Health Check ---
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', version: '3.0.0', phase: 3 });
});

// --- Routes ---
app.route('/api/users', usersRoute);
app.route('/api/daily-fortune', dailyFortuneRoute);
app.route('/api/tarot', tarotRoute);
app.route('/api/missions', missionsRoute);
app.route('/api/premium', premiumRoute);

// --- 404 Fallback ---
app.notFound((c) => {
  return c.json({ error: '요청한 리소스를 찾을 수 없습니다', code: 'NOT_FOUND' }, 404);
});

// --- Error Handler ---
app.onError((err, c) => {
  console.error('Server Error:', err);
  return c.json(
    { error: '서버 내부 오류가 발생했습니다', code: 'INTERNAL_ERROR' },
    500
  );
});

export default app;
