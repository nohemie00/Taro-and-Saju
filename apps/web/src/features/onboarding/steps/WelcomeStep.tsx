import { motion } from 'framer-motion';

interface Props {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: Props) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 pb-10">
      {/* 상단 비주얼 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* 오방색 도트 */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {['#4A6FA5', '#C84B4B', '#E8B84A', '#F0EDE5', '#2C2C3E'].map((color, i) => (
              <motion.div
                key={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <h2 className="font-display text-[28px] leading-tight text-ivory mb-4">
            당신만의 오색운이
            <br />
            깨어나는 곳
          </h2>
          <p className="text-base text-lavender leading-relaxed">
            사주와 타로로 보는 오늘의 색
          </p>
        </motion.div>
      </div>

      {/* 하단 CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={onNext}
        className="gold-button w-full py-4 rounded-xl text-base font-semibold"
      >
        시작하기
      </motion.button>
    </div>
  );
}
