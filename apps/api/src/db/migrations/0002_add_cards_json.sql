-- 오색운 2단계: card_readings 테이블에 cards_json 컬럼 추가
-- 기존 0001_init.sql에서 card_readings는 이미 생성됨
-- cards_json: 뽑힌 카드 3장의 전체 데이터 (JSON 문자열)

ALTER TABLE card_readings ADD COLUMN cards_json TEXT DEFAULT '[]';

-- user_id + date 유니크 인덱스 (이미 있으면 무시)
CREATE INDEX IF NOT EXISTS idx_card_readings_user_date ON card_readings(user_id, date);
