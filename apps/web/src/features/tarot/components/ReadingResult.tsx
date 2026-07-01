import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardImage } from './CardImage';
import { showToast } from '@/shared/components/Toast';

interface DrawnCard {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: string;
  color_hex: string;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string | null;
  saju_hint?: string;
  is_holographic: boolean;
  orientation: 'upright' | 'reversed';
  position: string;
  positionLabel: string;
  special_message?: string;
}

interface Props {
  cards: DrawnCard[];
  readingMessage: string;
  nickname: string;
  date: string;
}

export function ReadingResult({ cards, readingMessage, nickname, date }: Props) {
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);

  // Extract one keyword from each card
  const luckyKeywords = cards.map((c) => c.keywords[0]);

  const handleShare = () => {
    showToast('공유 기능 준비 중이에요', 'info');
  };

  const handleDeepReading = () => {
    showToast('심화 리딩은 준비 중이에요', 'info');
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-lg text-ivory">
          {nickname}님의 오늘의 타로
        </h2>
        <p className="text-xs text-lavender/60 font-numeric mt-1">{date}</p>
      </motion.div>

      {/* 3 cards row */}
      <div className="flex items-start justify-center gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.card_id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Position label */}
            <span className="text-[10px] text-lavender/70 font-medium">
              [{card.positionLabel}]
            </span>

            <CardImage
              card={card}
              orientation={card.orientation}
              size="md"
              onClick={() => setSelectedCard(card)}
            />

            {/* Card name + orientation badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-ivory/80 font-display">
                {card.name_kr}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${
                  card.orientation === 'upright'
                    ? 'border-gold/50 text-gold'
                    : 'border-white/20 text-lavender/60'
                }`}
              >
                {card.orientation === 'upright' ? '\u6B63' : '\u9006'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reading message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-white/5 rounded-2xl p-5 border border-white/5"
      >
        <p className="font-display text-ivory/90 text-sm leading-[1.8] text-center">
          {readingMessage}
        </p>
      </motion.div>

      {/* Lucky keywords */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2"
      >
        <span className="text-xs text-lavender/50">오늘의 키워드</span>
        {luckyKeywords.map((kw, i) => (
          <span
            key={i}
            className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20"
          >
            {kw}
          </span>
        ))}
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm font-medium"
        >
          <i className="fas fa-share-alt mr-2" />
          공유하기
        </button>
        <button
          onClick={handleDeepReading}
          className="flex-1 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-medium"
        >
          심화 리딩 받기
        </button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-lavender/40 text-center">
        타로는 하루 한 번만 뽑을 수 있어요. 내일 다시 만나요
      </p>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CardDetailModal({
  card,
  onClose,
}: {
  card: DrawnCard;
  onClose: () => void;
}) {
  const meaning =
    card.orientation === 'upright'
      ? card.meaning_upright
      : card.meaning_reversed || card.meaning_upright;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm bg-bg-top rounded-2xl p-6 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg text-ivory">{card.name_kr}</h3>
            <p className="text-xs text-lavender/60 font-numeric">{card.name_hanja}</p>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded border font-bold ${
              card.orientation === 'upright'
                ? 'border-gold/50 text-gold'
                : 'border-white/20 text-lavender/60'
            }`}
          >
            {card.orientation === 'upright' ? '\u6B63\u65B9\u5411' : '\u9006\u65B9\u5411'}
          </span>
        </div>

        {/* Keywords */}
        <div className="flex gap-2 mb-4">
          {card.keywords.map((kw, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-ivory/70 border border-white/10"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Meaning */}
        <p className="font-display text-sm text-ivory/85 leading-[1.8] mb-4">
          {meaning}
        </p>

        {/* Saju hint */}
        {card.saju_hint && (
          <div className="bg-gold/5 rounded-lg p-3 mb-4 border border-gold/10">
            <p className="text-xs text-gold/70">
              <i className="fas fa-star mr-1" />
              {card.saju_hint}
            </p>
          </div>
        )}

        {/* Special message for luck cards */}
        {card.special_message && (
          <div className="bg-gold/10 rounded-lg p-3 mb-4 border border-gold/20">
            <p className="text-xs text-gold font-medium">
              <i className="fas fa-sparkles mr-1" />
              {card.special_message}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/5 text-ivory text-sm"
        >
          닫기
        </button>
      </motion.div>
    </motion.div>
  );
}
