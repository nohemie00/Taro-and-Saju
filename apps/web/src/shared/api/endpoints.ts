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

export async function deleteMe(): Promise<{ success: boolean; message: string }> {
  return api.delete('users/me').json();
}

// --- Daily Fortune ---

export async function getDailyFortune(date?: string): Promise<DailyFortune> {
  const searchParams = date ? { date } : {};
  return api.get('daily-fortune', { searchParams }).json();
}

// --- Tarot ---

export async function getTarotStatus(): Promise<{
  hasReadToday: boolean;
  todayReading: {
    date: string;
    cards: any[];
    readingText: string;
    createdAt: number;
  } | null;
}> {
  return api.get('tarot/status').json();
}

export async function drawTarotCards(): Promise<{
  date: string;
  cards: any[];
  readingMessage: string;
  nickname: string;
}> {
  return api.post('tarot/draw').json();
}

export async function getTarotHistory(): Promise<{
  readings: Array<{
    date: string;
    cards: any[];
    readingText: string;
    createdAt: number;
  }>;
}> {
  return api.get('tarot/history').json();
}
