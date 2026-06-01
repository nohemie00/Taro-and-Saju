import { motion } from 'framer-motion';

interface Props {
  colorHex: string;
  colorName: string;
  nickname: string;
}

export function ColorOrb({ colorHex, colorName, nickname }: Props) {
  return (
    <div className="flex flex-col items-center">
      {/* 컬러 오브 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div
          className="w-60 h-60 rounded-full relative"
          style={{
            backgroundColor: colorHex,
            '--glow-color': `${colorHex}50`,
          } as React.CSSProperties}
        >
          {/* 펄스 글로우 */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              '--glow-color': `${colorHex}40`,
            } as React.CSSProperties}
          />
        </div>
      </motion.div>

      {/* 텍스트 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-base text-lavender mb-2">
          오늘의 {nickname}님은
        </p>
        <h2 className="font-display text-[32px] text-ivory leading-tight">
          {colorName}
        </h2>
      </motion.div>
    </div>
  );
}
