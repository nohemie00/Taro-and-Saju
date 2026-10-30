import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/shared/api/client';
import { useUserStore } from '@/shared/stores/userStore';
import { getMe } from '@/shared/api/endpoints';
import { showToast } from '@/shared/components/Toast';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const FEATURE_DESCRIPTIONS: Record<string, { icon: string; title: string; desc: string }> = {
  deep_reading: {
    icon: 'fas fa-book-open',
    title: '심화 리딩',
    desc: '오행 상생·상극 분석과 3카드 시너지 해석을 통해 더 깊은 운세를 확인하세요.',
  },
  tarot_history: {
    icon: 'fas fa-calendar-alt',
    title: '전체 히스토리',
    desc: '최대 30일간의 타로 리딩 기록을 확인할 수 있습니다. (무료: 3일)',
  },
  mission_history: {
    icon: 'fas fa-chart-line',
    title: '미션 히스토리',
    desc: '최대 7일간의 미션 완료 기록을 확인할 수 있습니다. (무료: 3일)',
  },
};

export function PremiumModal({ isOpen, onClose, feature }: PremiumModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((s) => s.setUser);

  const featureInfo = feature ? FEATURE_DESCRIPTIONS[feature] : null;

  const handleActivate = async () => {
    if (!promoCode.trim()) {
      showToast('프로모 코드를 입력해주세요', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('premium/activate', { json: { promoCode: promoCode.trim().toUpperCase() } }).json();
      // 유저 정보 갱신
      const { user } = await getMe();
      setUser(user);
      showToast('프리미엄이 활성화되었습니다! ✨', 'success');
      onClose();
    } catch (err: unknown) {
      const httpErr = err as { response?: { status: number } };
      if (httpErr.response?.status === 400) {
        showToast('유효하지 않은 프로모 코드입니다', 'error');
      } else {
        showToast('오류가 발생했습니다', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal — flex 래퍼로 중앙 정렬 (framer-motion transform과 충돌하지 않도록 translate 미사용) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl border border-gold/20 overflow-y-auto max-h-[calc(100dvh-2rem)] shadow-2xl">
              {/* Header glow */}
              <div className="relative px-6 pt-8 pb-4 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-gold/10 rounded-full blur-3xl" />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/30 flex items-center justify-center">
                  <i className="fas fa-crown text-2xl text-gold" />
                </div>
                <h2 className="font-display text-xl text-gold">프리미엄</h2>
                <p className="text-xs text-lavender/60 mt-1">오색운의 모든 기능을 이용하세요</p>
              </div>

              {/* Feature trigger */}
              {featureInfo && (
                <div className="mx-6 mb-4 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <i className={`${featureInfo.icon} text-gold text-sm`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ivory">{featureInfo.title}</p>
                    <p className="text-xs text-lavender/50 mt-0.5">{featureInfo.desc}</p>
                  </div>
                </div>
              )}

              {/* Features list */}
              <div className="px-6 space-y-3">
                <FeatureRow icon="fas fa-book-open" text="심화 리딩 (오행 시너지 분석)" />
                <FeatureRow icon="fas fa-calendar-alt" text="타로 히스토리 30일 (무료 3일)" />
                <FeatureRow icon="fas fa-chart-line" text="미션 히스토리 7일 (무료 3일)" />
                <FeatureRow icon="fas fa-gem" text="프리미엄 배지 표시" />
              </div>

              {/* Promo code input */}
              <div className="px-6 mt-5">
                <label className="text-xs text-lavender/50 mb-1.5 block">프로모 코드</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="프로모 코드 입력"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-ivory placeholder:text-lavender/30 focus:outline-none focus:border-gold/40 uppercase tracking-wider"
                />
              </div>

              {/* Buttons */}
              <div className="px-6 pt-5 pb-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-sm text-lavender/70 active:bg-white/10 transition-colors"
                >
                  나중에
                </button>
                <button
                  onClick={handleActivate}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold/80 to-gold/60 text-sm font-bold text-midnight active:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin text-xs" /> 처리 중...
                    </span>
                  ) : (
                    '활성화'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
        <i className={`${icon} text-xs text-gold/70`} />
      </div>
      <span className="text-sm text-ivory/80">{text}</span>
      <i className="fas fa-check text-xs text-emerald-400 ml-auto" />
    </div>
  );
}
