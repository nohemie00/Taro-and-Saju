export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type BirthBranch =
  | '자'
  | '축'
  | '인'
  | '묘'
  | '진'
  | '사'
  | '오'
  | '미'
  | '신'
  | '유'
  | '술'
  | '해'
  | 'unknown';

export type Gender = 'female' | 'male' | 'none';
export type UserTier = 'free' | 'premium';

export interface User {
  id: string;
  tossUserKey: string;
  nickname: string;
  birthDate: string;
  birthTime: BirthBranch;
  gender: Gender;
  elements: Record<Element, number>;
  weakestElement: Element;
  tier: UserTier;
  premiumExpiresAt: number | null;
  createdAt: number;
  updatedAt: number;
}

// ─── 프리미엄 티어 ───

export const TIER_LIMITS = {
  free: {
    tarotHistoryDays: 3,
    missionHistoryDays: 3,
    deepReadingEnabled: false,
  },
  premium: {
    tarotHistoryDays: 30,
    missionHistoryDays: 7,
    deepReadingEnabled: true,
  },
} as const;

export interface DailyFortune {
  date: string;
  colorName: string;
  colorHex: string;
  missionText: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface CreateUserRequest {
  tossUserKey: string;
  nickname: string;
  birthDate: string;
  birthTime: BirthBranch;
  gender: Gender;
}

export interface UpdateUserRequest {
  nickname?: string;
  birthDate?: string;
  birthTime?: BirthBranch;
  gender?: Gender;
}

export interface CreateUserResponse {
  user: User;
  weakestElement: Element;
  elements: Record<Element, number>;
}

// ─── 카드 (Tarot Card) ───

export type CardCategory = 'major' | 'element' | 'zodiac' | 'protection' | 'luck';
export type CardOrientation = 'upright' | 'reversed';

/** cards.json에 정의된 카드 원본 데이터 */
export interface CardData {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: CardCategory;
  element: Element;
  yin_yang?: 'yin' | 'yang';
  state?: string;              // Element 카드의 상태 (wang/sang/hyu/su)
  color_hex: string;
  color_name?: string;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string;
  saju_hint: string;
  is_holographic: boolean;
  draw_weight: number;
}

/** API에서 반환하는 드로우된 카드 (position 정보 포함) */
export interface DrawnCard extends CardData {
  orientation: CardOrientation;
  position: string;            // 'past' | 'present' | 'future'
  positionLabel: string;       // '과거' | '현재' | '미래'
}

/** 타로 히스토리에서 사용하는 간략 카드 */
export interface HistoryCard {
  card_id: string;
  name_kr: string;
  element: Element;
  orientation: CardOrientation;
  position: string;
  positionLabel: string;
  color_hex: string;
  keywords: string[];
}
