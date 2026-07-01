import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { MissionCard } from './components/MissionCard';
import { MissionHistory } from './components/MissionHistory';
import { useMissionsToday, useCompleteMission, useUncompleteMission } from './hooks/useMission';
import { BottomTabBar } from '@/features/home/components/BottomTabBar';

export function MissionScreen() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMissionsToday();
  const completeMutation = useCompleteMission();
  const uncompleteMutation = useUncompleteMission();

  const handleToggle = useCallback(
    (missionId: string, currentlyCompleted: boolean) => {
      if (currentlyCompleted) {
        uncompleteMutation.mutate(missionId);
      } else {
        completeMutation.mutate(missionId);
      }
    },
    [completeMutation, uncompleteMutation]
  );

  const isToggling = completeMutation.isPending || uncompleteMutation.isPending;

  // 진행률 계산
  const completedCount = data?.completedCount ?? 0;
  const totalCount = data?.totalCount ?? 3;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col pb-20">
        {/* 헤더 */}
        <header className="flex items-center px-5 pt-5 pb-2">
          <span className="font-display text-lg text-gold">오늘의 미션</span>
        </header>

        <main className="flex-1 flex flex-col px-5 pt-2 gap-6">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-lavender text-sm">미션을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <i className="fas fa-exclamation-circle text-2xl text-red-400 mb-3" />
              <p className="text-ivory mb-1">미션을 불러오지 못했습니다</p>
              <p className="text-lavender text-sm">잠시 후 다시 시도해 주세요</p>
            </div>
          ) : data ? (
            <>
              {/* 진행률 헤더 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ivory/80">
                    {completedCount === totalCount ? (
                      <span className="text-gold">
                        <i className="fas fa-sparkles mr-1" />
                        모든 미션을 완수했어요!
                      </span>
                    ) : (
                      <>
                        <span className="text-gold font-numeric text-lg">{completedCount}</span>
                        <span className="text-lavender/50">/{totalCount}</span>
                        <span className="text-lavender/60 ml-2 text-xs">완료</span>
                      </>
                    )}
                  </p>
                  <span className="text-xs text-lavender/40 font-numeric">{data.date}</span>
                </div>

                {/* 프로그레스 바 */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      background:
                        progress === 1
                          ? 'linear-gradient(90deg, #D4AF37, #F0D87A)'
                          : 'linear-gradient(90deg, #D4AF3788, #D4AF37)',
                    }}
                  />
                </div>
              </motion.div>

              {/* 미션 카드 목록 */}
              <div className="flex flex-col gap-3">
                {data.missions.map((mission, i) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={mission}
                    index={i}
                    onToggle={handleToggle}
                    isToggling={isToggling}
                  />
                ))}
              </div>

              {/* 구분선 */}
              <div className="border-t border-white/5" />

              {/* 주간 히스토리 */}
              <MissionHistory />
            </>
          ) : null}
        </main>

        <BottomTabBar />
      </div>
    </GradientBackground>
  );
}
