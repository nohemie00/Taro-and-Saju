-- 오색운(五色運) D1 Database Schema - Phase 1
-- Created: 2026-05-01

-- users 테이블
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  toss_user_key TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT DEFAULT 'unknown',
  gender TEXT,
  element_wood INTEGER DEFAULT 0,
  element_fire INTEGER DEFAULT 0,
  element_earth INTEGER DEFAULT 0,
  element_metal INTEGER DEFAULT 0,
  element_water INTEGER DEFAULT 0,
  weakest_element TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- daily_fortunes 테이블 (오늘의 컬러 캐시)
CREATE TABLE IF NOT EXISTS daily_fortunes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  mission_id TEXT,
  mission_text TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 향후 확장용 (스키마만 미리 정의, 1단계는 미사용)
CREATE TABLE IF NOT EXISTS card_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  card_ids TEXT NOT NULL,
  reading_text TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mission_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS card_collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  scanned_at INTEGER NOT NULL,
  UNIQUE(user_id, card_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_toss_key ON users(toss_user_key);
CREATE INDEX IF NOT EXISTS idx_daily_fortunes_user_date ON daily_fortunes(user_id, date);
CREATE INDEX IF NOT EXISTS idx_card_readings_user ON card_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_user ON mission_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_card_collections_user ON card_collections(user_id);
