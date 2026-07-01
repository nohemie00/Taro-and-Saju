import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { CardDeck } from './components/CardDeck';
import { CardDrawAnimation } from './components/CardDrawAnimation';
import { ReadingResult } from './components/ReadingResult';
import { useTarotStatus, useDrawCards } from './hooks/useTarot';
import { useUserStore } from '@/shared/stores/userStore';

type Phase = 'loading' | 'intro' | 'drawing' | 'result';

export function TarotScreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: status, isLoading } = useTarotStatus();
  const drawMutation = useDrawCards();

  const [phase, setPhase] = useState<Phase>('loading');
  const [drawResult, setDrawResult] = useState<{
    cards: any[];
    readingMessage: string;
    nickname: string;
    date: string;
  } | null>(null);

  // Determine initial phase based on status
  const currentPhase = (() => {
    if (isLoading) return 'loading';
    if (phase !== 'loading') return phase;
    // First load: check if already read today
    if (status?.hasReadToday && status.todayReading) return 'result';
    return 'intro';
  })();

  // When user selects 3 cards from deck
  const handleSelectionComplete = useCallback(
    async (_selectedIndices: number[]) => {
      setPhase('drawing');
      try {
        const result = await drawMutation.mutateAsync();
        setDrawResult(result);
      } catch (err: any) {
        // If already read today (409), show existing result
        if (err?.response?.status === 409) {
          const body = await err.response.json();
          if (body.existing) {
            setDrawResult({
              cards: body.existing.cards,
              readingMessage: body.existing.readingText,
              nickname: user?.nickname || '',
              date: body.existing.date,
            });
          }
        }
      }
    },
    [drawMutation, user]
  );

  // When animation completes, show result
  const handleAnimationComplete = useCallback(() => {
    setPhase('result');
  }, []);

  // Build the todayReading data for result view
  const resultData = drawResult || (status?.todayReading
    ? {
        cards: status.todayReading.cards,
        readingMessage: status.todayReading.readingText,
        nickname: user?.nickname || '',
        date: status.todayReading.date,
      }
    : null);

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="flex items-center px-4 pt-5 pb-3">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 flex items-center justify-center text-lavender active:text-ivory transition-colors"
            aria-label="뒤로가기"
          >
            <i className="fas fa-chevron-left text-lg" />
          </button>
          <h1 className="flex-1 text-center font-display text-lg text-gold pr-10">
            오늘의 타로
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {currentPhase === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                <p className="text-lavender text-sm">카드를 준비하는 중...</p>
              </motion.div>
            )}

            {/* Intro — Card Deck */}
            {currentPhase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-6"
              >
                <div className="text-center">
                  <p className="text-ivory/80 text-sm mb-1">
                    마음을 가다듬고
                  </p>
                  <p className="font-display text-gold text-base">
                    세 장의 카드를 골라주세요
                  </p>
                </div>

                <CardDeck onSelectionComplete={handleSelectionComplete} />

                {drawMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <span className="text-sm text-lavender">카드를 뽑는 중...</span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Drawing — Animation */}
            {currentPhase === 'drawing' && drawResult && (
              <motion.div
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <CardDrawAnimation
                  cards={drawResult.cards}
                  onComplete={handleAnimationComplete}
                />
              </motion.div>
            )}

            {/* Result */}
            {currentPhase === 'result' && resultData && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <ReadingResult
                  cards={resultData.cards}
                  readingMessage={resultData.readingMessage}
                  nickname={resultData.nickname}
                  date={resultData.date}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </GradientBackground>
  );
}
