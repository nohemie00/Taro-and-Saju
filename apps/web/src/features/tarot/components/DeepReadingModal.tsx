import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeepReadingResult } from '@/shared/api/endpoints';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deepReading: DeepReadingResult | null;
  isLoading: boolean;
  error: string | null;
}

const HARMONY_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; bg: string }
> = {
  very_good: {
    label: '대길',
    icon: 'fas fa-sun',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
  },
  good: {
    label: '길',
    icon: 'fas fa-cloud-sun',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
  },
  neutral: {
    label: '평',
    icon: 'fas fa-cloud',
    color: 'text-blue-300',
    bg: 'bg-blue-300/10 border-blue-300/30',
  },
  tension: {
    label: '소흉',
    icon: 'fas fa-bolt',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/30',
  },
  conflict: {
    label: '흉',
    icon: 'fas fa-exclamation-triangle',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
  },
};

const RELATION_EMOJI: Record<string, string> = {
  sangsaeng: '\u2728', // 상생
  sanggeuk: '\u26A1',  // 상극
  same: '\uD83D\uDD04', // 같은 오행
  neutral: '\u2796',    // 중립
};

const ELEMENT_ICON: Record<string, { icon: string; color: string }> = {
  wood: { icon: 'fas fa-tree', color: 'text-green-400' },
  fire: { icon: 'fas fa-fire', color: 'text-red-400' },
  earth: { icon: 'fas fa-mountain', color: 'text-yellow-600' },
  metal: { icon: 'fas fa-coins', color: 'text-gray-300' },
  water: { icon: 'fas fa-water', color: 'text-blue-400' },
};

const POSITION_ICON: Record<string, string> = {
  mind: 'fas fa-brain',
  situation: 'fas fa-compass',
  advice: 'fas fa-lightbulb',
};

export function DeepReadingModal({ isOpen, onClose, deepReading, isLoading, error }: Props) {
  // ESC to close + body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dim overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />

          {/* Full-screen scrollable modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col max-w-app mx-auto"
          >
            <div className="flex-1 bg-gradient-to-b from-[#0F1028] to-[#1A1B35] overflow-y-auto">
              {/* Header */}
              <header className="sticky top-0 z-10 bg-[#0F1028]/90 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="font-display text-lg text-gold flex items-center gap-2">
                    <i className="fas fa-scroll" />
                    심화 리딩
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-lavender"
                  >
                    <i className="fas fa-times text-sm" />
                  </button>
                </div>
              </header>

              {/* Content */}
              <div className="px-5 py-6 pb-safe">
                {isLoading && <LoadingState />}
                {error && <ErrorState error={error} onRetry={onClose} />}
                {deepReading && !isLoading && !error && (
                  <DeepReadingContent reading={deepReading} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Loading ---
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full"
      />
      <p className="text-ivory/80 text-sm font-display">
        오행의 기운을 분석하고 있어요...
      </p>
      <p className="text-lavender/50 text-xs">잠시만 기다려주세요</p>
    </div>
  );
}

// --- Error ---
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-full bg-red-400/10 flex items-center justify-center">
        <i className="fas fa-exclamation-circle text-red-400 text-xl" />
      </div>
      <p className="text-ivory/80 text-sm text-center">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm"
      >
        닫기
      </button>
    </div>
  );
}

// --- Main Content ---
function DeepReadingContent({ reading }: { reading: DeepReadingResult }) {
  const harmony = HARMONY_CONFIG[reading.elementAnalysis.overallHarmony] || HARMONY_CONFIG.neutral;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* 1. Harmony Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`flex items-center gap-3 p-4 rounded-2xl border ${harmony.bg}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <i className={`${harmony.icon} text-xl ${harmony.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold ${harmony.color}`}>
              오행 조화도: {harmony.label}
            </span>
          </div>
          <p className="text-xs text-ivory/70 leading-relaxed">
            {reading.elementAnalysis.harmonyDescription}
          </p>
        </div>
      </motion.div>

      {/* 2. Summary */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SectionTitle icon="fas fa-feather-alt" label="종합 해석" />
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-sm text-ivory/85 leading-[1.9] font-display">
            {reading.summary}
          </p>
        </div>
      </motion.section>

      {/* 3. Element Relations */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionTitle icon="fas fa-yin-yang" label="오행 관계 분석" />
        <div className="space-y-2">
          {reading.elementAnalysis.relations.map((rel, i) => {
            const fromEl = ELEMENT_ICON[rel.from];
            const toEl = ELEMENT_ICON[rel.to];
            return (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-start gap-3"
              >
                <div className="flex items-center gap-1.5 mt-0.5 shrink-0">
                  {fromEl && <i className={`${fromEl.icon} text-xs ${fromEl.color}`} />}
                  <span className="text-xs">{RELATION_EMOJI[rel.type]}</span>
                  {toEl && <i className={`${toEl.icon} text-xs ${toEl.color}`} />}
                </div>
                <p className="text-xs text-ivory/70 leading-relaxed flex-1">
                  {rel.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 4. Position Deep Readings */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SectionTitle icon="fas fa-layer-group" label="포지션별 심화 해석" />
        <div className="space-y-3">
          {reading.positionReadings.map((pr, i) => (
            <motion.div
              key={pr.position}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <i className={`${POSITION_ICON[pr.position] || 'fas fa-circle'} text-gold text-xs`} />
                <span className="text-xs font-bold text-gold">
                  [{pr.positionLabel}]
                </span>
                <span className="text-xs text-ivory/60">{pr.cardName}</span>
              </div>
              <p className="text-sm text-ivory/80 leading-[1.8] font-display">
                {pr.deepMeaning}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 5. Synergy Pattern */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <SectionTitle icon="fas fa-magic" label="카드 시너지" />
        <div className="bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-4 border border-gold/15">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-gold font-display">
              {reading.synergy.pattern}
            </span>
          </div>
          <p className="text-sm text-ivory/80 leading-[1.8] font-display">
            {reading.synergy.description}
          </p>
        </div>
      </motion.section>

      {/* 6. Action Advice */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <SectionTitle icon="fas fa-hand-point-right" label="오늘의 행동 조언" />
        <div className="space-y-2">
          {reading.actionAdvice.map((advice, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
            >
              <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-ivory/80 leading-relaxed flex-1">
                {advice}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. Caution (if any) */}
      {reading.caution && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SectionTitle icon="fas fa-shield-alt" label="주의사항" />
          <div className="bg-red-400/5 rounded-2xl p-4 border border-red-400/15">
            <p className="text-sm text-red-300/90 leading-[1.8]">
              <i className="fas fa-exclamation-circle mr-1.5 text-red-400/70" />
              {reading.caution}
            </p>
          </div>
        </motion.section>
      )}

      {/* Bottom spacer */}
      <div className="h-8" />
    </motion.div>
  );
}

// --- Section Title ---
function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <i className={`${icon} text-xs text-gold/70`} />
      <h3 className="text-sm font-bold text-ivory/90">{label}</h3>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
