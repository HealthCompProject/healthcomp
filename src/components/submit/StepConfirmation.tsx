'use client';

import { UseFormReturn } from 'react-hook-form';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import type { FullSubmissionFormData } from '@/lib/validations/submission';

interface StepConfirmationProps {
  form: UseFormReturn<FullSubmissionFormData>;
  onGoToStep: (step: number) => void;
}

function SectionHeader({ title, step, onEdit }: { title: string; step: number; onEdit: (step: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">{title}</h3>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
      >
        Edit
      </button>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value || value === '—' || value === 'NaN' || value === '$NaN') return null;
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

export default function StepConfirmation({ form, onGoToStep }: StepConfirmationProps) {
  const data = form.getValues();

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-white mb-2">
        Review Your Submission
      </h2>
      <p className="text-white/50 text-sm mb-8">
        Please review your data below. Your submission is anonymous and will only appear in aggregate.
      </p>

      <div className="space-y-6">
        {/* Organization */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <SectionHeader title="Organization" step={0} onEdit={onGoToStep} />
          <DataRow label="Revenue Range" value={data.net_patient_revenue_range?.replace(/_/g, ' ')} />
          <DataRow label="Licensed Beds" value={data.licensed_beds_range?.replace(/_/g, ' ')} />
          <DataRow label="Tax Status" value={data.tax_status} />
          <DataRow label="System Affiliation" value={data.system_affiliation?.replace(/_/g, ' ')} />
          <DataRow label="Region" value={data.region} />
          <DataRow label="Setting" value={data.setting} />
          <DataRow label="Teaching Status" value={data.teaching_status?.replace(/_/g, ' ')} />
        </div>

        {/* Role */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <SectionHeader title="Role" step={1} onEdit={onGoToStep} />
          <DataRow label="Title" value={data.title} />
          <DataRow label="Reports To" value={data.reports_to} />
          <DataRow label="Years in Role" value={data.years_in_role?.replace(/_/g, ' ')} />
        </div>

        {/* Cash Compensation */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <SectionHeader title="Cash Compensation" step={2} onEdit={onGoToStep} />
          <DataRow label="Base Salary" value={formatCurrency(data.base_salary)} />
          <DataRow label="Incentive Target" value={data.annual_incentive_target_pct ? `${data.annual_incentive_target_pct}%` : undefined} />
          <DataRow label="Actual Incentive" value={formatCurrency(data.annual_incentive_actual)} />
          <DataRow label="Total Cash" value={formatCurrency(data.total_cash_compensation)} />
          <DataRow label="Signing Bonus" value={formatCurrency(data.signing_bonus)} />
          <DataRow label="Retention Bonus" value={formatCurrency(data.retention_bonus)} />
        </div>

        {/* Deferred Comp */}
        {data.has_deferred_comp && (
          <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
            <SectionHeader title="Deferred Compensation" step={3} onEdit={onGoToStep} />
            <DataRow label="457(b)" value={data.has_457b ? `Yes — ${formatCurrency(data.employer_457b_contribution)}/yr` : 'No'} />
            <DataRow label="457(f)" value={data.has_457f ? `Yes — ${formatCurrency(data.employer_457f_contribution)}/yr` : 'No'} />
            <DataRow label="401(a)" value={data.has_401a ? `Yes — ${formatCurrency(data.employer_401a_contribution)}/yr` : 'No'} />
            <DataRow label="403(b) Match" value={data.has_403b_match ? `Yes — ${formatCurrency(data.employer_403b_match)}/yr` : 'No'} />
            <DataRow label="401(k) Match" value={data.has_401k_match ? `Yes — ${formatCurrency(data.employer_401k_match)}/yr` : 'No'} />
            <DataRow label="SERP" value={data.has_serp ? `Yes — ${formatCurrency(data.serp_annual_value)}/yr` : 'No'} />
            <DataRow label="Split-Dollar" value={data.has_split_dollar ? 'Yes' : 'No'} />
            {data.has_ltip && (
              <>
                <DataRow label="LTIP Target" value={data.ltip_target_pct ? `${data.ltip_target_pct}% of base` : undefined} />
                <DataRow label="LTIP Type" value={data.ltip_type?.replace(/_/g, ' ')} />
              </>
            )}
          </div>
        )}

        {/* Employment Agreement */}
        {(data.severance_multiple || data.has_change_in_control || data.non_compete_months) && (
          <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
            <SectionHeader title="Employment Agreement" step={4} onEdit={onGoToStep} />
            <DataRow label="Severance Multiple" value={data.severance_multiple ? `${data.severance_multiple}x` : undefined} />
            <DataRow label="Severance Includes Bonus" value={data.severance_includes_bonus ? 'Yes' : 'No'} />
            <DataRow label="Change-in-Control" value={data.has_change_in_control ? `Yes — ${data.cic_multiple}x (${data.cic_trigger} trigger)` : 'No'} />
            <DataRow label="Non-Compete" value={data.non_compete_months ? `${data.non_compete_months} months / ${data.non_compete_radius_miles || '—'} miles` : undefined} />
          </div>
        )}

        {/* Feedback */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
            Help Us Improve
          </h3>
          <p className="text-sm text-white/40 mb-3">
            Is there anything major we missed? Any compensation elements, benefits, or contract
            terms that should be included in future versions of this survey?
          </p>
          <textarea
            className="w-full rounded-lg border bg-navy-800 border-white/10 text-white placeholder:text-white/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 min-h-[80px] resize-y"
            placeholder="Optional — any feedback on compensation elements we should add, questions that were unclear, etc."
            {...form.register('feedback')}
          />
        </div>

        {/* Privacy reminder */}
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gold-500">Your privacy is protected</p>
              <p className="text-sm text-white/50 mt-1">
                Your data will only appear in aggregate with at least 4 other submissions.
                No individual data is ever displayed or shared.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/25 text-center leading-relaxed">
          This survey is an independent, open-source project. Data is self-reported and not
          independently verified. Results are for informational and benchmarking purposes only
          and do not constitute financial, legal, or employment advice.
        </p>
      </div>
    </div>
  );
}
