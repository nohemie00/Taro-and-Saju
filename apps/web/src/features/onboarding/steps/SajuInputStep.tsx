import { useState } from 'react';
import { motion } from 'framer-motion';
import { BIRTH_BRANCHES, GENDER_OPTIONS } from '@osaekwoon/shared';
import type { BirthBranch, Gender } from '@osaekwoon/shared';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// 온보딩 임시 데이터를 window에 보관 (CompleteStep에서 사용)
declare global {
  interface Window {
    __onboardingData?: {
      nickname: string;
      birthDate: string;
      birthTime: BirthBranch;
      gender: Gender;
    };
  }
}

export function SajuInputStep({ onNext, onBack }: Props) {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState<BirthBranch>('unknown');
  const [gender, setGender] = useState<Gender | ''>('');

  const isValid = nickname.trim().length > 0 && birthDate && gender !== '';

  const handleNext = () => {
    if (!isValid) return;
    window.__onboardingData = {
      nickname: nickname.trim(),
      birthDate,
      birthTime,
      gender: gender as Gender,
    };
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-10">
      {/* 헤더 */}
      <div className="pt-8 pb-6">
        <button onClick={onBack} className="text-lavender mb-4 flex items-center gap-1">
          <i className="fas fa-chevron-left text-sm" />
          <span className="text-sm">이전</span>
        </button>
        <h2 className="font-display text-2xl text-ivory leading-tight">
          사주 정보를 알려주세요
        </h2>
        <p className="text-sm text-lavender mt-2">
          정확할수록 오늘의 컬러가 더 잘 맞아요
        </p>
      </div>

      {/* 폼 */}
      <div className="flex-1 flex flex-col gap-5">
        {/* 닉네임 */}
        <div>
          <label className="text-xs text-lavender mb-2 block">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 10))}
            placeholder="10자 이내"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-ivory text-base outline-none focus:border-gold/50 transition-colors"
          />
          <span className="text-xs text-lavender/50 mt-1 block text-right">
            {nickname.length}/10
          </span>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-xs text-lavender mb-2 block">생년월일</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="1930-01-01"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-ivory text-base outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* 태어난 시간 */}
        <div>
          <label className="text-xs text-lavender mb-2 block">태어난 시간</label>
          <select
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value as BirthBranch)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-ivory text-base outline-none focus:border-gold/50 transition-colors appearance-none [color-scheme:dark]"
          >
            {BIRTH_BRANCHES.map((b) => (
              <option key={b.value} value={b.value} className="bg-bg-top text-ivory">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* 성별 */}
        <div>
          <label className="text-xs text-lavender mb-2 block">성별</label>
          <div className="flex gap-3">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                  gender === opt.value
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-white/5 border-white/10 text-lavender'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleNext}
        disabled={!isValid}
        className="gold-button w-full py-4 rounded-xl text-base font-semibold mt-6"
      >
        다음
      </motion.button>
    </div>
  );
}
