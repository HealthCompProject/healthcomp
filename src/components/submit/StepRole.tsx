'use client';

import { UseFormReturn } from 'react-hook-form';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import {
  EXECUTIVE_TITLES,
  REPORTS_TO_OPTIONS,
  YEARS_IN_ROLE_OPTIONS,
} from '@/lib/constants/roles';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

const OTHER_TITLES = ['Other C-Suite', 'Other SVP/EVP', 'Other VP'];

interface StepRoleProps {
  form: UseFormReturn<FullSubmissionFormData>;
}

export default function StepRole({ form }: StepRoleProps) {
  const { register, watch, formState: { errors } } = form;

  const selectedTitle = watch('title');
  const selectedReportsTo = watch('reports_to');
  const showTitleInput = OTHER_TITLES.includes(selectedTitle);
  const showReportsToInput = selectedReportsTo === 'other';

  const titleOptions = EXECUTIVE_TITLES.map((title) => ({
    value: title,
    label: title,
  }));

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        Your Role
      </h2>
      <p className="text-white/50 text-sm mb-8">
        Tell us about your position.
      </p>

      <div className="space-y-6">
        <Select
          label="Title"
          options={titleOptions}
          error={errors.title?.message}
          {...register('title')}
        />

        {showTitleInput && (
          <Input
            label="Please specify your title"
            placeholder="e.g., Chief Transformation Officer"
            {...register('title_other' as keyof FullSubmissionFormData)}
          />
        )}

        <Select
          label="Reports To"
          options={[...REPORTS_TO_OPTIONS]}
          error={errors.reports_to?.message}
          helperText="Optional"
          {...register('reports_to')}
        />

        {showReportsToInput && (
          <Input
            label="Please specify who you report to"
            placeholder="e.g., Chief Medical Officer"
            {...register('reports_to_other' as keyof FullSubmissionFormData)}
          />
        )}

        <Select
          label="Years in Current Role"
          options={[...YEARS_IN_ROLE_OPTIONS]}
          error={errors.years_in_role?.message}
          helperText="Optional"
          {...register('years_in_role')}
        />
      </div>
    </div>
  );
}
