import type { Element } from '@osaekwoon/shared';
import missionsData from '../data/missions.json';

interface Mission {
  mission_id: string;
  category: string;
  element: string;
  text: string;
  duration_min: number;
}

const pool: Mission[] = missionsData.missions;

/**
 * 오늘의 미션 3개 선택
 *
 * 1번 미션: weakestElement 일치 미션 중 시드 기반 선택
 * 2번 미션: 다른 오행, 다른 카테고리
 * 3번 미션: 위 둘과 다른 카테고리에서 선택
 */
export function getDailyMissions(
  weakestElement: Element,
  dateString: string
): Mission[] {
  const seed = dateString.split('-').reduce((s, n) => s + parseInt(n, 10), 0);

  // 1번: weakestElement 일치
  const weakMatch = pool.filter((m) => m.element === weakestElement);
  const first = weakMatch[seed % weakMatch.length];

  // 2번: 다른 오행 + 다른 카테고리
  const otherElements: Element[] = (
    ['wood', 'fire', 'earth', 'metal', 'water'] as Element[]
  ).filter((e) => e !== weakestElement);
  const secondElement = otherElements[seed % otherElements.length];
  const secondPool = pool.filter(
    (m) => m.element === secondElement && m.category !== first.category
  );
  const second = secondPool[(seed * 7) % secondPool.length];

  // 3번: 사용하지 않은 카테고리에서 선택
  const usedCategories = [first.category, second.category];
  const usedIds = [first.mission_id, second.mission_id];
  const thirdPool = pool.filter(
    (m) => !usedCategories.includes(m.category) && !usedIds.includes(m.mission_id)
  );
  const third = thirdPool[(seed * 13) % thirdPool.length];

  console.log('[MISSION]', {
    weakestElement,
    dateString,
    selected: [first.mission_id, second.mission_id, third.mission_id],
  });

  return [first, second, third];
}

/**
 * 오늘의 대표 미션 1개 (기존 호환용)
 */
export function getDailyMission(
  weakestElement: Element,
  dateString: string
): Mission {
  return getDailyMissions(weakestElement, dateString)[0];
}
