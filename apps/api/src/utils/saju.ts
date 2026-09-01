import type { Element } from '@osaekwoon/shared';

/**
 * 천간(天干) → 오행 매핑
 * 甲(0)=木, 乙(1)=木, 丙(2)=火, 丁(3)=火, 戊(4)=土
 * 己(5)=土, 庚(6)=金, 辛(7)=金, 壬(8)=水, 癸(9)=水
 */
const STEM_TO_ELEMENT: readonly Element[] = [
  'wood', 'wood', 'fire', 'fire', 'earth',
  'earth', 'metal', 'metal', 'water', 'water',
] as const;

/**
 * 지지(地支) → 오행 매핑
 * 子(0)=水, 丑(1)=土, 寅(2)=木, 卯(3)=木, 辰(4)=土, 巳(5)=火
 * 午(6)=火, 未(7)=土, 申(8)=金, 酉(9)=金, 戌(10)=土, 亥(11)=水
 */
const BRANCH_TO_ELEMENT: readonly Element[] = [
  'water', 'earth', 'wood', 'wood', 'earth', 'fire',
  'fire', 'earth', 'metal', 'metal', 'earth', 'water',
] as const;

const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

/**
 * 연주(年柱) 천간: (year - 4) % 10
 * 갑자년 기준 (기원전 2637년 또는 서기 4년이 甲子)
 */
function getYearStem(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/**
 * 연주(年柱) 지지: (year - 4) % 12
 */
function getYearBranch(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

/**
 * 월주(月柱) 천간: 연간(年干)에 따라 결정
 * 갑기(0,5)년 → 월천간 시작 丙(2), 을경(1,6)년 → 戊(4), ...
 * 공식: ((yearStem % 5) * 2 + 2 + (month - 1)) % 10
 */
function getMonthStem(yearStem: number, month: number): number {
  const base = ((yearStem % 5) * 2 + 2) % 10;
  return (base + (month - 1)) % 10;
}

/**
 * 월주(月柱) 지지: 1월=寅(2), 2월=卯(3), ..., 12월=丑(1)
 */
function getMonthBranch(month: number): number {
  return (month + 1) % 12;
}

/**
 * 일주(日柱) 천간: 줄리안 일수 기반 60갑자 순환
 * 기준점: 2000-01-07 = 甲子일 (갑자일)
 */
function getDayStemBranch(year: number, month: number, day: number): { stem: number; branch: number } {
  // 줄리안 데이 넘버 계산 (간략화)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 2000-01-07 (JDN 2451551) = 甲子(0)
  const offset = ((jdn - 2451551) % 60 + 60) % 60;
  return {
    stem: offset % 10,
    branch: offset % 12,
  };
}

/**
 * 오행(五行) 점수 계산
 *
 * 사주 팔자(四柱八字) 기반:
 * - 년주 천간/지지 (각 가중치 1)
 * - 월주 천간/지지 (각 가중치 1.5)
 * - 일주 천간/지지 (각 가중치 1.5)
 * - 시주 천간/지지 (각 가중치 1, 시간 모를 경우 생략)
 *
 * 최종 점수를 정수로 반올림하여 반환.
 * 가장 약한 오행(점수가 가장 낮은 것)이 보완해야 할 오행.
 * 점수가 동일하면 wood → fire → earth → metal → water 순서로 선택.
 */
export function calculateElements(
  birthDate: string,
  birthTime: string
): { elements: Record<Element, number>; weakestElement: Element } {

  const date = new Date(birthDate + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // --- 연주(年柱) ---
  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);

  // --- 월주(月柱) ---
  const monthStem = getMonthStem(yearStem, month);
  const monthBranch = getMonthBranch(month);

  // --- 일주(日柱) ---
  const { stem: dayStem, branch: dayBranch } = getDayStemBranch(year, month, day);


  // 가중치 부여된 점수 (float)
  const raw: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  // 년주: 가중치 1
  raw[STEM_TO_ELEMENT[yearStem]] += 1;
  raw[BRANCH_TO_ELEMENT[yearBranch]] += 1;

  // 월주: 가중치 1.5
  raw[STEM_TO_ELEMENT[monthStem]] += 1.5;
  raw[BRANCH_TO_ELEMENT[monthBranch]] += 1.5;

  // 일주: 가중치 1.5
  raw[STEM_TO_ELEMENT[dayStem]] += 1.5;
  raw[BRANCH_TO_ELEMENT[dayBranch]] += 1.5;

  // --- 시주(時柱) ---
  if (birthTime && birthTime !== 'unknown') {
    const timeIndex = BRANCHES.indexOf(birthTime as (typeof BRANCHES)[number]);
    if (timeIndex >= 0) {
      // 시주 천간: 일간(日干)에 따라 결정
      // 공식: ((dayStem % 5) * 2 + timeIndex) % 10
      const timeStem = ((dayStem % 5) * 2 + timeIndex) % 10;
      // 시주: 가중치 1
      raw[STEM_TO_ELEMENT[timeStem]] += 1;
      raw[BRANCH_TO_ELEMENT[timeIndex]] += 1;
    }
  }

  // 정수로 반올림
  const elements: Record<Element, number> = {
    wood: Math.round(raw.wood),
    fire: Math.round(raw.fire),
    earth: Math.round(raw.earth),
    metal: Math.round(raw.metal),
    water: Math.round(raw.water),
  };


  // 명시적 키 순서로 정렬 (객체 키 순서 의존 제거)
  const entries: [Element, number][] = [
    ['wood', elements.wood],
    ['fire', elements.fire],
    ['earth', elements.earth],
    ['metal', elements.metal],
    ['water', elements.water],
  ];

  // 가장 약한 오행 (값이 같으면 wood→fire→earth→metal→water 순)
  entries.sort((a, b) => a[1] - b[1]);
  const weakest = entries[0][0] as Element;


  return { elements, weakestElement: weakest };
}
