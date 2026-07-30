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

// --- Missions ---

export interface MissionItem {
  mission_id: string;
  category: string;
  element: string;
  text: string;
  duration_min: number;
  completed: boolean;
  completedAt: number | null;
}

export async function getMissionsToday(): Promise<{
  date: string;
  missions: MissionItem[];
  completedCount: number;
  totalCount: number;
}> {
  return api.get('missions/today').json();
}

export async function completeMission(missionId: string): Promise<{
  success: boolean;
  missionId: string;
  completedAt: number;
}> {
  return api.post('missions/complete', { json: { missionId } }).json();
}

export async function uncompleteMission(missionId: string): Promise<{
  success: boolean;
  missionId: string;
}> {
  return api.post('missions/uncomplete', { json: { missionId } }).json();
}

export interface HistoryDay {
  date: string;
  totalCount: number;
  completedCount: number;
  missions: Array<{
    mission_id: string;
    text: string;
    element: string;
    category: string;
    completed: boolean;
  }>;
}

export async function getMissionHistory(): Promise<{
  history: HistoryDay[];
}> {
  return api.get('missions/history').json();
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

// --- Deep Reading ---

export interface ElementRelation {
  type: 'sangsaeng' | 'sanggeuk' | 'same' | 'neutral';
  from: string;
  to: string;
  description: string;
}

export interface DeepReadingResult {
  summary: string;
  elementAnalysis: {
    relations: ElementRelation[];
    overallHarmony: 'very_good' | 'good' | 'neutral' | 'tension' | 'conflict';
    harmonyDescription: string;
  };
  positionReadings: Array<{
    position: string;
    positionLabel: string;
    cardName: string;
    deepMeaning: string;
  }>;
  synergy: {
    pattern: string;
    description: string;
  };
  actionAdvice: string[];
  caution: string | null;
}

export async function getDeepReading(): Promise<{
  date: string;
  cards: any[];
  deepReading: DeepReadingResult;
}> {
  return api.post('tarot/deep-reading').json();
}
