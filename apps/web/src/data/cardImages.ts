/**
 * 타로 카드 50장 이미지 URL 매핑
 * card_id → 로컬 static 에셋 경로
 * 
 * 스타일: Minimalist flat-vector, muted earth-tone, risograph texture,
 *         diamond frame, botanical motifs, modern bohemian tarot aesthetic
 * 
 * 이미지는 public/static/cards/ 에 저장되어 있으며
 * Vite dev server 및 Cloudflare Pages에서 /static/cards/ 경로로 제공됩니다.
 */

export const CARD_IMAGE_URLS: Record<string, string> = {
  // ═══════════════════════════════════════
  // Major 10장 — 사신 + 황린
  // ═══════════════════════════════════════
  M01: '/static/cards/M01.png', // 청룡지양
  M02: '/static/cards/M02.png', // 청룡지음
  M03: '/static/cards/M03.png', // 주작지양
  M04: '/static/cards/M04.png', // 주작지음
  M05: '/static/cards/M05.png', // 백호지양
  M06: '/static/cards/M06.png', // 백호지음
  M07: '/static/cards/M07.png', // 현무지양
  M08: '/static/cards/M08.png', // 현무지음
  M09: '/static/cards/M09.png', // 황린지양
  M10: '/static/cards/M10.png', // 황린지음

  // ═══════════════════════════════════════
  // Element 20장 — 오행 상태 (왕/상/휴/수)
  // ═══════════════════════════════════════
  // 목(木) — 나무
  E01: '/static/cards/E01.png', // 목지왕
  E02: '/static/cards/E02.png', // 목지상
  E03: '/static/cards/E03.png', // 목지휴
  E04: '/static/cards/E04.png', // 목지수
  // 화(火) — 불
  E05: '/static/cards/E05.png', // 화지왕
  E06: '/static/cards/E06.png', // 화지상
  E07: '/static/cards/E07.png', // 화지휴
  E08: '/static/cards/E08.png', // 화지수
  // 토(土) — 대지
  E09: '/static/cards/E09.png', // 토지왕
  E10: '/static/cards/E10.png', // 토지상
  E11: '/static/cards/E11.png', // 토지휴
  E12: '/static/cards/E12.png', // 토지수
  // 금(金) — 금속
  E13: '/static/cards/E13.png', // 금지왕
  E14: '/static/cards/E14.png', // 금지상
  E15: '/static/cards/E15.png', // 금지휴
  E16: '/static/cards/E16.png', // 금지수
  // 수(水) — 물
  E17: '/static/cards/E17.png', // 수지왕
  E18: '/static/cards/E18.png', // 수지상
  E19: '/static/cards/E19.png', // 수지휴
  E20: '/static/cards/E20.png', // 수지수

  // ═══════════════════════════════════════
  // Zodiac 12장 — 12지
  // ═══════════════════════════════════════
  Z01: '/static/cards/Z01.png', // 자서지령 (쥐)
  Z02: '/static/cards/Z02.png', // 축우지령 (소)
  Z03: '/static/cards/Z03.png', // 인호지령 (호랑이)
  Z04: '/static/cards/Z04.png', // 묘토지령 (토끼)
  Z05: '/static/cards/Z05.png', // 진룡지령 (용)
  Z06: '/static/cards/Z06.png', // 사사지령 (뱀)
  Z07: '/static/cards/Z07.png', // 오마지령 (말)
  Z08: '/static/cards/Z08.png', // 미양지령 (양)
  Z09: '/static/cards/Z09.png', // 신원지령 (원숭이)
  Z10: '/static/cards/Z10.png', // 유계지령 (닭)
  Z11: '/static/cards/Z11.png', // 술견지령 (개)
  Z12: '/static/cards/Z12.png', // 해저지령 (돼지)

  // ═══════════════════════════════════════
  // Protection 5장 — 수호
  // ═══════════════════════════════════════
  P01: '/static/cards/P01.png', // 액막이부
  P02: '/static/cards/P02.png', // 삼재방어
  P03: '/static/cards/P03.png', // 살풀이
  P04: '/static/cards/P04.png', // 구설막이
  P05: '/static/cards/P05.png', // 재수발원

  // ═══════════════════════════════════════
  // Luck 3장 — 행운
  // ═══════════════════════════════════════
  L01: '/static/cards/L01.png', // 대길운
  L02: '/static/cards/L02.png', // 귀인봉래
  L03: '/static/cards/L03.png', // 천복강림
};

/**
 * 카드 뒷면 이미지 URL
 * 오색운 브랜드 디자인 — midnight navy + gold, 五 중앙 모티프
 */
export const CARD_BACK_IMAGE_URL = '/static/cards/back.png';

/**
 * card_id로 이미지 URL을 가져옵니다.
 * 없으면 null을 반환하여 fallback UI를 표시합니다.
 */
export function getCardImageUrl(cardId: string): string | null {
  return CARD_IMAGE_URLS[cardId] ?? null;
}

export function getCardBackImageUrl(): string {
  return CARD_BACK_IMAGE_URL;
}
