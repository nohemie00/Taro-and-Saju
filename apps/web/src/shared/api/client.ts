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

function getApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // 개발 환경: Vite 프록시를 통해 같은 origin의 /api로 요청
  // Vite server.proxy 설정이 /api → localhost:8787로 프록시
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api';
  }
  return 'http://localhost:3000/api';
}

export const api = ky.create({
  prefixUrl: getApiBaseUrl(),
  headers: {
    'x-toss-user-key': tossUserKey,
  },
  timeout: 10000,
});

export { tossUserKey };
