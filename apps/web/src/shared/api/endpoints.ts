import { api } from './client';
import type { User, DailyFortune, CreateUserRequest, UpdateUserRequest } from '@osaekwoon/shared';

// --- Users ---

export async function createUser(data: CreateUserRequest): Promise<{
  user: User;
  weakestElement: string;
  elements: Record<string, number>;
}> {
  return api.post('users', { json: data }).json();
}

export async function getMe(): Promise<{ user: User }> {
  return api.get('users/me').json();
}

export async function updateMe(data: UpdateUserRequest): Promise<{
  user: User;
  elements: Record<string, number>;
  weakestElement: string;
}> {
  return api.patch('users/me', { json: data }).json();
}

// --- Daily Fortune ---

export async function getDailyFortune(date?: string): Promise<DailyFortune> {
  const searchParams = date ? { date } : {};
  return api.get('daily-fortune', { searchParams }).json();
}
