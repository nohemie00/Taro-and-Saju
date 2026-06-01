import { createMiddleware } from 'hono/factory';

type Env = {
  Variables: {
    tossUserKey: string;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const tossUserKey = c.req.header('x-toss-user-key');
  if (!tossUserKey) {
    return c.json({ error: '인증이 필요합니다', code: 'UNAUTHORIZED' }, 401);
  }
  c.set('tossUserKey', tossUserKey);
  await next();
});
