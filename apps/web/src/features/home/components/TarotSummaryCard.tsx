import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTarotStatus } from '@/features/tarot/hooks/useTarot';
import { CardImage } from '@/features/tarot/components/CardImage';

export function TarotSummaryCard() {
  const navigate = useNavigate();
  const { data: status, isLoading } = useTarotStatus();

  if (isLoading) return null;

  // Not read today — show CTA
  if (!status?.hasReadToday) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/tarot')}
        className="w-full glass-card rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔮</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-ivory mb-0.5">
              오늘의 타로 카드 뽑기
            </p>
            <p className="text-xs text-lavender/70">
              사주에 맞춘 3카드 리딩을 받아보세요
            </p>
          </div>
          <i className="fas fa-chevron-right text-xs text-gold/50" />
        </div>
      </motion.button>
    );
  }

  // Already read — show mini cards
  const cards = status.todayReading?.cards || [];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={() => navigate('/tarot')}
      className="w-full glass-card rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-lavender/70">오늘의 타로</p>
        <span className="text-[10px] text-gold/50">
          전체 보기 <i className="fas fa-chevron-right ml-0.5" />
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        {cards.slice(0, 3).map((card: any, i: number) => (
          <div key={card.card_id} className="flex flex-col items-center gap-1">
            <CardImage card={card} orientation={card.orientation} size="sm" />
            <span className="text-[9px] text-lavender/50">
              {['마음', '상황', '조언'][i]}
            </span>
          </div>
        ))}
      </div>
    </motion.button>
  );
}
