import type { Element } from '@osaekwoon/shared';

const COLOR_MAP: Record<Element, { name: string; hex: string }> = {
  wood: { name: '청룡빛', hex: '#4A6FA5' },
  fire: { name: '주작빛', hex: '#C84B4B' },
  earth: { name: '황린빛', hex: '#E8B84A' },
  metal: { name: '백호빛', hex: '#F0EDE5' },
  water: { name: '현무빛', hex: '#2C2C3E' },
};

const VARIANTS = ['연한 ', '깊은 ', '맑은 ', '은은한 ', ''] as const;

const MISSIONS: Record<Element, string[]> = {
  wood: [
    '아침에 따뜻한 녹차 한 잔으로 하루를 여세요',
    '동쪽 창가에서 5분간 햇볕을 쬐세요',
    '초록색 물건을 가방에 넣어보세요',
    '산책하며 나무 한 그루를 안아보세요',
    '오늘은 채소 위주의 식사를 해보세요',
  ],
  fire: [
    '오늘 점심엔 따뜻한 차 한 잔. 액운이 김과 함께 빠져나갑니다',
    '거울 보고 한 번 환하게 웃어주세요',
    '빨간색 양말이나 속옷을 입어보세요',
    '오늘 하루 긍정 확언을 세 번 외쳐보세요',
    '좋아하는 노래를 크게 틀고 기분을 올려보세요',
  ],
  earth: [
    '지갑에 노란 종이를 넣어두세요',
    '맨발로 1분간 바닥을 느껴보세요',
    '오늘은 흙이 보이는 곳을 걸어보세요',
    '따뜻한 미숫가루 한 잔을 마셔보세요',
    '감사 일기를 세 줄 적어보세요',
  ],
  metal: [
    '현관 앞에 굵은 소금 한 줌을 두세요',
    '오래된 물건 하나를 비우거나 나눠주세요',
    '은색이나 흰색 액세서리를 착용해보세요',
    '오늘은 정리정돈으로 마음을 가볍게 해보세요',
    '깊은 숨을 열 번 천천히 쉬어보세요',
  ],
  water: [
    '오늘은 물을 평소보다 한 컵 더 마시세요',
    '잠들기 전 노란 포스트잇에 걱정 한 줄 적고 버리기',
    '검은색 돌멩이를 주머니에 넣어보세요',
    '흐르는 물소리를 5분간 들어보세요',
    '오늘 밤은 평소보다 30분 일찍 잠자리에 들어보세요',
  ],
};

function dateSeed(dateString: string): number {
  return dateString.split('-').reduce((sum, n) => sum + parseInt(n, 10), 0);
}

export function getDailyColor(
  weakestElement: Element,
  dateString: string
): { colorName: string; colorHex: string } {
  const seed = dateSeed(dateString);
  const prefix = VARIANTS[seed % VARIANTS.length];
  const base = COLOR_MAP[weakestElement] || COLOR_MAP.earth;
  return {
    colorName: prefix + base.name,
    colorHex: base.hex,
  };
}

export function getDailyMission(weakestElement: Element, dateString: string): string {
  const pool = MISSIONS[weakestElement] || MISSIONS.earth;
  const seed = dateSeed(dateString);
  return pool[seed % pool.length];
}
