'use client';

import { UseFormReturn } from 'react-hook-form';
import Select from '@/components/ui/Select';
import {
  NPR_RANGES,
  LICENSED_BEDS_RANGES,
  TAX_STATUSES,
  SYSTEM_AFFILIATIONS,
  REGIONS,
  SETTINGS,
  TEACHING_STATUSES,
} from '@/lib/constants/roles';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

interface StepOrganizationProps {
  form: UseFormReturn<FullSubmissionFormData>;
}

export default function StepOrganization({ form }: StepOrganizationProps) {
  const { register, formState: { errors } } = form;

  return (
    <div>
      {/* Trust signal — anonymity reminder */}
      <div className="flex items-start gap-3 bg-navy-800/50 border border-white/10 rounded-lg px-4 py-3 mb-6">
        <svg className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-sm text-white/50">
          <span className="text-white/70 font-medium">Your answers are anonymous.</span>{' '}
          We never collect your name, email, or employer name. All data is shown only in aggregate.
        </p>
      </div>

      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        About Your Organization
      </h2>
      <p className="text-white/50 text-sm mb-8">
        This helps us compare you to peers at similar institutions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          label="Net Patient Revenue"
          options={[...NPR_RANGES]}
          error={errors.net_patient_revenue_range?.message}
          helperText="Total annual revenue from patient care services, net of contractual adjustments"
          {...register('net_patient_revenue_range')}
        />

        <Select
          label="Licensed Beds"
          options={[...LICENSED_BEDS_RANGES]}
          error={errors.licensed_beds_range?.message}
          {...register('licensed_beds_range')}
        />

        <Select
          label="Tax Status"
          options={[...TAX_STATUSES]}
          error={errors.tax_status?.message}
          {...register('tax_status')}
        />

        <Select
          label="System Affiliation"
          options={[...SYSTEM_AFFILIATIONS]}
          error={errors.system_affiliation?.message}
          {...register('system_affiliation')}
        />

        <Select
          label="Region"
          options={[...REGIONS]}
          error={errors.region?.message}
          {...register('region')}
        />

        <Select
          label="Setting"
          options={[...SETTINGS]}
          error={errors.setting?.message}
          {...register('setting')}
        />

        <Select
          label="Teaching Status"
          options={[...TEACHING_STATUSES]}
          error={errors.teaching_status?.message}
          helperText="Optional"
          {...register('teaching_status')}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}
