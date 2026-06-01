import { motion } from 'framer-motion';

interface Props {
  missionText: string;
}

export function DailyMissionCard({ missionText }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="glass-card rounded-2xl p-5 mx-6"
    >
      <span className="text-xs text-gold font-medium tracking-wider block mb-2">
        오늘의 미션
      </span>
      <p className="text-base text-ivory leading-[1.6]">
        {missionText}
      </p>
    </motion.div>
  );
}
