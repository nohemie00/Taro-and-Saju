import { useUserStore } from '@/shared/stores/userStore';
import { TIER_LIMITS } from '@osaekwoon/shared';
import type { UserTier } from '@osaekwoon/shared';

export function usePremium() {
  const user = useUserStore((s) => s.user);

  const tier: UserTier = user?.tier ?? 'free';
  const isPremium =
    tier === 'premium' &&
    (!user?.premiumExpiresAt || Date.now() <= user.premiumExpiresAt);

  const limits = TIER_LIMITS[isPremium ? 'premium' : 'free'];

  const daysRemaining = isPremium && user?.premiumExpiresAt
    ? Math.max(0, Math.ceil((user.premiumExpiresAt - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return {
    tier: isPremium ? ('premium' as UserTier) : ('free' as UserTier),
    isPremium,
    limits,
    daysRemaining,
  };
}
