import { z } from 'zod/v4';

// Step 1: Organization
export const organizationSchema = z.object({
  net_patient_revenue_range: z.enum([
    'under_500m', '500m_1b', '1b_3b', '3b_5b', '5b_10b', 'over_10b',
  ], { message: 'Please select a revenue range' }),
  licensed_beds_range: z.enum([
    'under_100', '100_250', '250_500', '500_1000', 'over_1000',
  ], { message: 'Please select a bed count range' }),
  tax_status: z.enum([
    'nonprofit', 'for_profit', 'government',
  ], { message: 'Please select a tax status' }),
  system_affiliation: z.enum([
    'independent', 'system_affiliated', 'system_parent',
  ], { message: 'Please select a system affiliation' }),
  region: z.enum([
    'northeast', 'southeast', 'midwest', 'southwest', 'west', 'pacific_northwest',
  ], { message: 'Please select a region' }),
  setting: z.enum([
    'urban', 'suburban', 'rural',
  ], { message: 'Please select a setting' }),
  teaching_status: z.enum([
    'major_teaching', 'minor_teaching', 'non_teaching',
  ]).optional(),
});

// Step 2: Role
export const roleSchema = z.object({
  title: z.string().min(1, 'Please select a title'),
  title_other: z.string().optional(),
  reports_to: z.string().optional(),
  reports_to_other: z.string().optional(),
  years_in_role: z.enum([
    'under_1', '1_3', '3_5', '5_10', 'over_10',
  ]).optional(),
});

// Step 3: Cash Compensation
export const cashCompSchema = z.object({
  base_salary: z
    .number({ message: 'Please enter a base salary' })
    .min(100_000, 'Base salary must be at least $100,000')
    .max(10_000_000, 'Base salary must be less than $10,000,000'),
  annual_incentive_target_pct: z
    .number()
    .min(0, 'Target must be at least 0%')
    .max(200, 'Target must be less than 200%')
    .optional(),
  annual_incentive_actual: z
    .number()
    .min(0)
    .optional(),
  total_cash_compensation: z
    .number({ message: 'Please enter total cash compensation' })
    .min(100_000, 'Total cash must be at least $100,000')
    .max(20_000_000, 'Total cash must be less than $20,000,000'),
  signing_bonus: z.number().min(0).optional(),
  retention_bonus: z.number().min(0).optional(),
  retention_bonus_period_years: z.number().min(0).max(10).optional(),
}).refine(
  (data) => data.total_cash_compensation >= data.base_salary,
  {
    message: 'Total cash compensation must be greater than or equal to base salary',
    path: ['total_cash_compensation'],
  }
);

// Step 4: Deferred Compensation & Equity (all optional)
export const deferredCompSchema = z.object({
  has_deferred_comp: z.boolean().optional(),
  has_457b: z.boolean().optional(),
  employer_457b_contribution: z.number().min(0).optional(),
  has_457f: z.boolean().optional(),
  employer_457f_contribution: z.number().min(0).optional(),
  vesting_457f_type: z.enum(['cliff', 'graded']).optional(),
  vesting_457f_years: z.number().min(1).max(20).optional(),
  has_401a: z.boolean().optional(),
  employer_401a_contribution: z.number().min(0).optional(),
  has_403b_match: z.boolean().optional(),
  employer_403b_match: z.number().min(0).optional(),
  has_401k_match: z.boolean().optional(),
  employer_401k_match: z.number().min(0).optional(),
  has_serp: z.boolean().optional(),
  serp_type: z.enum(['defined_benefit', 'defined_contribution']).optional(),
  serp_annual_value: z.number().min(0).optional(),
  has_split_dollar: z.boolean().optional(),
  has_ltip: z.boolean().optional(),
  ltip_target_pct: z.number().min(0).max(200).optional(),
  ltip_type: z.enum(['cash_performance', 'phantom_equity', 'restricted_cash', 'other']).optional(),
  ltip_performance_period_years: z.number().min(1).max(10).optional(),
  has_equity_comp: z.boolean().optional(),
  has_rsus: z.boolean().optional(),
  rsu_annual_value: z.number().min(0).optional(),
  has_psus: z.boolean().optional(),
  psu_annual_target: z.number().min(0).optional(),
  has_espp: z.boolean().optional(),
  espp_discount_pct: z.number().min(0).max(25).optional(),
}).refine(
  // If deferred comp is toggled on, at least one sub-type must be selected
  (data) => {
    if (!data.has_deferred_comp) return true;
    return data.has_457b || data.has_457f || data.has_401a || data.has_403b_match
      || data.has_401k_match || data.has_serp || data.has_split_dollar;
  },
  {
    message: 'Please select at least one deferred compensation type, or uncheck the deferred compensation toggle',
    path: ['has_deferred_comp'],
  }
).refine(
  // If equity comp is toggled on, at least one of RSU/PSU/ESPP must be selected
  (data) => {
    if (!data.has_equity_comp) return true;
    return data.has_rsus || data.has_psus || data.has_espp;
  },
  {
    message: 'Please select at least one equity compensation type, or uncheck the equity compensation toggle',
    path: ['has_equity_comp'],
  }
);

// Step 5: Employment Agreement (all optional)
export const agreementSchema = z.object({
  severance_multiple: z.number().min(0).max(5).optional(),
  severance_includes_bonus: z.boolean().optional(),
  has_change_in_control: z.boolean().optional(),
  cic_trigger: z.enum(['single', 'double']).optional(),
  cic_multiple: z.number().min(0).max(5).optional(),
  non_compete_months: z.number().min(0).max(60).optional(),
  non_compete_radius_miles: z.number().min(0).max(500).optional(),
});

// Combined schema for full submission
export const fullSubmissionSchema = organizationSchema
  .and(roleSchema)
  .and(cashCompSchema)
  .and(deferredCompSchema)
  .and(agreementSchema)
  .and(z.object({
    estimated_total_comp: z.number().min(0).optional(),
    feedback: z.string().optional(),
  }));

export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type CashCompFormData = z.infer<typeof cashCompSchema>;
export type DeferredCompFormData = z.infer<typeof deferredCompSchema>;
export type AgreementFormData = z.infer<typeof agreementSchema>;
export type FullSubmissionFormData = z.infer<typeof fullSubmissionSchema>;

// Step schemas array for wizard navigation
export const stepSchemas = [
  organizationSchema,
  roleSchema,
  cashCompSchema,
  deferredCompSchema,
  agreementSchema,
] as const;
