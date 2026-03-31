-- ============================================================
-- HealthComp Database Schema
-- ============================================================

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Organization Profile
  net_patient_revenue_range TEXT NOT NULL CHECK (net_patient_revenue_range IN (
    'under_500m', '500m_1b', '1b_3b', '3b_5b', '5b_10b', 'over_10b'
  )),
  licensed_beds_range TEXT NOT NULL CHECK (licensed_beds_range IN (
    'under_100', '100_250', '250_500', '500_1000', 'over_1000'
  )),
  tax_status TEXT NOT NULL CHECK (tax_status IN (
    'nonprofit', 'for_profit', 'government'
  )),
  system_affiliation TEXT NOT NULL CHECK (system_affiliation IN (
    'independent', 'system_affiliated', 'system_parent'
  )),
  region TEXT NOT NULL CHECK (region IN (
    'northeast', 'southeast', 'midwest', 'southwest', 'west', 'pacific_northwest'
  )),
  setting TEXT NOT NULL CHECK (setting IN (
    'urban', 'suburban', 'rural'
  )),
  teaching_status TEXT CHECK (teaching_status IN (
    'major_teaching', 'minor_teaching', 'non_teaching'
  )),

  -- Role
  title TEXT NOT NULL,
  reports_to TEXT,
  years_in_role TEXT CHECK (years_in_role IN (
    'under_1', '1_3', '3_5', '5_10', 'over_10'
  )),

  -- Cash Compensation (required)
  base_salary INTEGER NOT NULL,
  annual_incentive_target_pct NUMERIC(5,2),
  annual_incentive_actual INTEGER,
  total_cash_compensation INTEGER NOT NULL,
  signing_bonus INTEGER,
  retention_bonus INTEGER,
  retention_bonus_period_years NUMERIC(3,1),

  -- Deferred Compensation (optional)
  has_deferred_comp BOOLEAN,
  has_457b BOOLEAN,
  employer_457b_contribution INTEGER,
  has_457f BOOLEAN,
  employer_457f_contribution INTEGER,
  vesting_457f_type TEXT CHECK (vesting_457f_type IN ('cliff', 'graded')),
  vesting_457f_years INTEGER,
  has_serp BOOLEAN,
  serp_type TEXT CHECK (serp_type IN ('defined_benefit', 'defined_contribution')),
  serp_annual_value INTEGER,
  has_split_dollar BOOLEAN,

  -- Long-Term Incentive (optional)
  has_ltip BOOLEAN,
  ltip_target_pct NUMERIC(5,2),
  ltip_type TEXT CHECK (ltip_type IN (
    'cash_performance', 'phantom_equity', 'restricted_cash', 'other'
  )),
  ltip_performance_period_years INTEGER,

  -- Employment Agreement (optional)
  severance_multiple NUMERIC(3,1),
  severance_includes_bonus BOOLEAN,
  has_change_in_control BOOLEAN,
  cic_trigger TEXT CHECK (cic_trigger IN ('single', 'double')),
  cic_multiple NUMERIC(3,1),
  non_compete_months INTEGER,
  non_compete_radius_miles INTEGER,

  -- Self-reported total comp estimate
  estimated_total_comp INTEGER,

  -- Metadata
  comp_data_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  ip_hash TEXT,
  submission_fingerprint TEXT
);

-- Indexes
CREATE INDEX idx_submissions_role ON submissions(title);
CREATE INDEX idx_submissions_org_size ON submissions(net_patient_revenue_range);
CREATE INDEX idx_submissions_region ON submissions(region);
CREATE INDEX idx_submissions_tax ON submissions(tax_status);
CREATE INDEX idx_submissions_created ON submissions(created_at);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  first_name TEXT,
  role_category TEXT,
  wants_newsletter BOOLEAN DEFAULT true
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "No direct reads" ON submissions FOR SELECT USING (false);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- ============================================================
-- Aggregation Function
-- ============================================================

CREATE OR REPLACE FUNCTION get_comp_benchmarks(
  p_title TEXT DEFAULT NULL,
  p_revenue_range TEXT DEFAULT NULL,
  p_tax_status TEXT DEFAULT NULL,
  p_region TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  submission_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO submission_count
  FROM submissions s
  WHERE (p_title IS NULL OR s.title = p_title)
    AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
    AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
    AND (p_region IS NULL OR s.region = p_region);

  IF submission_count < 5 THEN
    RETURN json_build_object(
      'sufficient_data', false,
      'submission_count', submission_count,
      'message', 'Insufficient data for this filter combination. Minimum 5 submissions required.'
    );
  END IF;

  SELECT json_build_object(
    'sufficient_data', true,
    'submission_count', submission_count,
    'base_salary', json_build_object(
      'p25', PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY base_salary),
      'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY base_salary),
      'p75', PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY base_salary)
    ),
    'total_cash', json_build_object(
      'p25', PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_cash_compensation),
      'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY total_cash_compensation),
      'p75', PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_cash_compensation)
    ),
    'incentive_target_pct', json_build_object(
      'p25', PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY annual_incentive_target_pct),
      'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY annual_incentive_target_pct),
      'p75', PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY annual_incentive_target_pct)
    ),
    'has_deferred_comp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_deferred_comp = true) / COUNT(*), 1),
    'has_ltip_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_ltip = true) / COUNT(*), 1),
    'has_457f_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_457f = true) / COUNT(*), 1),
    'has_serp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_serp = true) / COUNT(*), 1)
  ) INTO result
  FROM submissions s
  WHERE (p_title IS NULL OR s.title = p_title)
    AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
    AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
    AND (p_region IS NULL OR s.region = p_region);

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Submission count function
CREATE OR REPLACE FUNCTION get_submission_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM submissions;
$$ LANGUAGE sql SECURITY DEFINER;
