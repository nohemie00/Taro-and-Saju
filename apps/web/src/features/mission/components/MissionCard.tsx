import { motion } from 'framer-motion';
import type { MissionItem } from '@/shared/api/endpoints';

const ELEMENT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  wood: { icon: 'fas fa-leaf', color: '#4A6FA5', label: '목' },
  fire: { icon: 'fas fa-fire', color: '#C84B4B', label: '화' },
  earth: { icon: 'fas fa-mountain', color: '#E8B84A', label: '토' },
  metal: { icon: 'fas fa-gem', color: '#C0B8A8', label: '금' },
  water: { icon: 'fas fa-droplet', color: '#5B7BA0', label: '수' },
};

const CATEGORY_LABELS: Record<string, string> = {
  food: '음식',
  action: '행동',
  object: '소지품',
  place: '장소',
  mind: '마음',
};

interface Props {
  mission: MissionItem;
  index: number;
  onToggle: (missionId: string, completed: boolean) => void;
  isToggling: boolean;
}

export function MissionCard({ mission, index, onToggle, isToggling }: Props) {
  const elem = ELEMENT_CONFIG[mission.element] || ELEMENT_CONFIG.earth;
  const catLabel = CATEGORY_LABELS[mission.category] || mission.category;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`glass-card rounded-2xl p-4 transition-all duration-300 ${
        mission.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* 체크 버튼 */}
        <button
          onClick={() => onToggle(mission.mission_id, mission.completed)}
          disabled={isToggling}
          className="mt-0.5 flex-shrink-0"
        >
          <motion.div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              mission.completed
                ? 'border-gold bg-gold/20'
                : 'border-white/20 bg-transparent'
            }`}
            whileTap={{ scale: 0.85 }}
          >
            {mission.completed && (
              <motion.i
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                className="fas fa-check text-gold text-xs"
              />
            )}
          </motion.div>
        </button>

        {/* 미션 내용 */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-[1.6] transition-all duration-300 ${
              mission.completed
                ? 'text-lavender/50 line-through decoration-gold/30'
                : 'text-ivory'
            }`}
          >
            {mission.text}
          </p>

          {/* 태그 라인 */}
          <div className="flex items-center gap-2 mt-2">
            {/* 오행 뱃지 */}
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border"
              style={{
                color: elem.color,
                borderColor: `${elem.color}44`,
                backgroundColor: `${elem.color}11`,
              }}
            >
              <i className={`${elem.icon} text-[8px]`} />
              {elem.label}
            </span>

            {/* 카테고리 뱃지 */}
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-lavender/60">
              {catLabel}
            </span>

            {/* 소요 시간 */}
            {mission.duration_min > 0 && (
              <span className="text-[10px] text-lavender/40">
                ~{mission.duration_min}분
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
