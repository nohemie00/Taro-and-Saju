import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardBack } from './CardImage';

interface Props {
  onSelectionComplete: (selectedIndices: number[]) => void;
}

const TOTAL_CARDS = 50;
const MAX_SELECT = 3;
const ARC_START = -30;
const ARC_END = 30;

export function CardDeck({ onSelectionComplete }: Props) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [deckOffset, setDeckOffset] = useState(0);

  const handleCardTap = useCallback(
    (index: number) => {
      if (selectedIndices.includes(index)) {
        setSelectedIndices((prev) => prev.filter((i) => i !== index));
        return;
      }
      if (selectedIndices.length >= MAX_SELECT) return;

      const next = [...selectedIndices, index];
      setSelectedIndices(next);

      if (next.length === MAX_SELECT) {
        // 0.5s delay then callback
        setTimeout(() => onSelectionComplete(next), 500);
      }
    },
    [selectedIndices, onSelectionComplete]
  );

  // swipe handler for rotating the deck
  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      setDeckOffset((prev) =>
        Math.max(-200, Math.min(200, prev + info.offset.x * 0.15))
      );
    },
    []
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Selection indicator */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < selectedIndices.length
                ? 'bg-gold scale-110'
                : 'bg-white/10 border border-white/20'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-lavender">
          {selectedIndices.length}/{MAX_SELECT}
        </span>
      </div>

      {/* Fan deck */}
      <motion.div
        className="relative"
        style={{ width: 320, height: 280 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
      >
        {Array.from({ length: TOTAL_CARDS }, (_, i) => {
          const isSelected = selectedIndices.includes(i);
          const angle =
            ARC_START +
            ((ARC_END - ARC_START) / (TOTAL_CARDS - 1)) * i +
            deckOffset * 0.05;
          const yOffset = Math.abs(angle) * 0.8; // arc curve

          return (
            <motion.div
              key={i}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                bottom: 0,
                zIndex: isSelected ? 100 + i : i,
                transformOrigin: 'bottom center',
              }}
              initial={false}
              animate={{
                rotate: angle,
                y: isSelected ? -40 - yOffset : -yOffset,
                scale: isSelected ? 1.05 : 1,
                marginLeft: -35,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={() => handleCardTap(i)}
              whileHover={{ y: isSelected ? -40 - yOffset : -20 - yOffset }}
            >
              <CardBack size="sm" selected={isSelected} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hint text */}
      <p className="text-lavender/60 text-xs text-center">
        {selectedIndices.length === 0
          ? '마음이 가는 카드 3장을 선택하세요'
          : selectedIndices.length < MAX_SELECT
          ? `${MAX_SELECT - selectedIndices.length}장 더 선택하세요`
          : '카드를 뒤집는 중...'}
      </p>
    </div>
  );
}
