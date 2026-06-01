import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientBackground } from '@/shared/components/GradientBackground';
import { getMe } from '@/shared/api/endpoints';
import { useUserStore } from '@/shared/stores/userStore';

export function SplashScreen() {
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 페이드인 시작
    const fadeTimer = setTimeout(() => setShow(true), 100);

    // 2초 후 사용자 확인 → 라우팅
    const navTimer = setTimeout(async () => {
      try {
        const { user } = await getMe();
        setUser(user);
        navigate('/home', { replace: true });
      } catch {
        navigate('/onboarding', { replace: true });
      }
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate, setUser]);

  return (
    <GradientBackground>
      <div className="flex flex-col items-center justify-center min-h-screen min-h-[100dvh]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="font-display text-5xl text-gold mb-4 tracking-wide">
            오색운
          </h1>
          <p className="font-numeric text-base text-lavender tracking-[0.3em]">
            五色運
          </p>
        </motion.div>

        {/* 미세한 빛 이펙트 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 0.15 } : {}}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          }}
        />
      </div>
    </GradientBackground>
  );
}
