import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/shared/api/endpoints';
import { useUserStore } from '@/shared/stores/userStore';
import type { CreateUserRequest } from '@osaekwoon/shared';

export function useCreateUser() {
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (res) => {
      setUser(res.user);
    },
  });
}
