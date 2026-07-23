/**
 * 타로 카드 50장 이미지 URL 매핑
 * card_id → 워터마크 없는 이미지 URL
 * 
 * 스타일: Minimalist flat-vector, muted earth-tone, risograph texture,
 *         diamond frame, botanical motifs, modern bohemian tarot aesthetic
 */

export const CARD_IMAGE_URLS: Record<string, string> = {
  // ═══════════════════════════════════════
  // Major 10장 — 사신 + 황린
  // ═══════════════════════════════════════
  M01: 'https://www.genspark.ai/api/files/s/m1CGIIIS?cache_control=3600', // 청룡지양
  M02: 'https://www.genspark.ai/api/files/s/KOOs89aS?cache_control=3600', // 청룡지음
  M03: 'https://www.genspark.ai/api/files/s/pkSuiGC8?cache_control=3600', // 주작지양
  M04: 'https://www.genspark.ai/api/files/s/C9yoKIDy?cache_control=3600', // 주작지음
  M05: 'https://www.genspark.ai/api/files/s/oJqb28jF?cache_control=3600', // 백호지양
  M06: 'https://www.genspark.ai/api/files/s/5U6iS5EW?cache_control=3600', // 백호지음
  M07: 'https://www.genspark.ai/api/files/s/NkXsPEp3?cache_control=3600', // 현무지양
  M08: 'https://www.genspark.ai/api/files/s/QNe3SW3U?cache_control=3600', // 현무지음
  M09: 'https://www.genspark.ai/api/files/s/TxJO8scd?cache_control=3600', // 황린지양
  M10: 'https://www.genspark.ai/api/files/s/gcpjCiHp?cache_control=3600', // 황린지음

  // ═══════════════════════════════════════
  // Element 20장 — 오행 상태 (왕/상/휴/수)
  // ═══════════════════════════════════════
  // 목(木) — 나무
  E01: 'https://www.genspark.ai/api/files/s/E6Bh3TJi?cache_control=3600', // 목지왕
  E02: 'https://www.genspark.ai/api/files/s/Rjr8HcEY?cache_control=3600', // 목지상
  E03: 'https://www.genspark.ai/api/files/s/H7U7AP7v?cache_control=3600', // 목지휴
  E04: 'https://www.genspark.ai/api/files/s/Z5lciC1m?cache_control=3600', // 목지수
  // 화(火) — 불
  E05: 'https://www.genspark.ai/api/files/s/KmdjhNk5?cache_control=3600', // 화지왕
  E06: 'https://www.genspark.ai/api/files/s/aZjPDdLU?cache_control=3600', // 화지상
  E07: 'https://www.genspark.ai/api/files/s/mSpEV7ap?cache_control=3600', // 화지휴
  E08: 'https://www.genspark.ai/api/files/s/jOBpN7sf?cache_control=3600', // 화지수
  // 토(土) — 대지
  E09: 'https://www.genspark.ai/api/files/s/CvVpn1hW?cache_control=3600', // 토지왕
  E10: 'https://www.genspark.ai/api/files/s/wSD3vHE0?cache_control=3600', // 토지상
  E11: 'https://www.genspark.ai/api/files/s/2aMuw7SO?cache_control=3600', // 토지휴
  E12: 'https://www.genspark.ai/api/files/s/QFyAJUHH?cache_control=3600', // 토지수
  // 금(金) — 금속
  E13: 'https://www.genspark.ai/api/files/s/prqhRyGn?cache_control=3600', // 금지왕
  E14: 'https://www.genspark.ai/api/files/s/BBiA1D82?cache_control=3600', // 금지상
  E15: 'https://www.genspark.ai/api/files/s/ElMw3qrV?cache_control=3600', // 금지휴
  E16: 'https://www.genspark.ai/api/files/s/w0HiNogd?cache_control=3600', // 금지수
  // 수(水) — 물
  E17: 'https://www.genspark.ai/api/files/s/dznhLvOO?cache_control=3600', // 수지왕
  E18: 'https://www.genspark.ai/api/files/s/zFjMq5D0?cache_control=3600', // 수지상
  E19: 'https://www.genspark.ai/api/files/s/pq1TIaiQ?cache_control=3600', // 수지휴
  E20: 'https://www.genspark.ai/api/files/s/qjw6YfXg?cache_control=3600', // 수지수

  // ═══════════════════════════════════════
  // Zodiac 12장 — 12지
  // ═══════════════════════════════════════
  Z01: 'https://www.genspark.ai/api/files/s/b7yNYoYq?cache_control=3600', // 자서지령 (쥐)
  Z02: 'https://www.genspark.ai/api/files/s/mn9Q9qlk?cache_control=3600', // 축우지령 (소)
  Z03: 'https://www.genspark.ai/api/files/s/0OKtgtM1?cache_control=3600', // 인호지령 (호랑이)
  Z04: 'https://www.genspark.ai/api/files/s/ZjHgSNs3?cache_control=3600', // 묘토지령 (토끼)
  Z05: 'https://www.genspark.ai/api/files/s/aBa4Fk0S?cache_control=3600', // 진룡지령 (용)
  Z06: 'https://www.genspark.ai/api/files/s/i0hclEzV?cache_control=3600', // 사사지령 (뱀)
  Z07: 'https://www.genspark.ai/api/files/s/2KwL0Guy?cache_control=3600', // 오마지령 (말)
  Z08: 'https://www.genspark.ai/api/files/s/rj3mgAf9?cache_control=3600', // 미양지령 (양)
  Z09: 'https://www.genspark.ai/api/files/s/c5qZl4Pm?cache_control=3600', // 신원지령 (원숭이)
  Z10: 'https://www.genspark.ai/api/files/s/MpIy87OX?cache_control=3600', // 유계지령 (닭)
  Z11: 'https://www.genspark.ai/api/files/s/rx3nkWAR?cache_control=3600', // 술견지령 (개)
  Z12: 'https://www.genspark.ai/api/files/s/DoOsGR5Y?cache_control=3600', // 해저지령 (돼지)

  // ═══════════════════════════════════════
  // Protection 5장 — 수호
  // ═══════════════════════════════════════
  P01: 'https://www.genspark.ai/api/files/s/1LD23m98?cache_control=3600', // 액막이부
  P02: 'https://www.genspark.ai/api/files/s/nEwcZk4P?cache_control=3600', // 삼재방어
  P03: 'https://www.genspark.ai/api/files/s/rGVsjxn1?cache_control=3600', // 살풀이
  P04: 'https://www.genspark.ai/api/files/s/RwLJtwMB?cache_control=3600', // 구설막이
  P05: 'https://www.genspark.ai/api/files/s/3Z9a7KLn?cache_control=3600', // 재수발원

  // ═══════════════════════════════════════
  // Luck 3장 — 행운
  // ═══════════════════════════════════════
  L01: 'https://www.genspark.ai/api/files/s/fB0OAZ0w?cache_control=3600', // 대길운
  L02: 'https://www.genspark.ai/api/files/s/lPDxXXlK?cache_control=3600', // 귀인봉래
  L03: 'https://www.genspark.ai/api/files/s/pyftwXn1?cache_control=3600', // 천복강림
};

/**
 * card_id로 이미지 URL을 가져옵니다.
 * 없으면 null을 반환하여 fallback UI를 표시합니다.
 */
export function getCardImageUrl(cardId: string): string | null {
  return CARD_IMAGE_URLS[cardId] ?? null;
}
