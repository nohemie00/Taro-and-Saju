import type { Element } from '@osaekwoon/shared';
import cardsData from '../data/cards.json';

interface Card {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: string;
  element?: string;
  yin_yang?: string;
  color_hex: string;
  color_name?: string;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string | null;
  saju_hint?: string;
  is_holographic: boolean;
  draw_weight: number;
  is_reversible?: boolean;
  special_effect?: string;
  special_message?: string;
  linked_missions?: string[];
  zodiac?: string;
  branch?: string;
  direction?: string;
  state?: string;
}

interface WeightedCard extends Card {
  finalWeight: number;
}

export interface DrawnCard extends Card {
  orientation: 'upright' | 'reversed';
  position: 'mind' | 'situation' | 'advice';
  positionLabel: string;
  finalWeight: number;
}

const cards: Card[] = cardsData.cards as Card[];

/**
 * 사주 가중치 적용한 카드 풀 생성
 */
function getWeightedPool(weakestElement: Element, userZodiac: string): WeightedCard[] {
  return cards.map((card) => {
    let weight = card.draw_weight;
    // 약한 오행 카드 +20%
    if (card.element === weakestElement) weight *= 1.2;
    // 사용자 띠와 일치하는 십이지 카드 +30%
    if (card.zodiac && card.zodiac === userZodiac) weight *= 1.3;
    // 행운 카드는 기본 0.01 유지 (매우 희박)
    return { ...card, finalWeight: weight };
  });
}

/**
 * 가중치 기반 카드 1장 추첨
 */
function pickOne(pool: WeightedCard[], excludeIds: string[] = []): WeightedCard {
  const available = pool.filter((c) => !excludeIds.includes(c.card_id));
  const totalWeight = available.reduce((s, c) => s + c.finalWeight, 0);
  let random = Math.random() * totalWeight;
  for (const card of available) {
    random -= card.finalWeight;
    if (random <= 0) return card;
  }
  return available[available.length - 1];
}

/**
 * 정/역방향 결정 (행운 카드는 항상 정방향)
 */
function determineOrientation(card: Card): 'upright' | 'reversed' {
  if (card.is_reversible === false) return 'upright';
  return Math.random() < 0.7 ? 'upright' : 'reversed';
}

/**
 * 생년 → 띠 변환
 */
export function getZodiacFromBirthYear(year: number): string {
  const zodiacs = [
    'monkey', 'rooster', 'dog', 'pig', 'rat', 'ox',
    'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat',
  ];
  return zodiacs[year % 12];
}

/**
 * 3카드 리딩 추첨
 */
export function drawThreeCards(weakestElement: Element, birthYear: number): DrawnCard[] {
  const userZodiac = getZodiacFromBirthYear(birthYear);
  const pool = getWeightedPool(weakestElement, userZodiac);

  const card1 = pickOne(pool);
  const card2 = pickOne(pool, [card1.card_id]);
  const card3 = pickOne(pool, [card1.card_id, card2.card_id]);

  const positions: Array<{ position: 'mind' | 'situation' | 'advice'; label: string }> = [
    { position: 'mind', label: '마음' },
    { position: 'situation', label: '상황' },
    { position: 'advice', label: '조언' },
  ];

  const result: DrawnCard[] = [card1, card2, card3].map((card, i) => ({
    ...card,
    orientation: determineOrientation(card),
    position: positions[i].position,
    positionLabel: positions[i].label,
  }));

  console.log('[TAROT]', {
    weakestElement,
    userZodiac,
    drawn: result.map((c) => `${c.card_id}(${c.orientation})`),
  });

  return result;
}

/**
 * 종합 리딩 메시지 생성 (3장 결합)
 */
export function generateReadingMessage(drawnCards: DrawnCard[], nickname: string): string {
  const hasLuck = drawnCards.some((c) => c.category === 'luck');
  const hasMajor = drawnCards.some((c) => c.category === 'major');
  const hasProtection = drawnCards.some((c) => c.category === 'protection');

  let intro = `${nickname}님의 오늘은`;

  if (hasLuck) {
    intro += ' 특별한 행운이 깃든 날이에요. 평소보다 더 적극적으로 움직여보세요.';
  } else if (hasMajor && hasProtection) {
    intro += ' 변화와 보호가 함께 있는 날이에요. 새로운 일을 시작하되 신중하게.';
  } else if (hasMajor) {
    intro += ' 중요한 흐름이 움직이는 날이에요. 자신의 직관을 믿으세요.';
  } else if (hasProtection) {
    intro += ' 잠시 몸을 낮추는 게 좋은 날이에요. 큰 결정은 미루세요.';
  } else {
    intro += ' 잔잔하지만 의미 있는 하루가 될 거예요. 작은 변화에 주의를 기울여보세요.';
  }

  return intro;
}
