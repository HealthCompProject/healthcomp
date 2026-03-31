'use client';

import { WIZARD_STEPS } from '@/lib/constants/roles';

interface ProgressBarProps {
  currentStep: number;
  className?: string;
}

export default function ProgressBar({ currentStep, className = '' }: ProgressBarProps) {
  return (
    <div className={className}>
      {/* Mobile: simple bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </span>
          <span className="text-sm text-white/50">
            {WIZARD_STEPS[currentStep].label}
          </span>
        </div>
        <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-300
                    ${index < currentStep
                      ? 'bg-gold-500 text-navy-950'
                      : index === currentStep
                        ? 'bg-gold-500 text-navy-950 ring-4 ring-gold-500/20'
                        : 'bg-navy-800 text-white/40'
                    }
                  `}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${
                    index <= currentStep ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step.label}
                  {step.optional && (
                    <span className="block text-white/30 text-[10px]">Optional</span>
                  )}
                </span>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 mt-[-1.25rem] ${
                    index < currentStep ? 'bg-gold-500' : 'bg-navy-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
