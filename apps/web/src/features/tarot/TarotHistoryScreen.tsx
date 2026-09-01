import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { CardImage } from './components/CardImage';
import { useTarotHistory } from './hooks/useTarot';
import type { HistoryCard } from '@osaekwoon/shared';

// --- Calendar Utilities ---

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

// Element color for small dots
const ELEMENT_DOT: Record<string, string> = {
  wood: 'bg-green-400',
  fire: 'bg-red-400',
  earth: 'bg-yellow-500',
  metal: 'bg-gray-300',
  water: 'bg-blue-400',
};

export function TarotHistoryScreen() {
  const navigate = useNavigate();
  const { data, isLoading } = useTarotHistory();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map: date → reading
  const readingMap = useMemo(() => {
    const m = new Map<string, (typeof data)['readings'][number]>();
    if (data?.readings) {
      for (const r of data.readings) {
        m.set(r.date, r);
      }
    }
    return m;
  }, [data]);

  // Navigate months
  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr = getTodayString();

  const calendarCells: Array<{ day: number | null; dateStr: string | null }> = [];
  // leading blanks
  for (let i = 0; i < firstDow; i++) calendarCells.push({ day: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateStr: ds });
  }

  const selectedReading = selectedDate ? readingMap.get(selectedDate) : null;

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col pb-24">
        {/* Header */}
        <header className="flex items-center px-4 pt-5 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-lavender active:text-ivory transition-colors"
            aria-label="뒤로가기"
          >
            <i className="fas fa-chevron-left text-lg" />
          </button>
          <h1 className="flex-1 text-center font-display text-lg text-gold pr-10">
            타로 히스토리
          </h1>
        </header>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-5">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-lavender"
              >
                <i className="fas fa-chevron-left text-xs" />
              </button>
              <h2 className="font-display text-base text-ivory">
                {viewYear}년 {MONTH_NAMES[viewMonth]}
              </h2>
              <button
                onClick={goNextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-lavender"
              >
                <i className="fas fa-chevron-right text-xs" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/5 rounded-2xl border border-white/5 p-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map((d, i) => (
                  <div
                    key={d}
                    className={`text-center text-[10px] font-medium py-1 ${
                      i === 0 ? 'text-red-400/70' : i === 6 ? 'text-blue-400/70' : 'text-lavender/50'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Date cells */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarCells.map((cell, idx) => {
                  if (cell.day === null) {
                    return <div key={`blank-${idx}`} className="aspect-square" />;
                  }
                  const hasReading = cell.dateStr ? readingMap.has(cell.dateStr) : false;
                  const isToday = cell.dateStr === todayStr;
                  const isSelected = cell.dateStr === selectedDate;
                  const reading = cell.dateStr ? readingMap.get(cell.dateStr) : null;

                  return (
                    <button
                      key={cell.dateStr}
                      onClick={() => setSelectedDate(hasReading ? cell.dateStr : null)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all relative ${
                        isSelected
                          ? 'bg-gold/20 border border-gold/40'
                          : hasReading
                          ? 'bg-white/5 hover:bg-white/10'
                          : ''
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isToday
                            ? 'text-gold font-bold'
                            : isSelected
                            ? 'text-gold'
                            : hasReading
                            ? 'text-ivory/90'
                            : 'text-lavender/30'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {/* Element dots for reading days */}
                      {hasReading && reading && (
                        <div className="flex gap-0.5 mt-0.5">
                          {reading.cards.slice(0, 3).map((card: HistoryCard, ci: number) => (
                            <div
                              key={ci}
                              className={`w-1 h-1 rounded-full ${ELEMENT_DOT[card.element] || 'bg-ivory/30'}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-lavender/50">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 목
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 화
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> 토
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> 금
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> 수
              </span>
            </div>

            {/* Stats */}
            <StatsBar readings={data?.readings || []} />

            {/* Selected Date Detail */}
            <AnimatePresence mode="wait">
              {selectedReading ? (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReadingCard reading={selectedReading} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <i className="fas fa-calendar-day text-2xl text-lavender/20 mb-3 block" />
                  <p className="text-sm text-lavender/40">
                    날짜를 선택하면 그 날의 리딩을 볼 수 있어요
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </GradientBackground>
  );
}

// --- Stats Bar ---
function StatsBar({ readings }: { readings: Array<{ cards: HistoryCard[] }> }) {
  const totalReadings = readings.length;
  const elementCounts: Record<string, number> = {};
  for (const r of readings) {
    for (const card of r.cards) {
      if (card.element) {
        elementCounts[card.element] = (elementCounts[card.element] || 0) + 1;
      }
    }
  }
  const topElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];

  const ELEMENT_KR: Record<string, string> = {
    wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
  };

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5 text-center">
        <p className="text-xl font-bold text-gold font-numeric">{totalReadings}</p>
        <p className="text-[10px] text-lavender/50 mt-0.5">리딩 횟수</p>
      </div>
      <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5 text-center">
        <p className="text-xl font-bold text-ivory font-numeric">
          {totalReadings * 3}
        </p>
        <p className="text-[10px] text-lavender/50 mt-0.5">뽑은 카드</p>
      </div>
      <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5 text-center">
        <p className="text-sm font-bold text-ivory mt-0.5">
          {topElement ? ELEMENT_KR[topElement[0]] || '-' : '-'}
        </p>
        <p className="text-[10px] text-lavender/50 mt-0.5">자주 나온 오행</p>
      </div>
    </div>
  );
}

// --- Reading Card ---
function ReadingCard({ reading }: { reading: { date: string; cards: HistoryCard[]; readingText: string } }) {
  const dateObj = new Date(reading.date + 'T00:00:00');
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${DAY_NAMES[dateObj.getDay()]})`;

  return (
    <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
      {/* Date header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-display text-ivory">{dateLabel}</span>
        <span className="text-[10px] text-lavender/40 font-numeric">{reading.date}</span>
      </div>

      {/* Cards row */}
      <div className="flex items-start justify-center gap-3 px-4 py-4">
        {reading.cards.map((card: HistoryCard, i: number) => (
          <div key={card.card_id + i} className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-lavender/60 font-medium">
              [{card.positionLabel}]
            </span>
            <CardImage card={card} orientation={card.orientation} size="sm" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-ivory/70">{card.name_kr}</span>
              <span
                className={`text-[8px] px-1 py-0.5 rounded border font-bold ${
                  card.orientation === 'upright'
                    ? 'border-gold/40 text-gold'
                    : 'border-white/15 text-lavender/50'
                }`}
              >
                {card.orientation === 'upright' ? '\u6B63' : '\u9006'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reading text */}
      <div className="px-4 pb-4">
        <p className="text-xs text-ivory/70 leading-[1.8] font-display">
          {reading.readingText}
        </p>
      </div>
    </div>
  );
}
