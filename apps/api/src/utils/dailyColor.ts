import type { Element } from '@osaekwoon/shared';

/**
 * 오색운 — 125가지 오늘의 컬러 시스템
 *
 * 5 base(오행) × 5 tone(시간대) × 5 texture(질감) = 125 조합
 */

const BASE_COLORS: Record<Element, { name: string; hue: number; sat: number }> = {
  wood:  { name: '청룡빛', hue: 215, sat: 38 },
  fire:  { name: '주작빛', hue: 0,   sat: 55 },
  earth: { name: '황린빛', hue: 42,  sat: 76 },
  metal: { name: '백호빛', hue: 45,  sat: 18 },
  water: { name: '현무빛', hue: 235, sat: 25 },
};

const TONE_VARIANTS = [
  { name: '새벽',   lightness: 65 },
  { name: '아침',   lightness: 70 },
  { name: '한낮',   lightness: 55 },
  { name: '노을',   lightness: 50 },
  { name: '깊은밤', lightness: 25 },
] as const;

const TEXTURE_VARIANTS = [
  { name: '맑은',   satMod: 15 },
  { name: '은은한', satMod: -10 },
  { name: '짙은',   satMod: 25 },
  { name: '옅은',   satMod: -20 },
  { name: '영롱한', satMod: 5 },
] as const;

/**
 * HSL → HEX 변환
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * 오늘의 컬러 산출
 *
 * @param weakestElement 부족한 오행
 * @param birthMonth 생월(1~12) → tone 결정
 * @param dateString YYYY-MM-DD → texture 결정
 */
export function getDailyColor(
  weakestElement: Element,
  birthMonth: number,
  dateString: string
): { colorName: string; colorHex: string; tone: string; texture: string; base: Element } {
  const base = BASE_COLORS[weakestElement] || BASE_COLORS.earth;

  // tone: 생월 기반 (1~12월 → 0~4 인덱스)
  const toneIdx = (birthMonth - 1) % 5;
  const tone = TONE_VARIANTS[toneIdx];

  // texture: 날짜 시드 기반
  const seed = dateString.split('-').reduce((s, n) => s + parseInt(n, 10), 0);
  const textureIdx = seed % 5;
  const texture = TEXTURE_VARIANTS[textureIdx];

  // 최종 색상 계산
  const finalSat = Math.max(5, Math.min(100, base.sat + texture.satMod));
  const finalHex = hslToHex(base.hue, finalSat, tone.lightness);

  return {
    colorName: `${tone.name} ${texture.name} ${base.name}`,
    colorHex: finalHex,
    tone: tone.name,
    texture: texture.name,
    base: weakestElement,
  };
}
