import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTarotStatus, drawTarotCards, getTarotHistory } from '@/shared/api/endpoints';

export function useTarotStatus() {
  return useQuery({
    queryKey: ['tarot', 'status'],
    queryFn: getTarotStatus,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDrawCards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: drawTarotCards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarot', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['tarot', 'history'] });
    },
  });
}

export function useTarotHistory() {
  return useQuery({
    queryKey: ['tarot', 'history'],
    queryFn: getTarotHistory,
  });
}
