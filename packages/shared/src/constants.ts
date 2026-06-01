import type { Element } from './types';

export const ELEMENT_COLORS: Record<Element, { name: string; hex: string }> = {
  wood: { name: '청룡빛', hex: '#4A6FA5' },
  fire: { name: '주작빛', hex: '#C84B4B' },
  earth: { name: '황린빛', hex: '#E8B84A' },
  metal: { name: '백호빛', hex: '#F0EDE5' },
  water: { name: '현무빛', hex: '#2C2C3E' },
};

export const BIRTH_BRANCHES = [
  { value: '자', label: '자시 (23:00~01:00)' },
  { value: '축', label: '축시 (01:00~03:00)' },
  { value: '인', label: '인시 (03:00~05:00)' },
  { value: '묘', label: '묘시 (05:00~07:00)' },
  { value: '진', label: '진시 (07:00~09:00)' },
  { value: '사', label: '사시 (09:00~11:00)' },
  { value: '오', label: '오시 (11:00~13:00)' },
  { value: '미', label: '미시 (13:00~15:00)' },
  { value: '신', label: '신시 (15:00~17:00)' },
  { value: '유', label: '유시 (17:00~19:00)' },
  { value: '술', label: '술시 (19:00~21:00)' },
  { value: '해', label: '해시 (21:00~23:00)' },
  { value: 'unknown', label: '모름' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'female', label: '여성' },
  { value: 'male', label: '남성' },
  { value: 'none', label: '선택안함' },
] as const;

export const DESIGN_TOKENS = {
  colors: {
    bgTop: '#0F1028',
    bgBottom: '#2A1B4A',
    textPrimary: '#F5F0E1',
    textSecondary: '#A89FB8',
    accent: '#D4AF37',
    wood: '#4A6FA5',
    fire: '#C84B4B',
    earth: '#E8B84A',
    metal: '#F0EDE5',
    water: '#2C2C3E',
  },
  fonts: {
    body: 'Pretendard',
    display: 'Gowun Batang',
    numeric: 'Cormorant Garamond',
  },
} as const;
