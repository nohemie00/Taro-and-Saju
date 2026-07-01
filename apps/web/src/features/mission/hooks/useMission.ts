import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMissionsToday,
  completeMission,
  uncompleteMission,
  getMissionHistory,
} from '@/shared/api/endpoints';

export function useMissionsToday() {
  return useQuery({
    queryKey: ['missions', 'today'],
    queryFn: getMissionsToday,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCompleteMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['missions', 'history'] });
    },
  });
}

export function useUncompleteMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uncompleteMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['missions', 'history'] });
    },
  });
}

export function useMissionHistory() {
  return useQuery({
    queryKey: ['missions', 'history'],
    queryFn: getMissionHistory,
    staleTime: 1000 * 60 * 5,
  });
}
