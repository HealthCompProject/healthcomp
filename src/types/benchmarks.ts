export interface PercentileData {
  p25?: number;
  p50: number;
  p75?: number;
}

export type DisclosureTier = 'median_only' | 'full';

export interface BenchmarkResult {
  sufficient_data: boolean;
  submission_count: number;
  disclosure_tier?: DisclosureTier;
  message?: string;
  suppression_reason?: string;
  base_salary?: PercentileData;
  total_cash?: PercentileData;
  incentive_target_pct?: PercentileData;
  has_deferred_comp_pct?: number;
  has_ltip_pct?: number;
  has_457f_pct?: number;
  has_serp_pct?: number;
  has_equity_comp_pct?: number;
  has_employment_agreement_pct?: number;
  has_403b_match_pct?: number;
  has_401k_match_pct?: number;
}

export interface BenchmarkFilters {
  title?: string;
  net_patient_revenue_range?: string;
  tax_status?: string;
  region?: string;
}

export interface RoleBenchmark {
  role: string;
  roleLabel: string;
  baseSalary: PercentileData | null;
  totalCash: PercentileData | null;
  count: number;
}
