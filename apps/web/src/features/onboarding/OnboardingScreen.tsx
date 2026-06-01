import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { WelcomeStep } from './steps/WelcomeStep';
import { SajuInputStep } from './steps/SajuInputStep';
import { CompleteStep } from './steps/CompleteStep';

const TOTAL_STEPS = 3;

export function OnboardingScreen() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col relative">
        {/* 프로그레스 바 */}
        <div className="pt-safe-top px-6 pt-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-gold' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 스텝 컨텐츠 */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col"
              >
                <WelcomeStep onNext={goNext} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="saju"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col"
              >
                <SajuInputStep onNext={goNext} onBack={goBack} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col"
              >
                <CompleteStep />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GradientBackground>
  );
}
