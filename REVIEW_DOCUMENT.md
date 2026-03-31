# HealthComp — Full Application Review Document

> **Purpose**: This document contains the complete context for HealthComp, a free healthcare executive compensation benchmarking platform. It is intended for external review of survey design, data practices, privacy safeguards, statistical methodology, and overall best practices. All source code is included inline.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Survey Design & Questions](#2-survey-design--questions)
3. [Data Validation & Schema](#3-data-validation--schema)
4. [Database Schema & Aggregation Logic](#4-database-schema--aggregation-logic)
5. [Privacy & Anonymity Safeguards](#5-privacy--anonymity-safeguards)
6. [Anti-Gaming & Data Quality](#6-anti-gaming--data-quality)
7. [Data Export & Open Data Practices](#7-data-export--open-data-practices)
8. [Legal Framework](#8-legal-framework)
9. [Survey UX & Form Implementation](#9-survey-ux--form-implementation)
10. [Dashboard & Data Display](#10-dashboard--data-display)

---

## 1. Project Overview

**HealthComp** is a free, open-source compensation benchmarking platform for senior healthcare executives at U.S. hospitals and health systems.

**Key design decisions:**
- **Anonymous by design**: No names, no employer names, no email required to submit
- **Invite-code gated**: Trust chain — each submitter receives 3 codes to share with peers
- **Aggregation only**: Only percentiles (25th, 50th, 75th) and prevalence rates are displayed
- **Privacy thresholds**: Minimum 5 submissions per statistic, no single source >25%
- **Dual license**: AGPL-3.0 (code) + CC BY 4.0 (aggregated data) + private raw submissions
- **Target audience**: C-suite and senior VP-level executives at hospitals and health systems

**Tech stack**: Next.js 16 (App Router), Supabase (PostgreSQL), Tailwind CSS, React Hook Form + Zod validation, Recharts

---

## 2. Survey Design & Questions

The survey is a 5-step wizard. Steps 1-3 are required; steps 4-5 are optional.

### Step 1: Organization Profile (Required)

Collects organizational characteristics for peer grouping:

**Fields:**
- **Net Patient Revenue** — Dropdown: Under $500M, $500M–$1B, $1B–$3B, $3B–$5B, $5B–$10B, Over $10B
- **Licensed Beds** — Dropdown: Under 100, 100–250, 250–500, 500–1,000, Over 1,000
- **Tax Status** — Dropdown: Not-for-Profit, For-Profit, Government
- **System Affiliation** — Dropdown: Independent Hospital, System-Affiliated Hospital, System Parent / Corporate Office
- **Region** — Dropdown with state abbreviations:
  - Northeast (CT, DC, DE, MA, MD, ME, NH, NJ, NY, PA, RI, VT)
  - Southeast (AL, AR, FL, GA, KY, LA, MS, NC, SC, TN, VA, WV)
  - Midwest (IA, IL, IN, KS, MI, MN, MO, ND, NE, OH, SD, WI)
  - Southwest (AZ, NM, OK, TX)
  - West (CA, CO, HI, NV, UT)
  - Pacific Northwest (AK, ID, MT, OR, WA, WY)
- **Setting** — Dropdown: Population 50,000+, Population 10,000–49,999, Population under 10,000
- **Teaching Status** — Dropdown (optional): Major Teaching / Academic Medical Center, Minor Teaching, Non-Teaching

### Step 2: Role (Required)

**Fields:**
- **Title** — Dropdown of 27 options:
  - President & CEO, CEO, President, COO, CFO, CMO, CNO, CIO, CHRO, CSO
  - Chief Legal Officer / General Counsel, CQO, CCO, CRO, CDO
  - SVP/EVP - Operations, Finance, Medical Affairs, Strategy/BD, HR
  - VP - Operations, Finance, Nursing
  - Other C-Suite, Other SVP/EVP, Other VP (each triggers a free-text "specify" field)
- **Reports To** — Dropdown (optional): Board of Directors, CEO, COO, Other (triggers free-text)
- **Years in Current Role** — Dropdown (optional): Less than 1 year, 1–3, 3–5, 5–10, Over 10

### Step 3: Cash Compensation (Required)

**Fields:**
- **Base Salary** — Number, required, $100K–$10M range
- **Annual Incentive Target (%)** — Number, optional, 0–200%
- **Annual Incentive Actual (Last Year)** — Number, optional
- **Total Cash Compensation** — Number, required, $100K–$20M range
  - Validation: must be ≥ base salary
- **Signing Bonus** — Number, optional
- **Retention Bonus** — Number, optional
- **Retention Bonus Period (Years)** — Number, optional, 0–10

### Step 4: Deferred Compensation, Equity & Long-Term Incentives (Optional)

Three sections with progressive disclosure (checkbox → detail fields):

**Section A: Deferred Compensation**
- Master toggle: "I have a deferred compensation arrangement"
- Sub-items (each with yes/no toggle and conditional detail fields):
  - **457(b) Plan** → Employer Annual Contribution ($)
  - **457(f) Plan** → Employer Annual Contribution ($), Vesting Schedule (Cliff/Graded), Vesting Period (years)
  - **401(a) Plan** → Employer Annual Contribution ($)
  - **SERP** → Type (Defined Benefit/Defined Contribution), Annual Value ($)
  - **Split-Dollar Life Insurance** → Yes/No only

**Section B: Long-Term Incentive Plans**
- Toggle: "Long-Term Incentive Plan (LTIP)"
- Detail fields: LTIP Target (% of base), LTIP Type (Cash Performance / Phantom Equity / Restricted Cash / Other), Performance Period (years)
- Note: RSUs and PSUs are NOT included here (they're under Equity Comp)

**Section C: Equity Compensation (For-Profit / Publicly Traded Systems)**
- Toggle: "Equity Compensation" — described as "Stock-based compensation from a publicly traded or for-profit health system (e.g., HCA, UHS, Ardent Health, Tenet, CHS)"
- Sub-items:
  - **RSUs** → Annual RSU Grant Value ($)
  - **PSUs** → Annual PSU Target Value ($)
  - **ESPP** → Discount (%, 0–25%)

### Step 5: Employment Agreement (Optional)

**Fields:**
- **Severance Multiple** — Number, 0–5x
- **Severance Includes Bonus** — Checkbox
- **Change-in-Control Provision** — Checkbox toggle
  - CIC Trigger: Single / Double
  - CIC Multiple: Number, 0–5x
- **Non-Compete Duration** — Months, 0–60
- **Non-Compete Radius** — Miles, 0–500

### Confirmation Step

- Full review of all entered data with "Edit" buttons per section
- Feedback textarea: "Is there anything major we missed?"
- Privacy reminder: "Your data will only appear in aggregate with at least 4 other submissions."
- Disclaimer: "This survey is an independent, open-source project. Data is self-reported and not independently verified. Results are for informational and benchmarking purposes only and do not constitute financial, legal, or employment advice."

---

## 3. Data Validation & Schema

Validation uses Zod v4 schemas. Here is the complete validation logic:

```typescript
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
});

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
```

---

## 4. Database Schema & Aggregation Logic

### Core Tables

```sql
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
  title_other TEXT,
  reports_to TEXT,
  reports_to_other TEXT,
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
  has_401a BOOLEAN,
  employer_401a_contribution INTEGER,
  has_serp BOOLEAN,
  serp_type TEXT CHECK (serp_type IN ('defined_benefit', 'defined_contribution')),
  serp_annual_value INTEGER,
  has_split_dollar BOOLEAN,

  -- Equity Compensation (optional)
  has_equity_comp BOOLEAN,
  has_rsus BOOLEAN,
  rsu_annual_value INTEGER,
  has_psus BOOLEAN,
  psu_annual_target INTEGER,
  has_espp BOOLEAN,
  espp_discount_pct NUMERIC(5,2),

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
  submission_fingerprint TEXT,
  invite_code_used TEXT,
  feedback TEXT
);
```

### Row-Level Security

```sql
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "No direct reads" ON submissions FOR SELECT USING (false);
```

**Key point**: The `SELECT` policy blocks ALL direct reads. Data can only be accessed through `SECURITY DEFINER` functions that enforce aggregation rules.

### Aggregation Function

```sql
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

  -- Return aggregated percentiles and prevalence rates
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
```

---

## 5. Privacy & Anonymity Safeguards

### What is NOT collected
- Name
- Email (not required to submit; optional for dashboard account)
- Employer name
- Exact location
- Any directly identifying information

### What IS collected (metadata)
- **IP hash**: One-way SHA-256 hash of IP + server-side salt. Used only for 24-hour duplicate detection. Original IP is never stored.
- **Browser fingerprint**: SHA-256 hash of screen resolution, timezone, language, hardware concurrency, user agent. Used only for duplicate detection.

### IP Hashing Implementation

```typescript
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

### Browser Fingerprint Implementation

```typescript
export async function generateFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency?.toString() || '',
  ];

  const raw = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

### Aggregation Rules
1. **5-submission minimum**: No statistic displayed with fewer than 5 data points
2. **25% single-source cap**: No single submission can represent more than 25% of any displayed statistic (documented in policy; enforcement at display layer)
3. **Percentiles only**: Only p25, p50, p75 — never individual values
4. **Row-level security**: `SELECT` policy is `USING (false)` — no direct reads possible
5. **SECURITY DEFINER functions**: All data access goes through aggregation functions

### Privacy Policy
See the full privacy policy in the [Privacy Policy section](#privacy-policy-full-text) below.

---

## 6. Anti-Gaming & Data Quality

### Invite Code System

The invite code system creates a trust chain:
- 20 seed codes are generated by the admin for initial distribution
- Each submitter receives 3 new codes after submission
- Codes are single-use, 8-character alphanumeric (no ambiguous characters: no 0/O/1/I/L)
- Codes can only be validated/used through `SECURITY DEFINER` functions (no direct table reads)

```sql
-- Character set excludes ambiguous characters
chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

-- Validation uses SECURITY DEFINER
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

-- Usage with row-level locking to prevent race conditions
CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  code_id UUID;
BEGIN
  SELECT id INTO code_id
  FROM invite_codes
  WHERE code = UPPER(TRIM(p_code))
  AND used_at IS NULL
  FOR UPDATE SKIP LOCKED;  -- Prevents concurrent use of same code

  IF code_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE invite_codes
  SET used_at = NOW(), used_by_submission_id = p_submission_id
  WHERE id = code_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Duplicate Detection

```typescript
// Check for duplicate submission (same IP + fingerprint within 24 hours)
if (fingerprint_hash) {
  const { data: existing } = await supabase
    .from('submissions')
    .select('id')
    .eq('ip_hash', ip_hash)
    .eq('submission_fingerprint', fingerprint_hash)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    // Update existing submission instead of creating duplicate
    await supabase
      .from('submissions')
      .update({ ...result.data, ip_hash, submission_fingerprint: fingerprint_hash })
      .eq('id', existing[0].id);

    return NextResponse.json({ success: true, updated: true, invite_codes: [] });
  }
}
```

### Input Validation
- Base salary: $100K–$10M
- Total cash: $100K–$20M, must be ≥ base salary
- Incentive target: 0–200%
- Severance multiple: 0–5x
- Non-compete: 0–60 months, 0–500 miles
- ESPP discount: 0–25%
- All enums validated against fixed lists

---

## 7. Data Export & Open Data Practices

### Export API

The `/api/data/export` endpoint generates JSON or CSV exports with segments:
- Overall (all submissions)
- By role (CEO, CFO, COO, etc.)
- By organization size (revenue ranges)
- By region

Each export includes metadata:

```json
{
  "metadata": {
    "source": "HealthComp (healthcomp.org)",
    "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    "license_url": "https://creativecommons.org/licenses/by/4.0/",
    "attribution": "Source: HealthComp, healthcomp.org",
    "generated_at": "2026-03-31T...",
    "notes": "All statistics represent aggregated, anonymized data from self-reported submissions. Minimum 5 submissions required for any statistic. No single submission represents more than 25% of any displayed figure."
  }
}
```

Only segments that pass the 5-submission threshold are included in exports. Raw data is never exported.

### Export Implementation

```typescript
export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') || 'json';

  const supabase = createAdminClient();

  // Get overall benchmarks
  const { data: overall } = await supabase.rpc('get_comp_benchmarks', {
    p_title: null, p_revenue_range: null, p_tax_status: null, p_region: null,
  });

  // Get benchmarks by role
  const roleResults: Record<string, unknown> = {};
  for (const [slug, title] of Object.entries(ROLE_SLUGS)) {
    const { data } = await supabase.rpc('get_comp_benchmarks', {
      p_title: title, p_revenue_range: null, p_tax_status: null, p_region: null,
    });
    if (data?.sufficient_data) {
      roleResults[slug] = data;
    }
  }

  // Similarly for org_size and region segments...

  const exportData = {
    metadata: { /* license info */ },
    overall: overall?.sufficient_data ? overall : null,
    by_role: roleResults,
    by_org_size: orgSizeResults,
    by_region: regionResults,
  };

  // Return JSON or CSV
}
```

---

## 8. Legal Framework

### Dual License Structure

**1. Source Code — AGPL-3.0**
- All application source code
- Anyone can view, fork, modify
- Modifications to the code must also be open source if deployed as a service

**2. Aggregated Data — CC BY 4.0**
- Percentile statistics, prevalence rates, trend data, downloadable exports
- Free to share, redistribute, remix for any purpose including commercial
- Requires attribution: "Source: HealthComp, healthcomp.org"

**3. Raw Submissions — Not Licensed**
- Individual submissions are never published, shared, or made available
- Used solely to compute aggregated benchmarks
- This protects respondent anonymity even if individual records could theoretically be re-identified with external data

### Terms of Use — Key Provisions
- Self-reported data disclaimer: "not independently verified"
- Not financial, legal, or employment advice
- Submitters represent data is genuine and they're authorized to share
- Prohibited: false data, re-identification attempts, scraping, circumventing invite codes
- Perpetual license to use anonymized submission data in aggregates

### Privacy Policy — Key Provisions
- No names, no employer names collected
- IP hashed with irreversible one-way hash (salted SHA-256)
- Browser fingerprint hashed before storage
- 5-submission minimum, 25% single-source cap
- Cannot retrieve/modify/delete individual submissions (anonymous by design)
- Third parties: Supabase (database), Vercel (hosting), Resend (email if opted in)
- No advertising cookies, no tracking pixels, no cross-site analytics

---

## 9. Survey UX & Form Implementation

### Wizard Flow
1. **Step -1**: Invite code gate (must validate before proceeding)
2. **Steps 0-4**: Five wizard steps with progress bar
3. **Step 5**: Confirmation/review with edit buttons
4. **Post-submit**: Thank you screen with 3 generated invite codes

### Form State Management
- React Hook Form with default values for all boolean fields
- localStorage persistence with debounced save (500ms)
- Form state survives page refresh
- localStorage cleared on successful submission

### Progressive Disclosure
- Step 4 (Deferred Comp) uses checkbox toggles to show/hide detail fields
- Each benefit type (457b, 457f, 401a, SERP, LTIP, RSU, PSU, ESPP) only shows dollar/detail fields when toggled on
- Even yes/no prevalence data is valuable (stated in UI)

### Navigation
- Back/Continue buttons on all steps
- "Skip" button on optional steps (4 and 5)
- Step confirmation allows jumping to any previous step via "Edit" links

### Submission Flow

```typescript
async function handleSubmit() {
  const formData = form.getValues();
  const fingerprint = await generateFingerprint();

  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      fingerprint_hash: fingerprint,
      invite_code: inviteCode || undefined,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.removeItem(STORAGE_KEY);
    setGeneratedCodes(data.invite_codes || []);
    setSubmitted(true);
  }
}
```

---

## 10. Dashboard & Data Display

### Ungated (Public)
- **Headline stats**: Total submissions, median base salary, median total cash, median incentive target
- **Bar charts**: Base salary by role, total cash by role (Recharts)
- **Prevalence stats**: Deferred comp %, LTIP %, Equity comp %, Employment agreement %
- **Role quick links**: Navigation to role-specific pages (/dashboard/ceo, /dashboard/cfo, etc.)

### Gated (Requires Supabase Auth — free account via magic link)
- **Filter panel**: Filter by title, revenue range, tax status, region
- **Detailed comp table**: Full percentile breakdowns for filtered segments

### Role-Specific Pages
- Dynamic routes: `/dashboard/[role]` for CEO, CFO, COO, CMO, CNO, CIO, CHRO, CSO, President, President & CEO
- Each page has unique SEO metadata (title, description)
- Shows role-specific benchmarks, detailed compensation table, and prevalence stats

### Data Freshness
- Benchmark data cached for 5 minutes (`revalidate: 300`)
- Submission count cached for 1 minute (`revalidate: 60`)
- Data exports cached for 1 hour

---

## Questions for Reviewer

Please evaluate this application against best practices for:

1. **Survey Design**: Are the questions comprehensive for healthcare executive compensation? Are there missing compensation elements? Are the ranges/categories appropriate? Is the question flow logical?

2. **Statistical Methodology**: Is the aggregation approach (percentiles, 5-submission minimum, 25% cap) appropriate? Are there better approaches for small-sample statistics? Should we use trimmed means or Winsorized statistics?

3. **Privacy & Anonymity**: Are the privacy safeguards sufficient? Are there re-identification risks we haven't addressed? Is the fingerprinting approach appropriate? Should we add differential privacy noise?

4. **Data Quality**: Is the invite code system sufficient for data quality? What additional validation or anomaly detection should we consider? Should we add range-based outlier detection?

5. **Legal/Compliance**: Are the terms of use and privacy policy adequate? Are there antitrust concerns with compensation benchmarking? Should we add safe harbor language?

6. **Survey Best Practices**: Does the UX follow survey methodology best practices (question ordering, progressive disclosure, completion rates, response bias)?

7. **Open Data**: Is the CC BY 4.0 approach for aggregated data appropriate? Are there risks we haven't considered?
