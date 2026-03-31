export const EXECUTIVE_TITLES = [
  'President & CEO',
  'Chief Executive Officer (CEO)',
  'President',
  'Chief Operating Officer (COO)',
  'Chief Financial Officer (CFO)',
  'Chief Medical Officer (CMO)',
  'Chief Nursing Officer (CNO)',
  'Chief Information Officer (CIO)',
  'Chief Human Resources Officer (CHRO)',
  'Chief Strategy Officer (CSO)',
  'Chief Legal Officer / General Counsel',
  'Chief Quality Officer (CQO)',
  'Chief Compliance Officer (CCO)',
  'Chief Revenue Officer (CRO)',
  'Chief Digital Officer (CDO)',
  'SVP / EVP - Operations',
  'SVP / EVP - Finance',
  'SVP / EVP - Medical Affairs',
  'SVP / EVP - Strategy / Business Development',
  'SVP / EVP - Human Resources',
  'VP - Operations',
  'VP - Finance',
  'VP - Nursing',
  'Other C-Suite',
  'Other SVP/EVP',
  'Other VP',
] as const;

export type ExecutiveTitle = (typeof EXECUTIVE_TITLES)[number];

export const ROLE_SLUGS: Record<string, string> = {
  'ceo': 'Chief Executive Officer (CEO)',
  'president-ceo': 'President & CEO',
  'president': 'President',
  'coo': 'Chief Operating Officer (COO)',
  'cfo': 'Chief Financial Officer (CFO)',
  'cmo': 'Chief Medical Officer (CMO)',
  'cno': 'Chief Nursing Officer (CNO)',
  'cio': 'Chief Information Officer (CIO)',
  'chro': 'Chief Human Resources Officer (CHRO)',
  'cso': 'Chief Strategy Officer (CSO)',
};

export const NPR_RANGES = [
  { value: 'under_500m', label: 'Under $500M' },
  { value: '500m_1b', label: '$500M – $1B' },
  { value: '1b_3b', label: '$1B – $3B' },
  { value: '3b_5b', label: '$3B – $5B' },
  { value: '5b_10b', label: '$5B – $10B' },
  { value: 'over_10b', label: 'Over $10B' },
] as const;

export const LICENSED_BEDS_RANGES = [
  { value: 'under_100', label: 'Under 100' },
  { value: '100_250', label: '100 – 250' },
  { value: '250_500', label: '250 – 500' },
  { value: '500_1000', label: '500 – 1,000' },
  { value: 'over_1000', label: 'Over 1,000' },
] as const;

export const TAX_STATUSES = [
  { value: 'nonprofit', label: 'Not-for-Profit' },
  { value: 'for_profit', label: 'For-Profit' },
  { value: 'government', label: 'Government' },
] as const;

export const SYSTEM_AFFILIATIONS = [
  { value: 'independent', label: 'Independent Hospital' },
  { value: 'system_affiliated', label: 'System-Affiliated Hospital' },
  { value: 'system_parent', label: 'System Parent / Corporate Office' },
] as const;

export const REGIONS = [
  { value: 'northeast', label: 'Northeast (CT, DC, DE, MA, MD, ME, NH, NJ, NY, PA, RI, VT)' },
  { value: 'southeast', label: 'Southeast (AL, AR, FL, GA, KY, LA, MS, NC, SC, TN, VA, WV)' },
  { value: 'midwest', label: 'Midwest (IA, IL, IN, KS, MI, MN, MO, ND, NE, OH, SD, WI)' },
  { value: 'southwest', label: 'Southwest (AZ, NM, OK, TX)' },
  { value: 'west', label: 'West (CA, CO, HI, NV, UT)' },
  { value: 'pacific_northwest', label: 'Pacific Northwest (AK, ID, MT, OR, WA, WY)' },
] as const;

export const SETTINGS = [
  { value: 'urban', label: 'Population 50,000+' },
  { value: 'suburban', label: 'Population 10,000 – 49,999' },
  { value: 'rural', label: 'Population under 10,000' },
] as const;

export const TEACHING_STATUSES = [
  { value: 'major_teaching', label: 'Major Teaching / Academic Medical Center' },
  { value: 'minor_teaching', label: 'Minor Teaching' },
  { value: 'non_teaching', label: 'Non-Teaching' },
] as const;

export const REPORTS_TO_OPTIONS = [
  { value: 'board', label: 'Board of Directors' },
  { value: 'ceo', label: 'CEO' },
  { value: 'coo', label: 'COO' },
  { value: 'other', label: 'Other' },
] as const;

export const YEARS_IN_ROLE_OPTIONS = [
  { value: 'under_1', label: 'Less than 1 year' },
  { value: '1_3', label: '1 – 3 years' },
  { value: '3_5', label: '3 – 5 years' },
  { value: '5_10', label: '5 – 10 years' },
  { value: 'over_10', label: 'Over 10 years' },
] as const;

export const VESTING_TYPES = [
  { value: 'cliff', label: 'Cliff Vesting' },
  { value: 'graded', label: 'Graded Vesting' },
] as const;

export const SERP_TYPES = [
  { value: 'defined_benefit', label: 'Defined Benefit' },
  { value: 'defined_contribution', label: 'Defined Contribution' },
] as const;

export const LTIP_TYPES = [
  { value: 'cash_performance', label: 'Cash-Based Performance Plan' },
  { value: 'phantom_equity', label: 'Phantom Equity / Units' },
  { value: 'restricted_cash', label: 'Restricted Cash Awards' },
  { value: 'other', label: 'Other' },
] as const;

export const CIC_TRIGGERS = [
  { value: 'single', label: 'Single Trigger' },
  { value: 'double', label: 'Double Trigger' },
] as const;

export const WIZARD_STEPS: readonly { id: string; label: string; estimatedTime: string; optional: boolean }[] = [
  { id: 'organization', label: 'Organization', estimatedTime: '30 seconds', optional: false },
  { id: 'role', label: 'Your Role', estimatedTime: '20 seconds', optional: false },
  { id: 'cash-comp', label: 'Cash Compensation', estimatedTime: '60 seconds', optional: false },
  { id: 'deferred', label: 'Deferred Comp', estimatedTime: '2 minutes', optional: true },
  { id: 'agreement', label: 'Employment Agreement', estimatedTime: '1 minute', optional: true },
];
