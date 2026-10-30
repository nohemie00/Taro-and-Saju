import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { PremiumModal } from '@/shared/components/PremiumModal';
import { BottomTabBar } from '@/features/home/components/BottomTabBar';
import { useUserStore } from '@/shared/stores/userStore';
import { usePremium } from '@/shared/hooks/usePremium';
import { useTarotHistory } from '@/features/tarot/hooks/useTarot';
import { useMissionHistory } from '@/features/mission/hooks/useMission';
import type { Element, HistoryCard } from '@osaekwoon/shared';
import { ELEMENT_COLORS, BIRTH_BRANCHES, GENDER_OPTIONS } from '@osaekwoon/shared';

// --- Constants ---

const ELEMENT_KR: Record<Element, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

const ELEMENT_ICON: Record<Element, string> = {
  wood: 'fas fa-tree',
  fire: 'fas fa-fire',
  earth: 'fas fa-mountain',
  metal: 'fas fa-coins',
  water: 'fas fa-water',
};

const ELEMENT_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];

// --- Component ---

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { isPremium, daysRemaining } = usePremium();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { data: tarotHistory } = useTarotHistory();
  const { data: missionHistory } = useMissionHistory();

  if (!user) {
    return (
      <GradientBackground>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      </GradientBackground>
    );
  }

  // Birth date formatting
  const birthDate = new Date(user.birthDate + 'T00:00:00');
  const birthLabel = `${birthDate.getFullYear()}년 ${birthDate.getMonth() + 1}월 ${birthDate.getDate()}일`;
  const branchInfo = BIRTH_BRANCHES.find((b) => b.value === user.birthTime);
  const genderInfo = GENDER_OPTIONS.find((g) => g.value === user.gender);

  // Stats
  const totalReadings = tarotHistory?.readings?.length ?? 0;
  // 조회 기간(history.length)이 아니라 실제로 미션을 1개 이상 완료한 날만 센다
  const totalMissionDays = (missionHistory?.history ?? []).filter(
    (d) => d.completedCount > 0
  ).length;
  const totalMissionsCompleted = (missionHistory?.history ?? []).reduce(
    (sum, d) => sum + d.completedCount,
    0
  );

  // Element max value for bar chart
  const elements = user.elements || {};
  const maxElement = Math.max(...ELEMENT_ORDER.map((e) => elements[e] || 0), 1);

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col pb-20">
        {/* Header */}
        <header className="flex items-center px-5 pt-5 pb-2">
          <span className="font-display text-lg text-gold">내 정보</span>
        </header>

        <main className="flex-1 flex flex-col px-5 pt-2 gap-5">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-2xl border border-white/5 p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2"
                style={{
                  borderColor: ELEMENT_COLORS[user.weakestElement]?.hex || '#D4AF37',
                  background: `${ELEMENT_COLORS[user.weakestElement]?.hex || '#D4AF37'}20`,
                  color: ELEMENT_COLORS[user.weakestElement]?.hex || '#D4AF37',
                }}
              >
                {user.nickname.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display text-ivory">{user.nickname}</h2>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30">
                      <i className="fas fa-crown text-[8px] text-gold" />
                      <span className="text-[9px] font-bold text-gold">PREMIUM</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-lavender/60 mt-0.5">
                  {birthLabel}
                  {branchInfo && branchInfo.value !== 'unknown' && ` · ${branchInfo.value}시생`}
                  {genderInfo && genderInfo.value !== 'none' && ` · ${genderInfo.label}`}
                </p>
              </div>
              <button
                onClick={() => navigate('/onboarding?mode=edit')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-lavender/60"
              >
                <i className="fas fa-pen text-xs" />
              </button>
            </div>

            {/* Weakest Element Badge */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{
                borderColor: `${ELEMENT_COLORS[user.weakestElement]?.hex}40`,
                background: `${ELEMENT_COLORS[user.weakestElement]?.hex}10`,
              }}
            >
              <i
                className={`${ELEMENT_ICON[user.weakestElement]} text-sm`}
                style={{ color: ELEMENT_COLORS[user.weakestElement]?.hex }}
              />
              <span className="text-xs text-ivory/80">
                보완이 필요한 오행:{' '}
                <span
                  className="font-bold"
                  style={{ color: ELEMENT_COLORS[user.weakestElement]?.hex }}
                >
                  {ELEMENT_KR[user.weakestElement]}
                </span>
              </span>
            </div>
          </motion.div>

          {/* Five Elements Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-2xl border border-white/5 p-5"
          >
            <h3 className="text-sm font-bold text-ivory/90 mb-4 flex items-center gap-2">
              <i className="fas fa-yin-yang text-xs text-gold/70" />
              사주 오행 분포
            </h3>
            <div className="space-y-3">
              {ELEMENT_ORDER.map((elem) => {
                const val = elements[elem] || 0;
                const pct = maxElement > 0 ? (val / maxElement) * 100 : 0;
                const isWeakest = elem === user.weakestElement;
                const color = ELEMENT_COLORS[elem]?.hex || '#888';

                return (
                  <div key={elem} className="flex items-center gap-3">
                    <div className="w-16 flex items-center gap-1.5 shrink-0">
                      <i
                        className={`${ELEMENT_ICON[elem]} text-xs`}
                        style={{ color }}
                      />
                      <span className="text-xs text-ivory/70">{ELEMENT_KR[elem]}</span>
                    </div>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <span className="text-xs font-numeric text-lavender/50 w-6 text-right">
                      {val}
                    </span>
                    {isWeakest && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded border border-red-400/30 text-red-400 shrink-0">
                        부족
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-2xl border border-white/5 p-5"
          >
            <h3 className="text-sm font-bold text-ivory/90 mb-4 flex items-center gap-2">
              <i className="fas fa-chart-line text-xs text-gold/70" />
              활동 통계
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <StatBox
                icon="fas fa-moon"
                value={totalReadings}
                label="타로 리딩"
                color="text-purple-400"
              />
              <StatBox
                icon="fas fa-calendar-check"
                value={totalMissionDays}
                label="미션 참여일"
                color="text-emerald-400"
              />
              <StatBox
                icon="fas fa-star"
                value={totalMissionsCompleted}
                label="완료 미션"
                color="text-yellow-400"
              />
            </div>
          </motion.div>

          {/* Element Tarot Stats */}
          {totalReadings > 0 && tarotHistory?.readings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-2xl border border-white/5 p-5"
            >
              <h3 className="text-sm font-bold text-ivory/90 mb-4 flex items-center gap-2">
                <i className="fas fa-layer-group text-xs text-gold/70" />
                뽑은 카드 오행 통계
              </h3>
              <CardElementStats readings={tarotHistory.readings} />
            </motion.div>
          )}

          {/* Premium Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {isPremium ? (
              <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl border border-gold/20 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <i className="fas fa-crown text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gold">프리미엄 활성화됨</p>
                    <p className="text-[10px] text-lavender/50 mt-0.5">
                      {daysRemaining > 0
                        ? `남은 기간: ${daysRemaining}일`
                        : '무제한'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20">
                    <i className="fas fa-book-open text-[8px] mr-1" />심화 리딩
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20">
                    <i className="fas fa-calendar-alt text-[8px] mr-1" />30일 히스토리
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20">
                    <i className="fas fa-chart-line text-[8px] mr-1" />7일 미션
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full bg-white/5 rounded-2xl border border-white/5 p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <i className="fas fa-crown text-gold/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ivory">프리미엄 업그레이드</p>
                    <p className="text-[10px] text-lavender/50 mt-0.5">심화 리딩, 확장 히스토리 등 모든 기능 이용</p>
                  </div>
                  <i className="fas fa-chevron-right text-xs text-gold/40" />
                </div>
              </button>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-2"
          >
            <QuickLink
              icon="fas fa-calendar-alt"
              label="타로 히스토리"
              sub="지난 리딩 모아보기"
              onClick={() => navigate('/tarot/history')}
            />
            <QuickLink
              icon="fas fa-pen-to-square"
              label="사주 정보 수정"
              sub="닉네임, 생년월일, 시간"
              onClick={() => navigate('/onboarding?mode=edit')}
            />
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2"
          >
            <p className="text-xs text-lavender/40 px-1 mb-1">약관 및 정책</p>
            <QuickLink
              icon="fas fa-shield-halved"
              label="개인정보처리방침"
              sub="개인정보 수집·이용·보호 안내"
              onClick={() => navigate('/privacy')}
            />
            <QuickLink
              icon="fas fa-file-contract"
              label="이용약관"
              sub="서비스 이용 규정"
              onClick={() => navigate('/terms')}
            />
          </motion.div>
        </main>

        <BottomTabBar />

        {/* Premium Modal */}
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      </div>
    </GradientBackground>
  );
}

