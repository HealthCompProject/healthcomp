-- ============================================================
-- Review improvements: 403(b)/401(k) match fields,
-- tiered percentile disclosure, 25% single-source cap
-- ============================================================

-- New columns for 403(b) and 401(k) employer match
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_403b_match BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS employer_403b_match INTEGER;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS has_401k_match BOOLEAN;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS employer_401k_match INTEGER;

-- Updated aggregation function with:
-- 1. Tiered disclosure: median-only at n=5-9, full percentiles at n=10+
-- 2. 25% single-source cap based on org profile fingerprint
-- 3. 403(b)/401(k) prevalence stats
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
  max_org_pct NUMERIC;
BEGIN
  -- Count matching submissions
  SELECT COUNT(*) INTO submission_count
  FROM submissions s
  WHERE (p_title IS NULL OR s.title = p_title)
    AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
    AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
    AND (p_region IS NULL OR s.region = p_region);

  -- PRIVACY THRESHOLD: Require minimum 5 submissions
  IF submission_count < 5 THEN
    RETURN json_build_object(
      'sufficient_data', false,
      'submission_count', submission_count,
      'message', 'Insufficient data for this filter combination. Minimum 5 submissions required.'
    );
  END IF;

  -- 25% SINGLE-SOURCE CAP: Check if any single org profile dominates
  -- Org profile = revenue + region + beds + tax status + setting
  SELECT COALESCE(MAX(org_count)::NUMERIC / submission_count * 100, 0)
  INTO max_org_pct
  FROM (
    SELECT COUNT(*) AS org_count
    FROM submissions s
    WHERE (p_title IS NULL OR s.title = p_title)
      AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
      AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
      AND (p_region IS NULL OR s.region = p_region)
    GROUP BY s.net_patient_revenue_range, s.region, s.licensed_beds_range,
             s.tax_status, s.setting
  ) org_groups;

  IF max_org_pct > 25 THEN
    RETURN json_build_object(
      'sufficient_data', false,
      'submission_count', submission_count,
      'message', 'Data suppressed: a single organizational profile represents more than 25% of submissions for this segment.',
      'suppression_reason', 'single_source_cap'
    );
  END IF;

  -- TIERED DISCLOSURE: n=5-9 → median only, n=10+ → full percentiles
  IF submission_count < 10 THEN
    -- Median-only tier
    SELECT json_build_object(
      'sufficient_data', true,
      'submission_count', submission_count,
      'disclosure_tier', 'median_only',
      'base_salary', json_build_object(
        'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY base_salary)
      ),
      'total_cash', json_build_object(
        'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY total_cash_compensation)
      ),
      'incentive_target_pct', json_build_object(
        'p50', PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY annual_incentive_target_pct)
      ),
      'has_deferred_comp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_deferred_comp = true) / COUNT(*), 1),
      'has_ltip_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_ltip = true) / COUNT(*), 1),
      'has_equity_comp_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_equity_comp = true) / COUNT(*), 1),
      'has_employment_agreement_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE severance_multiple IS NOT NULL) / COUNT(*), 1),
      'has_403b_match_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_403b_match = true) / COUNT(*), 1),
      'has_401k_match_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_401k_match = true) / COUNT(*), 1)
    ) INTO result
    FROM submissions s
    WHERE (p_title IS NULL OR s.title = p_title)
      AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
      AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
      AND (p_region IS NULL OR s.region = p_region);
  ELSE
    -- Full percentile tier (n >= 10)
    SELECT json_build_object(
      'sufficient_data', true,
      'submission_count', submission_count,
      'disclosure_tier', 'full',
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
      'has_employment_agreement_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE severance_multiple IS NOT NULL) / COUNT(*), 1),
      'has_403b_match_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_403b_match = true) / COUNT(*), 1),
      'has_401k_match_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE has_401k_match = true) / COUNT(*), 1)
    ) INTO result
    FROM submissions s
    WHERE (p_title IS NULL OR s.title = p_title)
      AND (p_revenue_range IS NULL OR s.net_patient_revenue_range = p_revenue_range)
      AND (p_tax_status IS NULL OR s.tax_status = p_tax_status)
      AND (p_region IS NULL OR s.region = p_region);
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
