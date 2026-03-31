'use client';

import { UseFormReturn } from 'react-hook-form';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { VESTING_TYPES, SERP_TYPES, LTIP_TYPES } from '@/lib/constants/roles';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

interface StepDeferredCompProps {
  form: UseFormReturn<FullSubmissionFormData>;
}

export default function StepDeferredComp({ form }: StepDeferredCompProps) {
  const { register, watch, formState: { errors } } = form;

  const hasDeferred = watch('has_deferred_comp');
  const has457b = watch('has_457b');
  const has457f = watch('has_457f');
  const has401a = watch('has_401a');
  const has403bMatch = watch('has_403b_match');
  const has401kMatch = watch('has_401k_match');
  const hasSerp = watch('has_serp');
  const hasLtip = watch('has_ltip');
  const hasEquityComp = watch('has_equity_comp');
  const hasRsus = watch('has_rsus');
  const hasPsus = watch('has_psus');
  const hasEspp = watch('has_espp');

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        Deferred Compensation, Equity & Long-Term Incentives
      </h2>
      <p className="text-white/50 text-sm mb-2">
        This section is optional but adds significant value to our benchmarks.
      </p>
      <p className="text-gold-500/80 text-sm mb-8">
        Even indicating yes/no for each plan type helps us measure prevalence across the industry.
      </p>

      <div className="space-y-6">
        {/* ── DEFERRED COMPENSATION ── */}
        <Checkbox
          label="I have a deferred compensation arrangement"
          description="Check if you have any employer-provided deferred compensation beyond a standard 401(k)/403(b)"
          {...register('has_deferred_comp')}
        />
        {errors.has_deferred_comp?.message && (
          <p className="text-red-400 text-sm -mt-2">{errors.has_deferred_comp.message}</p>
        )}
        {errors.has_equity_comp?.message && !hasDeferred && (
          <p className="text-red-400 text-sm -mt-2">{errors.has_equity_comp.message}</p>
        )}

        {hasDeferred && (
          <div className="ml-7 space-y-8 border-l-2 border-gold-500/20 pl-6">
            {/* 457(b) */}
            <div className="space-y-4">
              <Checkbox
                label="457(b) Plan"
                description="Governmental or tax-exempt organization deferred comp"
                {...register('has_457b')}
              />
              {has457b && (
                <Input
                  label="Employer Annual Contribution"
                  prefix="$"
                  type="number"
                  placeholder="30,000"
                  error={errors.employer_457b_contribution?.message}
                  {...register('employer_457b_contribution', { valueAsNumber: true })}
                />
              )}
            </div>

            {/* 457(f) */}
            <div className="space-y-4">
              <Checkbox
                label="457(f) Plan"
                description="Ineligible deferred compensation (often larger amounts with substantial risk of forfeiture)"
                {...register('has_457f')}
              />
              {has457f && (
                <div className="space-y-4">
                  <Input
                    label="Employer Annual Contribution"
                    prefix="$"
                    type="number"
                    placeholder="100,000"
                    error={errors.employer_457f_contribution?.message}
                    {...register('employer_457f_contribution', { valueAsNumber: true })}
                  />
                  <Select
                    label="Vesting Schedule"
                    options={[...VESTING_TYPES]}
                    error={errors.vesting_457f_type?.message}
                    {...register('vesting_457f_type')}
                  />
                  <Input
                    label="Vesting Period (Years)"
                    type="number"
                    placeholder="5"
                    error={errors.vesting_457f_years?.message}
                    {...register('vesting_457f_years', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>

            {/* 401(a) */}
            <div className="space-y-4">
              <Checkbox
                label="401(a) Plan"
                description="Employer-funded defined contribution plan (common in government and some nonprofit systems)"
                {...register('has_401a')}
              />
              {has401a && (
                <Input
                  label="Employer Annual Contribution"
                  prefix="$"
                  type="number"
                  placeholder="25,000"
                  error={errors.employer_401a_contribution?.message}
                  {...register('employer_401a_contribution', { valueAsNumber: true })}
                />
              )}
            </div>

            {/* 403(b) Employer Match */}
            <div className="space-y-4">
              <Checkbox
                label="403(b) Employer Match"
                description="Employer matching contributions to your 403(b) plan (common in nonprofit systems)"
                {...register('has_403b_match')}
              />
              {has403bMatch && (
                <Input
                  label="Employer Annual Match"
                  prefix="$"
                  type="number"
                  placeholder="15,000"
                  error={errors.employer_403b_match?.message}
                  helperText="Total annual employer match (not your own contributions)"
                  {...register('employer_403b_match', { valueAsNumber: true })}
                />
              )}
            </div>

            {/* 401(k) Employer Match */}
            <div className="space-y-4">
              <Checkbox
                label="401(k) Employer Match"
                description="Employer matching contributions to your 401(k) plan (common in for-profit systems)"
                {...register('has_401k_match')}
              />
              {has401kMatch && (
                <Input
                  label="Employer Annual Match"
                  prefix="$"
                  type="number"
                  placeholder="15,000"
                  error={errors.employer_401k_match?.message}
                  helperText="Total annual employer match (not your own contributions)"
                  {...register('employer_401k_match', { valueAsNumber: true })}
                />
              )}
            </div>

            {/* SERP */}
            <div className="space-y-4">
              <Checkbox
                label="Supplemental Executive Retirement Plan (SERP)"
                {...register('has_serp')}
              />
              {hasSerp && (
                <div className="space-y-4">
                  <Select
                    label="SERP Type"
                    options={[...SERP_TYPES]}
                    error={errors.serp_type?.message}
                    {...register('serp_type')}
                  />
                  <Input
                    label="Annual Value / Contribution"
                    prefix="$"
                    type="number"
                    placeholder="50,000"
                    error={errors.serp_annual_value?.message}
                    {...register('serp_annual_value', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>

            {/* Split Dollar */}
            <Checkbox
              label="Split-Dollar Life Insurance Arrangement"
              {...register('has_split_dollar')}
            />
          </div>
        )}

        {/* ── LONG-TERM INCENTIVE PLANS ── */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <Checkbox
            label="Long-Term Incentive Plan (LTIP)"
            description="Multi-year incentive plan — includes phantom equity, performance units, restricted cash awards, and similar long-term arrangements"
            {...register('has_ltip')}
          />

          {hasLtip && (
            <div className="ml-7 space-y-4 border-l-2 border-gold-500/20 pl-6">
              <Input
                label="LTIP Target (% of Base)"
                type="number"
                placeholder="30"
                error={errors.ltip_target_pct?.message}
                helperText="Annual target value as a percentage of base salary"
                {...register('ltip_target_pct', { valueAsNumber: true })}
              />
              <Select
                label="LTIP Type"
                options={[...LTIP_TYPES]}
                error={errors.ltip_type?.message}
                {...register('ltip_type')}
              />
              <Input
                label="Performance Period (Years)"
                type="number"
                placeholder="3"
                error={errors.ltip_performance_period_years?.message}
                {...register('ltip_performance_period_years', { valueAsNumber: true })}
              />
            </div>
          )}
        </div>

        {/* ── EQUITY COMPENSATION (For-Profit / Publicly Traded Systems) ── */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <Checkbox
            label="Equity Compensation"
            description="Stock-based compensation from a publicly traded or for-profit health system (e.g., HCA, UHS, Ardent Health, Tenet, CHS)"
            {...register('has_equity_comp')}
          />
          {errors.has_equity_comp?.message && (
            <p className="text-red-400 text-sm -mt-2">{errors.has_equity_comp.message}</p>
          )}

          {hasEquityComp && (
            <div className="ml-7 space-y-8 border-l-2 border-gold-500/20 pl-6">
              {/* RSUs */}
              <div className="space-y-4">
                <Checkbox
                  label="Restricted Stock Units (RSUs)"
                  description="Stock units that vest over time"
                  {...register('has_rsus')}
                />
                {hasRsus && (
                  <Input
                    label="Annual RSU Grant Value"
                    prefix="$"
                    type="number"
                    placeholder="150,000"
                    error={errors.rsu_annual_value?.message}
                    helperText="Approximate annual value of RSU grants at time of award"
                    {...register('rsu_annual_value', { valueAsNumber: true })}
                  />
                )}
              </div>

              {/* PSUs */}
              <div className="space-y-4">
                <Checkbox
                  label="Performance Stock Units (PSUs)"
                  description="Stock units tied to performance metrics (revenue, EBITDA, TSR, etc.)"
                  {...register('has_psus')}
                />
                {hasPsus && (
                  <Input
                    label="Annual PSU Target Value"
                    prefix="$"
                    type="number"
                    placeholder="100,000"
                    error={errors.psu_annual_target?.message}
                    helperText="Target value at 100% achievement"
                    {...register('psu_annual_target', { valueAsNumber: true })}
                  />
                )}
              </div>

              {/* ESPP */}
              <div className="space-y-4">
                <Checkbox
                  label="Employee Stock Purchase Plan (ESPP)"
                  description="Discounted stock purchase program"
                  {...register('has_espp')}
                />
                {hasEspp && (
                  <Input
                    label="ESPP Discount (%)"
                    type="number"
                    placeholder="15"
                    error={errors.espp_discount_pct?.message}
                    helperText="Discount off market price (typically 5–15%)"
                    {...register('espp_discount_pct', { valueAsNumber: true })}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
