import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@osaekwoon/shared';

interface UserState {
  user: User | null;
  isOnboarded: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user, isOnboarded: true }),
      clearUser: () => set({ user: null, isOnboarded: false }),
    }),
    { name: 'osaekwoon-user' }
  )
);
