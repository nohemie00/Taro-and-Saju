/**
 * 심화 리딩 엔진
 * 오행 상생/상극 관계 + 3카드 조합 시너지 분석
 */

// --- 오행 관계 ---

type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/**
 * 상생 (生): 서로 도와주는 관계
 * 목→화→토→금→수→목
 */
const SANGSAENG: Record<Element, Element> = {
  wood: 'fire',   // 목생화: 나무가 불을 키움
  fire: 'earth',  // 화생토: 불이 재가 되어 흙이 됨
  earth: 'metal', // 토생금: 흙 속에서 금속이 나옴
  metal: 'water', // 금생수: 금속이 차가워져 물이 맺힘
  water: 'wood',  // 수생목: 물이 나무를 키움
};

/**
 * 상극 (克): 서로 억제하는 관계
 * 목→토→수→화→금→목
 */
const SANGGEUK: Record<Element, Element> = {
  wood: 'earth',  // 목극토: 나무 뿌리가 흙을 뚫음
  earth: 'water', // 토극수: 흙이 물길을 막음
  water: 'fire',  // 수극화: 물이 불을 끔
  fire: 'metal',  // 화극금: 불이 금속을 녹임
  metal: 'wood',  // 금극목: 금속이 나무를 벰
};

const ELEMENT_KR: Record<Element, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

interface CardForAnalysis {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: string;
  element?: string;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string | null;
  orientation: 'upright' | 'reversed';
  position: string;
  positionLabel: string;
  saju_hint?: string;
  state?: string;
  yin_yang?: string;
  zodiac?: string;
}

interface ElementRelation {
  type: 'sangsaeng' | 'sanggeuk' | 'same' | 'neutral';
  from: Element;
  to: Element;
  description: string;
}

interface DeepReadingResult {
  /** 전체 종합 해석 */
  summary: string;
  /** 오행 관계 분석 */
  elementAnalysis: {
    relations: ElementRelation[];
    overallHarmony: 'very_good' | 'good' | 'neutral' | 'tension' | 'conflict';
    harmonyDescription: string;
  };
  /** 각 포지션별 심화 해석 */
  positionReadings: Array<{
    position: string;
    positionLabel: string;
    cardName: string;
    deepMeaning: string;
  }>;
  /** 카드 시너지 분석 */
  synergy: {
    pattern: string;
    description: string;
  };
  /** 오늘의 행동 조언 3가지 */
  actionAdvice: string[];
  /** 주의사항 */
  caution: string | null;
}

// --- 오행 관계 분석 ---

function analyzeElementRelation(el1: Element, el2: Element): ElementRelation {
  if (el1 === el2) {
    return {
      type: 'same',
      from: el1,
      to: el2,
      description: `같은 ${ELEMENT_KR[el1]} 기운이 중첩되어 그 성질이 강화됩니다.`,
    };
  }
  if (SANGSAENG[el1] === el2) {
    return {
      type: 'sangsaeng',
      from: el1,
      to: el2,
      description: `${ELEMENT_KR[el1]}이(가) ${ELEMENT_KR[el2]}을(를) 살려주는 상생(相生) 관계입니다. 자연스러운 흐름으로 서로를 돕습니다.`,
    };
  }
  if (SANGSAENG[el2] === el1) {
    return {
      type: 'sangsaeng',
      from: el2,
      to: el1,
      description: `${ELEMENT_KR[el2]}이(가) ${ELEMENT_KR[el1]}을(를) 살려주는 상생(相生) 관계입니다. 받는 쪽이 힘을 얻습니다.`,
    };
  }
  if (SANGGEUK[el1] === el2) {
    return {
      type: 'sanggeuk',
      from: el1,
      to: el2,
      description: `${ELEMENT_KR[el1]}이(가) ${ELEMENT_KR[el2]}을(를) 억누르는 상극(相剋) 관계입니다. 긴장과 변화의 에너지가 있습니다.`,
    };
  }
  if (SANGGEUK[el2] === el1) {
    return {
      type: 'sanggeuk',
      from: el2,
      to: el1,
      description: `${ELEMENT_KR[el2]}이(가) ${ELEMENT_KR[el1]}을(를) 억누르는 상극(相剋) 관계입니다. 저항하거나 조율이 필요합니다.`,
    };
  }
  return {
    type: 'neutral',
    from: el1,
    to: el2,
    description: `${ELEMENT_KR[el1]}과(와) ${ELEMENT_KR[el2]}은(는) 직접적 관계가 없어 독립적으로 작용합니다.`,
  };
}

