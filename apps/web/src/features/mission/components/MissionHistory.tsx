import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionHistory } from '../hooks/useMission';
import type { HistoryDay } from '@/shared/api/endpoints';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function formatShortDate(dateStr: string): { dayNum: string; dayName: string; isToday: boolean } {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  return {
    dayNum: String(d.getDate()),
    dayName: DAY_NAMES[d.getDay()],
    isToday,
  };
}

export function MissionHistory() {
  const { data, isLoading } = useMissionHistory();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (isLoading || !data) return null;

  return (
    <div className="w-full">
      <h3 className="text-xs text-lavender/50 font-medium mb-3 px-1">최근 7일</h3>

      {/* 주간 달력 */}
      <div className="flex items-end justify-between gap-1 mb-4">
        {[...data.history].reverse().map((day) => {
          const { dayNum, dayName, isToday } = formatShortDate(day.date);
          const ratio = day.totalCount > 0 ? day.completedCount / day.totalCount : 0;
          const isSelected = expandedDate === day.date;

          return (
            <button
              key={day.date}
              onClick={() => setExpandedDate(isSelected ? null : day.date)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              {/* 요일 */}
              <span className={`text-[10px] ${isToday ? 'text-gold' : 'text-lavender/40'}`}>
                {dayName}
              </span>

              {/* 진행률 바 */}
              <div className="w-full h-16 bg-white/5 rounded-lg relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${ratio * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    background:
                      ratio === 1
                        ? 'linear-gradient(to top, #D4AF37, #D4AF3788)'
                        : ratio > 0
                        ? 'linear-gradient(to top, #D4AF3744, #D4AF3722)'
                        : 'transparent',
                  }}
                />
                {/* 숫자 */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-numeric text-ivory/60">
                  {day.completedCount}/{day.totalCount}
                </span>
              </div>

              {/* 날짜 */}
              <span
                className={`text-xs font-numeric ${
                  isToday
                    ? 'text-gold font-bold'
                    : isSelected
                    ? 'text-ivory'
                    : 'text-lavender/50'
                }`}
              >
                {dayNum}
              </span>

              {/* 완료 표시 */}
              {ratio === 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 확장 상세 */}
      <AnimatePresence>
        {expandedDate && (
          <ExpandedDay day={data.history.find((d) => d.date === expandedDate)!} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandedDay({ day }: { day: HistoryDay }) {
  const d = new Date(day.date + 'T00:00:00');
  const label = `${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-lavender/60 mb-3">
          {label} — {day.completedCount}/{day.totalCount} 완료
        </p>
        <div className="flex flex-col gap-2">
          {day.missions.map((m) => (
            <div key={m.mission_id} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  m.completed
                    ? 'border-gold/50 bg-gold/10'
                    : 'border-white/10 bg-transparent'
                }`}
              >
                {m.completed && <i className="fas fa-check text-gold text-[7px]" />}
              </div>
              <span
                className={`text-xs ${
                  m.completed ? 'text-lavender/50 line-through' : 'text-ivory/70'
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
