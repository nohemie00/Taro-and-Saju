import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardImage } from './CardImage';

interface DrawnCard {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: string;
  color_hex: string;
  keywords: string[];
  is_holographic: boolean;
  orientation: 'upright' | 'reversed';
  positionLabel: string;
  special_effect?: string;
}

interface Props {
  cards: DrawnCard[];
  onComplete: () => void;
}

export function CardDrawAnimation({ cards, onComplete }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    // Stagger reveal: 0s, 0.4s, 0.8s
    const timers = cards.map((_, i) =>
      setTimeout(() => setRevealedCount((c) => c + 1), i * 600)
    );

    // After all revealed + animation time, transition to result
    const completeTimer = setTimeout(() => {
      setAllRevealed(true);
    }, cards.length * 600 + 1500);

    const finalTimer = setTimeout(onComplete, cards.length * 600 + 2500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
      clearTimeout(finalTimer);
    };
  }, [cards, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Cards row */}
      <div className="flex items-end justify-center gap-4">
        {cards.map((card, i) => {
          const isRevealed = i < revealedCount;
          const hasLuckEffect = card.category === 'luck' && isRevealed;

          return (
            <div key={card.card_id} className="flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.div
                    key={`front-${card.card_id}`}
                    initial={{ scale: 0.6, opacity: 0, rotateY: 0, y: 100 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotateY: 720,
                      y: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeInOut',
                    }}
                    style={{ perspective: '1000px' }}
                    className="relative"
                  >
                    {/* Major card gold glow */}
                    {card.category === 'major' && (
                      <motion.div
                        className="absolute -inset-2 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0.4] }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        style={{
                          boxShadow: '0 0 40px #D4AF37, 0 0 80px #D4AF3766',
                        }}
                      />
                    )}

                    {/* Luck card special effects */}
                    {hasLuckEffect && <LuckEffect effect={card.special_effect} />}

                    <CardImage card={card} orientation={card.orientation} size="md" />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`placeholder-${i}`}
                    className="w-[140px] h-[196px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-gold/30 text-2xl font-display">?</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Position label */}
              {isRevealed && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-lavender"
                >
                  {card.positionLabel}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading text */}
      {!allRevealed && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gold/60"
        >
          카드를 읽는 중...
        </motion.p>
      )}
    </div>
  );
}

/** Luck card special effects */
function LuckEffect({ effect }: { effect?: string }) {
  const particles = Array.from({ length: 20 });

  if (effect === 'golden_fireworks') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold"
            style={{ left: '50%', top: '50%' }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              x: Math.cos((i / 20) * Math.PI * 2) * (80 + Math.random() * 60),
              y: Math.sin((i / 20) * Math.PI * 2) * (80 + Math.random() * 60),
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.5, delay: 0.5 + Math.random() * 0.3 }}
          />
        ))}
      </div>
    );
  }

  if (effect === 'shooting_stars') {
    return (
      <div className="absolute -inset-10 pointer-events-none overflow-visible z-10">
        {particles.slice(0, 12).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-200"
            style={{ left: `${Math.random() * 100}%`, top: -20 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, 200 + Math.random() * 100],
              x: Math.random() * 40 - 20,
            }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </div>
    );
  }

  if (effect === 'two_lights_meeting') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-gold/80"
          style={{ left: -40, top: '50%' }}
          animate={{ left: '45%', opacity: [0.8, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-yellow-200/80"
          style={{ right: -40, top: '50%' }}
          animate={{ right: '45%', opacity: [0.8, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
        <motion.div
          className="absolute w-8 h-8 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </div>
    );
  }

  return null;
}
