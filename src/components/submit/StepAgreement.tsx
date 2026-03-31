'use client';

import { UseFormReturn } from 'react-hook-form';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CIC_TRIGGERS } from '@/lib/constants/roles';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

interface StepAgreementProps {
  form: UseFormReturn<FullSubmissionFormData>;
}

export default function StepAgreement({ form }: StepAgreementProps) {
  const { register, watch, formState: { errors } } = form;

  const hasCIC = watch('has_change_in_control');

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        Employment Agreement Details
      </h2>
      <p className="text-white/50 text-sm mb-2">
        This section is optional. Employment agreement terms are rarely benchmarked publicly.
      </p>
      <p className="text-gold-500/80 text-sm mb-8">
        Even partial data here is highly valuable for the healthcare executive community.
      </p>

      <div className="space-y-6">
        <Input
          label="Severance Multiple"
          type="number"
          step="0.5"
          placeholder="2.0"
          error={errors.severance_multiple?.message}
          helperText="Multiple of base salary (e.g., 2.0 for 2x base)"
          {...register('severance_multiple', { valueAsNumber: true })}
        />

        <Checkbox
          label="Severance includes bonus in calculation"
          description="Is the severance calculation based on base + bonus, or base only?"
          {...register('severance_includes_bonus')}
        />

        <div className="border-t border-white/10 pt-6 space-y-6">
          <Checkbox
            label="Change-in-Control Provision"
            description="Does your agreement include enhanced severance upon a change in control?"
            {...register('has_change_in_control')}
          />

          {hasCIC && (
            <div className="ml-7 space-y-4 border-l-2 border-gold-500/20 pl-6">
              <Select
                label="CIC Trigger"
                options={[...CIC_TRIGGERS]}
                error={errors.cic_trigger?.message}
                helperText="Single trigger: payout upon CIC event. Double trigger: CIC + termination required."
                {...register('cic_trigger')}
              />

              <Input
                label="CIC Multiple"
                type="number"
                step="0.5"
                placeholder="3.0"
                error={errors.cic_multiple?.message}
                helperText="Multiple of base salary for CIC severance"
                {...register('cic_multiple', { valueAsNumber: true })}
              />
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-6 space-y-6">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">
            Non-Compete
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Non-Compete Duration (Months)"
              type="number"
              placeholder="24"
              error={errors.non_compete_months?.message}
              {...register('non_compete_months', { valueAsNumber: true })}
            />

            <Input
              label="Non-Compete Radius (Miles)"
              type="number"
              placeholder="50"
              error={errors.non_compete_radius_miles?.message}
              {...register('non_compete_radius_miles', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
