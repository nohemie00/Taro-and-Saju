import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { ColorOrb } from './components/ColorOrb';
import { DailyMissionCard } from './components/DailyMissionCard';
import { TarotSummaryCard } from './components/TarotSummaryCard';
import { BottomTabBar } from './components/BottomTabBar';
import { useDailyFortune } from './hooks/useDailyFortune';
import { useUserStore } from '@/shared/stores/userStore';
import { showToast } from '@/shared/components/Toast';
import { getMe, deleteMe } from '@/shared/api/endpoints';

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
  const queryClient = useQueryClient();
  const { user, setUser, clearUser } = useUserStore();
  const { data: fortune, isLoading, error } = useDailyFortune();

  const [showSheet, setShowSheet] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

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

  // --- 메뉴 핸들러 ---

  const handleEditSaju = useCallback(() => {
    setShowSheet(false);
    navigate('/onboarding?mode=edit');
  }, [navigate]);

  const handleResetData = useCallback(() => {
    setShowSheet(false);
    // 약간의 딜레이를 주어 BottomSheet가 닫힌 후 모달이 열리도록
    setTimeout(() => setShowResetConfirm(true), 200);
  }, []);

  const handleConfirmReset = useCallback(async () => {
    setResetLoading(true);
    try {
      await deleteMe();
    } catch {
      // 서버 삭제 실패해도 로컬은 정리
    }
    // localStorage 정리
    clearUser();
    // React Query 캐시 전체 초기화
    queryClient.clear();
    setResetLoading(false);
    setShowResetConfirm(false);
    showToast('모든 데이터가 초기화되었습니다', 'info');
    navigate('/onboarding', { replace: true });
  }, [clearUser, queryClient, navigate]);

  const handleShowVersion = useCallback(() => {
    setShowSheet(false);
    setTimeout(() => setShowVersion(true), 200);
  }, []);

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
            onClick={() => setShowSheet(true)}
            className="w-10 h-10 flex items-center justify-center text-lavender active:text-ivory transition-colors"
            aria-label="메뉴 열기"
          >
            <i className="fas fa-bars text-lg" />
          </button>
        </header>

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

              {/* 타로 요약 카드 */}
              <div className="w-full mt-4">
                <TarotSummaryCard />
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

      {/* ---- BottomSheet 메뉴 ---- */}
      <BottomSheet isOpen={showSheet} onClose={() => setShowSheet(false)} title="설정">
        <nav className="flex flex-col -mx-5">
          {/* 사주 정보 수정 */}
          <button
            onClick={handleEditSaju}
            className="flex items-center gap-4 px-5 py-4 text-left active:bg-white/5 transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
              <i className="fas fa-pen-to-square text-sm text-gold" />
            </span>
            <div>
              <p className="text-sm font-medium text-ivory">사주 정보 수정</p>
              <p className="text-xs text-lavender mt-0.5">닉네임, 생년월일, 태어난 시간</p>
            </div>
            <i className="fas fa-chevron-right text-xs text-lavender/50 ml-auto" />
          </button>

          <div className="border-t border-white/5 mx-5" />

          {/* 데이터 초기화 */}
          <button
            onClick={handleResetData}
            className="flex items-center gap-4 px-5 py-4 text-left active:bg-white/5 transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center">
              <i className="fas fa-trash-can text-sm text-red-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-red-300">데이터 초기화</p>
              <p className="text-xs text-lavender mt-0.5">모든 사주·운세 데이터 삭제</p>
            </div>
            <i className="fas fa-chevron-right text-xs text-lavender/50 ml-auto" />
          </button>

          <div className="border-t border-white/5 mx-5" />

          {/* 버전 정보 */}
          <button
            onClick={handleShowVersion}
            className="flex items-center gap-4 px-5 py-4 text-left active:bg-white/5 transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
              <i className="fas fa-info-circle text-sm text-lavender" />
            </span>
            <div>
              <p className="text-sm font-medium text-ivory">버전 정보</p>
            </div>
            <span className="text-xs text-lavender/50 ml-auto">v1.0.0</span>
          </button>
        </nav>
      </BottomSheet>

      {/* ---- 데이터 초기화 확인 모달 ---- */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="데이터 초기화"
        description="사주 정보와 운세 기록이 모두 삭제됩니다. 이 작업은 되돌릴 수 없어요."
        confirmText="초기화"
        cancelText="취소"
        danger
        loading={resetLoading}
      />

      {/* ---- 버전 정보 모달 ---- */}
      <ConfirmModal
        isOpen={showVersion}
        onClose={() => setShowVersion(false)}
        onConfirm={() => setShowVersion(false)}
        title="오색운"
        description="五色運 v1.0.0&#10;사주와 타로로 보는 오늘의 색"
        confirmText="확인"
        cancelText="닫기"
      />
    </GradientBackground>
  );
}