// --- Sub Components ---

function StatBox({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center py-3 bg-white/[0.03] rounded-xl border border-white/5">
      <i className={`${icon} text-sm ${color} mb-1.5 block`} />
      <p className="text-lg font-bold text-ivory font-numeric">{value}</p>
      <p className="text-[10px] text-lavender/50 mt-0.5">{label}</p>
    </div>
  );
}

function QuickLink({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: string;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/5 text-left active:bg-white/10 transition-colors"
    >
      <span className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
        <i className={`${icon} text-sm text-gold`} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-ivory">{label}</p>
        <p className="text-xs text-lavender/50 mt-0.5">{sub}</p>
      </div>
      <i className="fas fa-chevron-right text-xs text-lavender/30" />
    </button>
  );
}

function CardElementStats({
  readings,
}: {
  readings: Array<{ cards: HistoryCard[] }>;
}) {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const r of readings) {
    for (const card of r.cards) {
      if (card.element) {
        counts[card.element] = (counts[card.element] || 0) + 1;
        total++;
      }
    }
  }

  return (
    <div className="space-y-2">
      {ELEMENT_ORDER.map((elem) => {
        const count = counts[elem] || 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const color = ELEMENT_COLORS[elem]?.hex || '#888';

        return (
          <div key={elem} className="flex items-center gap-3">
            <div className="w-16 flex items-center gap-1.5 shrink-0">
              <i
                className={`${ELEMENT_ICON[elem]} text-xs`}
                style={{ color }}
              />
              <span className="text-xs text-ivory/70">{ELEMENT_KR[elem]}</span>
            </div>
            <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="text-xs font-numeric text-lavender/50 w-10 text-right">
              {count}장 ({pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
