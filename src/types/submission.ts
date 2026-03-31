export interface SubmissionData {
  // Organization
  net_patient_revenue_range: string;
  licensed_beds_range: string;
  tax_status: string;
  system_affiliation: string;
  region: string;
  setting: string;
  teaching_status?: string;

  // Role
  title: string;
  reports_to?: string;
  years_in_role?: string;

  // Cash Compensation
  base_salary: number;
  annual_incentive_target_pct?: number;
  annual_incentive_actual?: number;
  total_cash_compensation: number;
  signing_bonus?: number;
  retention_bonus?: number;
  retention_bonus_period_years?: number;

  // Deferred Compensation
  has_deferred_comp?: boolean;
  has_457b?: boolean;
  employer_457b_contribution?: number;
  has_457f?: boolean;
  employer_457f_contribution?: number;
  vesting_457f_type?: string;
  vesting_457f_years?: number;
  has_serp?: boolean;
  serp_type?: string;
  serp_annual_value?: number;
  has_split_dollar?: boolean;

  // Long-Term Incentive
  has_ltip?: boolean;
  ltip_target_pct?: number;
  ltip_type?: string;
  ltip_performance_period_years?: number;

  // Employment Agreement
  severance_multiple?: number;
  severance_includes_bonus?: boolean;
  has_change_in_control?: boolean;
  cic_trigger?: string;
  cic_multiple?: number;
  non_compete_months?: number;
  non_compete_radius_miles?: number;

  // Self-reported
  estimated_total_comp?: number;
}

export interface SubmissionFormData extends SubmissionData {
  // Anti-gaming (added by client)
  fingerprint_hash?: string;
}
