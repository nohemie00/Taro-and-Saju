import { Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from '@/features/splash/SplashScreen';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { TarotScreen } from '@/features/tarot/TarotScreen';
import { TarotHistoryScreen } from '@/features/tarot/TarotHistoryScreen';
import { MissionScreen } from '@/features/mission/MissionScreen';
import { Toast } from '@/shared/components/Toast';

export default function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-app mx-auto relative">
      <Toast />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/tarot" element={<TarotScreen />} />
        <Route path="/tarot/history" element={<TarotHistoryScreen />} />
        <Route path="/mission" element={<MissionScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