function determineHarmony(relations: ElementRelation[]): {
  level: 'very_good' | 'good' | 'neutral' | 'tension' | 'conflict';
  description: string;
} {
  const counts = { sangsaeng: 0, sanggeuk: 0, same: 0, neutral: 0 };
  for (const r of relations) counts[r.type]++;

  if (counts.sangsaeng >= 2 || (counts.sangsaeng >= 1 && counts.same >= 1)) {
    return {
      level: 'very_good',
      description: '오행의 기운이 조화롭게 흐르고 있어요. 오늘은 무엇을 해도 순탄할 가능성이 높습니다. 자연의 순리에 따라 움직여보세요.',
    };
  }
  if (counts.sangsaeng >= 1 && counts.sanggeuk === 0) {
    return {
      level: 'good',
      description: '도와주는 기운이 있어 전반적으로 순조로운 흐름이에요. 작은 노력이 좋은 결실로 이어질 수 있습니다.',
    };
  }
  if (counts.sanggeuk >= 2) {
    return {
      level: 'conflict',
      description: '서로 부딪히는 기운이 강해요. 갈등이나 장애물을 마주할 수 있지만, 그 안에서 성장의 기회도 있습니다. 유연하게 대처하세요.',
    };
  }
  if (counts.sanggeuk >= 1) {
    return {
      level: 'tension',
      description: '약간의 긴장감이 있는 하루예요. 도전과 시련이 있을 수 있지만, 그것이 오히려 당신을 단련시킬 거예요.',
    };
  }
  return {
    level: 'neutral',
    description: '특별히 도와주거나 방해하는 기운 없이 평온한 흐름이에요. 스스로의 의지가 오늘의 방향을 결정합니다.',
  };
}

// --- 포지션별 심화 해석 ---

function generatePositionReading(card: CardForAnalysis): string {
  const meaning = card.orientation === 'upright'
    ? card.meaning_upright
    : (card.meaning_reversed || card.meaning_upright);

  const parts: string[] = [];

  // 기본 해석 확장
  if (card.position === 'mind') {
    parts.push(`지금 당신의 내면에는 "${card.keywords[0]}"의 에너지가 자리 잡고 있어요.`);
    if (card.orientation === 'reversed') {
      parts.push('이 에너지가 반전되어 나타나고 있어, 마음속 갈등이나 저항감이 느껴질 수 있어요.');
    } else {
      parts.push('이 에너지가 온전하게 흐르고 있어, 마음이 그 방향으로 자연스럽게 움직이고 있습니다.');
    }
  } else if (card.position === 'situation') {
    parts.push(`현재 당신을 둘러싼 상황에는 "${card.keywords[0]}"의 흐름이 작용하고 있어요.`);
    if (card.category === 'protection') {
      parts.push('보호의 카드가 상황 자리에 나왔으니, 외부의 압력이나 위협이 감지되고 있지만 동시에 그것을 막아줄 힘도 작동하고 있어요.');
    } else if (card.category === 'major') {
      parts.push('사신 카드가 상황 자리에 나온 것은 큰 흐름의 변화가 일어나고 있음을 뜻해요. 주변 환경이 크게 움직이고 있습니다.');
    }
  } else if (card.position === 'advice') {
    parts.push(`오늘 당신에게 필요한 것은 "${card.keywords[0]}"의 자세예요.`);
    if (card.orientation === 'reversed') {
      parts.push('역방향이 조언 자리에 나왔으니, "하지 않는 것"이 오히려 현명한 선택일 수 있어요. 멈추거나 물러서는 것도 지혜입니다.');
    } else {
      parts.push('순방향의 에너지를 따라가세요. 적극적으로 그 방향으로 움직이면 좋은 결과가 기다리고 있을 거예요.');
    }
  }

  // 사주 힌트 추가
  if (card.saju_hint) {
    parts.push(`사주의 관점에서 보면, ${card.saju_hint}.`);
  }

  // 오행 상태(왕/상/휴/수) 해석
  if (card.state) {
    const stateDesc: Record<string, string> = {
      wang: '기운이 가장 왕성한 시기를 나타내요. 지금의 에너지를 적극 활용하세요.',
      sang: '도움을 받는 시기예요. 주변의 지지와 협력을 받아들이세요.',
      hyu: '쉬어가는 시기예요. 무리하지 말고 충전하는 데 집중하세요.',
      su: '인내가 필요한 시기예요. 지금은 씨앗을 뿌리는 단계이니 조급해하지 마세요.',
    };
    if (stateDesc[card.state]) {
      parts.push(stateDesc[card.state]);
    }
  }

  return parts.join(' ');
}

