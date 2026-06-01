import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { ColorOrb } from './components/ColorOrb';
import { DailyMissionCard } from './components/DailyMissionCard';
import { BottomTabBar } from './components/BottomTabBar';
import { useDailyFortune } from './hooks/useDailyFortune';
import { useUserStore } from '@/shared/stores/userStore';
import { showToast } from '@/shared/components/Toast';
import { getMe } from '@/shared/api/endpoints';

function formatKoreanDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const dow = days[d.getDay()];
  return `${y}년 ${m}월 ${day}일 ${dow}`;
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useUserStore();
  const { data: fortune, isLoading, error } = useDailyFortune();
  const [showMenu, setShowMenu] = useState(false);

  // 앱 진입 시 서버에서 사용자 동기화
  useEffect(() => {
    (async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        clearUser();
        navigate('/', { replace: true });
      }
    })();
  }, [setUser, clearUser, navigate]);

  const handleLogout = () => {
    clearUser();
    setShowMenu(false);
    navigate('/', { replace: true });
  };

  const handleShare = () => {
    showToast('공유 기능 준비 중', 'info');
  };

  if (!user) {
    return (
      <GradientBackground>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground overlayColor={fortune?.colorHex} overlayOpacity={0.25}>
      <div className="min-h-screen min-h-[100dvh] flex flex-col pb-20">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="font-display text-lg text-gold">오색운</span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 flex items-center justify-center text-lavender"
          >
            <i className="fas fa-bars text-lg" />
          </button>
        </header>

        {/* 드롭다운 메뉴 */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-4 z-40 glass-card rounded-xl overflow-hidden min-w-[160px]"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                showToast('사주 수정은 준비 중이에요', 'info');
              }}
              className="w-full text-left px-4 py-3 text-sm text-ivory hover:bg-white/5 transition-colors"
            >
              <i className="fas fa-edit mr-2 text-lavender" />
              사주 정보 수정
            </button>
            <div className="border-t border-white/5" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-white/5 transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2" />
              로그아웃
            </button>
          </motion.div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-lavender text-sm">오늘의 색을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <i className="fas fa-exclamation-circle text-2xl text-red-400 mb-3 block" />
              <p className="text-ivory mb-1">운세를 불러오지 못했습니다</p>
              <p className="text-lavender text-sm">잠시 후 다시 시도해 주세요</p>
            </div>
          ) : fortune ? (
            <>
              {/* 날짜 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-numeric text-sm text-lavender tracking-wider mb-8"
              >
                {formatKoreanDate(fortune.date)}
              </motion.p>

              {/* 컬러 오브 */}
              <ColorOrb
                colorHex={fortune.colorHex}
                colorName={fortune.colorName}
                nickname={user.nickname}
              />

              {/* 미션 카드 */}
              <div className="w-full mt-10">
                <DailyMissionCard missionText={fortune.missionText} />
              </div>
            </>
          ) : null}
        </main>

        {/* 플로팅 공유 버튼 */}
        <button
          onClick={handleShare}
          className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold shadow-lg z-40"
        >
          <i className="fas fa-share-alt text-base" />
        </button>

        {/* 하단 탭바 */}
        <BottomTabBar />
      </div>
    </GradientBackground>
  );
}
