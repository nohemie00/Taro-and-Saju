import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUser } from '@/shared/api/endpoints';
import { useUserStore } from '@/shared/stores/userStore';
import { tossUserKey } from '@/shared/api/client';
import { showToast } from '@/shared/components/Toast';
import { ELEMENT_COLORS } from '@osaekwoon/shared';
import type { Element } from '@osaekwoon/shared';

export function CompleteStep() {
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{
    nickname: string;
    weakestElement: Element;
    colorHex: string;
  } | null>(null);

  const register = async () => {
    const data = window.__onboardingData;
    if (!data) {
      setError(true);
      setLoading(false);
      showToast('입력 정보를 찾을 수 없습니다', 'error');
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await createUser({
        tossUserKey,
        nickname: data.nickname,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        gender: data.gender,
      });

      setUser(res.user);
      const weakest = res.weakestElement as Element;
      const color = ELEMENT_COLORS[weakest] || ELEMENT_COLORS.earth;

      setResult({
        nickname: res.user.nickname,
        weakestElement: weakest,
        colorHex: color.hex,
      });
      setLoading(false);

      // 3초 후 자동 이동
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(true);
      setLoading(false);
      showToast('등록에 실패했습니다. 다시 시도해 주세요.', 'error');
    }
  };

  useEffect(() => {
    register();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full mb-6"
        />
        <p className="text-lavender text-base">오색운을 깨우는 중...</p>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <i className="fas fa-exclamation-circle text-3xl text-red-400 mb-4 block" />
          <p className="text-ivory text-lg mb-2">등록에 실패했습니다</p>
          <p className="text-lavender text-sm">네트워크 상태를 확인해 주세요</p>
        </div>
        <button
          onClick={register}
          className="gold-button px-8 py-3 rounded-xl text-base font-semibold"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 성공
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="font-display text-2xl text-ivory mb-8 leading-relaxed">
          {result?.nickname}님의
          <br />
          오색운이 깨어났습니다
        </p>
      </motion.div>

      {/* 첫 컬러 오브 */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className="relative mb-10"
      >
        <div
          className="w-60 h-60 rounded-full"
          style={{
            backgroundColor: result?.colorHex,
            boxShadow: `0 0 80px 30px ${result?.colorHex}40`,
          }}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => navigate('/home', { replace: true })}
        className="gold-button px-8 py-3.5 rounded-xl text-base font-semibold"
      >
        오늘의 운명을 보러 가기
      </motion.button>
    </div>
  );
}