// --- 시너지 패턴 ---

function analyzeSynergy(cards: CardForAnalysis[]): { pattern: string; description: string } {
  const categories = cards.map((c) => c.category);
  const orientations = cards.map((c) => c.orientation);

  // 모두 정방향
  if (orientations.every((o) => o === 'upright')) {
    return {
      pattern: '순풍(順風)',
      description: '세 장 모두 순방향! 모든 기운이 한 방향으로 흐르고 있어요. 오늘은 하고 싶은 일을 밀어붙여도 좋은 날이에요.',
    };
  }

  // 모두 역방향
  if (orientations.every((o) => o === 'reversed')) {
    return {
      pattern: '역류(逆流)',
      description: '세 장 모두 역방향이에요. 오늘은 무리하지 마세요. 쉬어가면서 내면을 돌아보는 시간으로 삼는 게 좋겠어요.',
    };
  }

  // 사신(major) 카드 포함
  if (categories.includes('major') && categories.includes('luck')) {
    return {
      pattern: '천운상합(天運相合)',
      description: '사신의 거대한 힘과 행운의 기운이 동시에 나타났어요! 극히 드문 조합으로, 오늘은 정말 특별한 날이 될 수 있어요.',
    };
  }

  if (categories.filter((c) => c === 'major').length >= 2) {
    return {
      pattern: '신수겹침(神獸重疊)',
      description: '사신 카드가 두 장 이상! 커다란 에너지가 교차하는 날이에요. 중요한 결정이나 전환점이 될 수 있습니다.',
    };
  }

  if (categories.includes('protection')) {
    return {
      pattern: '호신결계(護身結界)',
      description: '수호의 카드가 나왔어요. 오늘은 보이지 않는 보호막이 당신을 감싸고 있어요. 안심하고 하루를 보내세요.',
    };
  }

  if (categories.includes('luck')) {
    return {
      pattern: '복성임문(福星臨門)',
      description: '행운의 별이 당신의 문 앞에 와 있어요. 평소 안 되던 일도 술술 풀릴 수 있으니, 작은 기회도 놓치지 마세요.',
    };
  }

  // 기본: 오행 조합 기반
  const elements = cards.map((c) => c.element).filter(Boolean) as Element[];
  const uniqueElements = [...new Set(elements)];
  if (uniqueElements.length === 3) {
    return {
      pattern: '삼색조화(三色調和)',
      description: `세 가지 다른 오행(${uniqueElements.map((e) => ELEMENT_KR[e]).join(', ')})이 모여 다채로운 에너지를 만들고 있어요. 균형 잡힌 시각으로 하루를 보내세요.`,
    };
  }
  if (uniqueElements.length === 1 && elements.length >= 2) {
    return {
      pattern: '기운집중(氣運集中)',
      description: `${ELEMENT_KR[uniqueElements[0]]} 기운이 강하게 집중되어 있어요. 이 기운의 특성을 최대한 살리는 하루를 보내세요.`,
    };
  }

  return {
    pattern: '자연지리(自然之理)',
    description: '특별한 패턴 없이 자연스러운 조합이에요. 각 카드의 메시지를 하나씩 음미하며 하루를 보내세요.',
  };
}

// --- 행동 조언 생성 ---

