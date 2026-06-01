import { useQuery } from '@tanstack/react-query';
import { getDailyFortune } from '@/shared/api/endpoints';
import type { DailyFortune } from '@osaekwoon/shared';

export function useDailyFortune(date?: string) {
  return useQuery<DailyFortune>({
    queryKey: ['daily-fortune', date || 'today'],
    queryFn: () => getDailyFortune(date),
    staleTime: 1000 * 60 * 5, // 5분 (invalidate 후 즉시 refetch 보장)
  });
}
