'use client';

import { UseFormReturn } from 'react-hook-form';
import Input from '@/components/ui/Input';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

interface StepCashCompProps {
  form: UseFormReturn<FullSubmissionFormData>;
}

export default function StepCashComp({ form }: StepCashCompProps) {
  const { register, formState: { errors } } = form;

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        Cash Compensation
      </h2>
      <p className="text-white/50 text-sm mb-8">
        Enter your current annualized compensation.
      </p>

      <div className="space-y-6">
        <Input
          label="Base Salary"
          prefix="$"
          type="number"
          placeholder="500,000"
          error={errors.base_salary?.message}
          helperText="Annual base salary before incentives"
          {...register('base_salary', { valueAsNumber: true })}
        />

        <Input
          label="Annual Incentive Target (%)"
          type="number"
          placeholder="40"
          error={errors.annual_incentive_target_pct?.message}
          helperText="Target bonus as a percentage of base salary (e.g., 40 for 40%)"
          {...register('annual_incentive_target_pct', { valueAsNumber: true })}
        />

        <Input
          label="Annual Incentive Actual (Last Year)"
          prefix="$"
          type="number"
          placeholder="200,000"
          error={errors.annual_incentive_actual?.message}
          helperText="Actual incentive/bonus received for the most recent completed year"
          {...register('annual_incentive_actual', { valueAsNumber: true })}
        />

        <Input
          label="Total Cash Compensation"
          prefix="$"
          type="number"
          placeholder="700,000"
          error={errors.total_cash_compensation?.message}
          helperText="Base salary + actual annual incentive + any other cash payments"
          {...register('total_cash_compensation', { valueAsNumber: true })}
        />

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">
            Additional Cash (Optional)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Signing Bonus"
              prefix="$"
              type="number"
              placeholder="0"
              error={errors.signing_bonus?.message}
              {...register('signing_bonus', { valueAsNumber: true })}
            />

            <Input
              label="Retention Bonus"
              prefix="$"
              type="number"
              placeholder="0"
              error={errors.retention_bonus?.message}
              {...register('retention_bonus', { valueAsNumber: true })}
            />

            <Input
              label="Retention Bonus Period (Years)"
              type="number"
              step="0.5"
              placeholder="3"
              error={errors.retention_bonus_period_years?.message}
              {...register('retention_bonus_period_years', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