function generateActionAdvice(cards: CardForAnalysis[], harmony: string): string[] {
  const advice: string[] = [];

  // 마음 카드 기반 조언
  const mindCard = cards.find((c) => c.position === 'mind');
  if (mindCard) {
    if (mindCard.orientation === 'reversed') {
      advice.push(`마음의 "${mindCard.keywords[0]}" 에너지가 막혀있어요. 5분만 눈을 감고 깊은 호흡을 해보세요.`);
    } else {
      advice.push(`"${mindCard.keywords[0]}"의 마음을 따라, 오전 중에 하고 싶었던 일 하나를 시작해보세요.`);
    }
  }

  // 상황 카드 기반 조언
  const situationCard = cards.find((c) => c.position === 'situation');
  if (situationCard) {
    if (situationCard.category === 'protection') {
      advice.push('오늘은 중요한 결정을 내일로 미루는 게 현명해요. 서두르지 마세요.');
    } else {
      advice.push(`주변의 "${situationCard.keywords[0]}" 흐름을 감지하세요. 그 안에 기회가 숨어있을 수 있어요.`);
    }
  }

  // 조언 카드 기반 조언
  const adviceCard = cards.find((c) => c.position === 'advice');
  if (adviceCard) {
    advice.push(`오늘 자기 전, "${adviceCard.keywords[0]}"에 대해 일기 한 줄을 써보세요. 내일의 당신에게 도움이 될 거예요.`);
  }

  return advice.slice(0, 3);
}

// --- 주의사항 ---

function generateCaution(cards: CardForAnalysis[], relations: ElementRelation[]): string | null {
  const reversedCount = cards.filter((c) => c.orientation === 'reversed').length;
  const sanggeukCount = relations.filter((r) => r.type === 'sanggeuk').length;

  if (reversedCount >= 2 && sanggeukCount >= 1) {
    return '역방향 카드와 상극 관계가 겹쳤어요. 오늘은 감정적인 결정을 피하고, 큰 약속이나 계약은 다른 날로 미루는 것이 좋겠어요.';
  }
  if (reversedCount === 3) {
    return '모든 카드가 역방향이에요. 무리하지 말고 충분히 쉬세요. 오늘의 에너지는 내면의 회복에 쓰는 것이 가장 좋습니다.';
  }
  if (sanggeukCount >= 2) {
    return '오행 간 충돌이 많은 날이에요. 대인관계에서 마찰이 있을 수 있으니, 한 박자 쉬고 말하는 습관을 들여보세요.';
  }

  return null;
}

// --- 메인 함수 ---

export function generateDeepReading(cards: CardForAnalysis[]): DeepReadingResult {
  // 오행이 있는 카드들로 관계 분석
  const elemCards = cards.filter((c) => c.element) as (CardForAnalysis & { element: Element })[];
  const relations: ElementRelation[] = [];

  for (let i = 0; i < elemCards.length; i++) {
    for (let j = i + 1; j < elemCards.length; j++) {
      relations.push(analyzeElementRelation(elemCards[i].element, elemCards[j].element));
    }
  }

  const harmony = determineHarmony(relations);

  // 포지션별 심화 해석
  const positionReadings = cards.map((card) => ({
    position: card.position,
    positionLabel: card.positionLabel,
    cardName: card.name_kr,
    deepMeaning: generatePositionReading(card),
  }));

  // 시너지 분석
  const synergy = analyzeSynergy(cards);

  // 행동 조언
  const actionAdvice = generateActionAdvice(cards, harmony.level);

  // 주의사항
  const caution = generateCaution(cards, relations);

  // 종합 요약
  const summary = buildSummary(cards, harmony.level, synergy.pattern);

  return {
    summary,
    elementAnalysis: {
      relations,
      overallHarmony: harmony.level,
      harmonyDescription: harmony.description,
    },
    positionReadings,
    synergy,
    actionAdvice,
    caution,
  };
}

function buildSummary(cards: CardForAnalysis[], harmony: string, pattern: string): string {
  const mindCard = cards.find((c) => c.position === 'mind');
  const adviceCard = cards.find((c) => c.position === 'advice');

  let text = '';

  if (harmony === 'very_good' || harmony === 'good') {
    text += '오늘의 카드들은 전반적으로 조화로운 흐름을 보여주고 있어요. ';
  } else if (harmony === 'conflict' || harmony === 'tension') {
    text += '오늘의 카드들 사이에 긴장감이 감지돼요. 하지만 긴장 속에서도 성장의 기회가 있어요. ';
  } else {
    text += '오늘의 카드들은 각각 독립적인 메시지를 전하고 있어요. ';
  }

  if (mindCard) {
    text += `마음 자리의 "${mindCard.name_kr}"은(는) 지금 내면에서 "${mindCard.keywords[0]}"을(를) 갈망하고 있음을 알려줍니다. `;
  }

  if (adviceCard) {
    text += `조언 자리의 "${adviceCard.name_kr}"은(는) "${adviceCard.keywords[0]}"의 자세로 하루를 마무리하라고 말하고 있어요.`;
  }

  return text;
}
