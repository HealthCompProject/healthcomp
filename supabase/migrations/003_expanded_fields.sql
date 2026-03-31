-- ============================================================
-- Add new fields for equity comp, 401(a), and employment agreement tracking
-- ============================================================

-- New columns on submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_401a BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS employer_401a_contribution INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_equity_comp BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_rsus BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS rsu_annual_value INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_psus BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS psu_annual_target INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_espp BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS espp_discount_pct NUMERIC(5,2);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS title_other TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reports_to_other TEXT;

-- Update aggregation function to include equity comp and employment agreement prevalence
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
    'has_serp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_serp = true) / COUNT(*), 1),
    'has_equity_comp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_equity_comp = true) / COUNT(*), 1),
    'has_employment_agreement_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE severance_multiple IS NOT NULL) / COUNT(*), 1)
  ) INTO result
  FROM submissions s
  WHERE (p_title IS NULL OR s.title = p_title)
    AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
    AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
    AND (p_region IS NULL OR s.region = p_region);

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
