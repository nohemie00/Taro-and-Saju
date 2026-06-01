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

export interface User {
  id: string;
  tossUserKey: string;
  nickname: string;
  birthDate: string;
  birthTime: BirthBranch;
  gender: Gender;
  elements: Record<Element, number>;
  weakestElement: Element;
  createdAt: number;
  updatedAt: number;
}

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
