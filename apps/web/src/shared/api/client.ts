import ky from 'ky';

// 토스 미니앱 환경에서는 appBridge.getUserKey()를 사용
// 개발 환경에서는 'dev-user-001' 폴백
function getTossUserKey(): string {
  try {
    // @apps-in-toss/web-framework가 실제 설치된 환경에서는
    // const { appBridge } = await import('@apps-in-toss/web-framework');
    // return await appBridge.getUserKey();
    return 'dev-user-001';
  } catch {
    return 'dev-user-001';
  }
}

const tossUserKey = getTossUserKey();

export const api = ky.create({
  prefixUrl: '/api',
  headers: {
    'x-toss-user-key': tossUserKey,
  },
  timeout: 10000,
});

export { tossUserKey };
