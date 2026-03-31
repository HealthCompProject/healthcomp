-- ============================================================
-- Invite Code System
-- ============================================================

-- Invite codes table
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Who generated this code (NULL for seed codes)
  generated_by_submission_id UUID REFERENCES submissions(id),

  -- Usage tracking
  used_at TIMESTAMPTZ,
  used_by_submission_id UUID REFERENCES submissions(id),

  -- Seed codes created by admin have this flag
  is_seed BOOLEAN DEFAULT false
);

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_generated_by ON invite_codes(generated_by_submission_id);

-- Add invite code reference to submissions
ALTER TABLE submissions ADD COLUMN invite_code_used TEXT;
ALTER TABLE submissions ADD COLUMN feedback TEXT;

-- RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can check if a code is valid (via RPC function, not direct read)
CREATE POLICY "No direct reads on invite codes" ON invite_codes FOR SELECT USING (false);
CREATE POLICY "No direct inserts on invite codes" ON invite_codes FOR INSERT WITH CHECK (false);

-- ============================================================
-- Invite Code Functions
-- ============================================================

-- Generate a random 8-character alphanumeric code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Validate an invite code (returns true/false)
CREATE OR REPLACE FUNCTION validate_invite_code(p_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM invite_codes
    WHERE code = UPPER(TRIM(p_code))
    AND used_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use an invite code (mark as used, return success)
CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  code_id UUID;
BEGIN
  SELECT id INTO code_id
  FROM invite_codes
  WHERE code = UPPER(TRIM(p_code))
  AND used_at IS NULL
  FOR UPDATE SKIP LOCKED;

  IF code_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE invite_codes
  SET used_at = NOW(), used_by_submission_id = p_submission_id
  WHERE id = code_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate invite codes for a submission (creates 3 codes)
CREATE OR REPLACE FUNCTION generate_codes_for_submission(p_submission_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  codes TEXT[] := '{}';
  new_code TEXT;
  i INTEGER;
BEGIN
  FOR i IN 1..3 LOOP
    LOOP
      new_code := generate_invite_code();
      BEGIN
        INSERT INTO invite_codes (code, generated_by_submission_id)
        VALUES (new_code, p_submission_id);
        codes := codes || new_code;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Code already exists, try again
        CONTINUE;
      END;
    END LOOP;
  END LOOP;

  RETURN codes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed initial invite codes (run manually for your network)
-- Usage: SELECT seed_invite_codes(20);
CREATE OR REPLACE FUNCTION seed_invite_codes(p_count INTEGER DEFAULT 20)
RETURNS TEXT[] AS $$
DECLARE
  codes TEXT[] := '{}';
  new_code TEXT;
  i INTEGER;
BEGIN
  FOR i IN 1..p_count LOOP
    LOOP
      new_code := generate_invite_code();
      BEGIN
        INSERT INTO invite_codes (code, is_seed)
        VALUES (new_code, true);
        codes := codes || new_code;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        CONTINUE;
      END;
    END LOOP;
  END LOOP;

  RETURN codes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
