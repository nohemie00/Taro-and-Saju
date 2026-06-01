import type { Element } from '@osaekwoon/shared';

const STEM_TO_ELEMENT: readonly Element[] = [
  'wood',
  'wood',
  'fire',
  'fire',
  'earth',
  'earth',
  'metal',
  'metal',
  'water',
  'water',
] as const;

const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

export function calculateElements(
  birthDate: string,
  birthTime: string
): { elements: Record<Element, number>; weakestElement: Element } {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearStem = ((year - 4) % 10 + 10) % 10;
  const monthStem = (month - 1) % 10;
  const dayStem = (day - 1) % 10;

  const elements: Record<Element, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  elements[STEM_TO_ELEMENT[yearStem]] += 2;
  elements[STEM_TO_ELEMENT[monthStem]] += 3;
  elements[STEM_TO_ELEMENT[dayStem]] += 3;

  if (birthTime !== 'unknown') {
    const timeIndex = BRANCHES.indexOf(birthTime as (typeof BRANCHES)[number]);
    if (timeIndex >= 0) {
      const timeStem = timeIndex % 10;
      elements[STEM_TO_ELEMENT[timeStem]] += 2;
    }
  }

  const weakestElement = (
    Object.entries(elements) as [Element, number][]
  ).sort((a, b) => a[1] - b[1])[0][0];

  return { elements, weakestElement };
}
