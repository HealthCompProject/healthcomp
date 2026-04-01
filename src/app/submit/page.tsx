'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import StepOrganization from '@/components/submit/StepOrganization';
import StepRole from '@/components/submit/StepRole';
import StepCashComp from '@/components/submit/StepCashComp';
import StepDeferredComp from '@/components/submit/StepDeferredComp';
import StepAgreement from '@/components/submit/StepAgreement';
import StepConfirmation from '@/components/submit/StepConfirmation';
import { generateFingerprint } from '@/lib/utils/fingerprint';
import {
  organizationSchema,
  roleSchema,
  cashCompSchema,
  deferredCompSchema,
  type FullSubmissionFormData,
} from '@/lib/validations/submission';
import { WIZARD_STEPS } from '@/lib/constants/roles';

const STORAGE_KEY = 'healthcomp_submission_draft';

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = invite code screen
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);

  const form = useForm<FullSubmissionFormData>({
    defaultValues: {
      has_deferred_comp: false,
      has_457b: false,
      has_457f: false,
      has_401a: false,
      has_403b_match: false,
      has_401k_match: false,
      has_serp: false,
      has_split_dollar: false,
      has_ltip: false,
      has_equity_comp: false,
      has_rsus: false,
      has_psus: false,
      has_espp: false,
      has_change_in_control: false,
      severance_includes_bonus: false,
    },
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step != null) setCurrentStep(parsed.step);
        if (parsed.inviteCode) setInviteCode(parsed.inviteCode);
        if (parsed.data) {
          form.reset(parsed.data);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [form]);

  // Save to localStorage on changes (debounced)
  const saveToStorage = useCallback(() => {
    try {
      const data = form.getValues();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: currentStep, data, inviteCode })
      );
    } catch {
      // Ignore storage errors
    }
  }, [form, currentStep, inviteCode]);

  useEffect(() => {
    const timer = setTimeout(saveToStorage, 500);
    return () => clearTimeout(timer);
  });

  async function handleInviteSubmit() {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      setInviteError('Please enter an invite code');
      return;
    }

    setValidatingCode(true);
    setInviteError('');

    try {
      const res = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.valid) {
        setInviteCode(code);
        setCurrentStep(0);
      } else {
        setInviteError('This code is invalid or has already been used');
      }
    } catch {
      setInviteError('Could not validate code. Please try again.');
    } finally {
      setValidatingCode(false);
    }
  }

  async function validateCurrentStep(): Promise<boolean> {
    const values = form.getValues();
    const schemas = [organizationSchema, roleSchema, cashCompSchema, deferredCompSchema, null];
    const schema = schemas[currentStep];

    if (!schema) return true;

    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FullSubmissionFormData;
        form.setError(fieldName, { message: issue.message });
      });
      return false;
    }

    return true;
  }

  async function handleNext() {
    const valid = await validateCurrentStep();
    if (!valid) return;

    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleGoToStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSkip() {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
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
      } else {
        const error = await res.json();
        console.error('Submission failed:', error);
        alert(error.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── INVITE CODE SCREEN ──
  if (currentStep === -1) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-lg mx-auto px-4 sm:px-6">
            <div className="bg-navy-900/30 border border-white/5 rounded-2xl p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl font-bold text-white mb-3">
                  Enter Your Invite Code
                </h1>
                <p className="text-white/50 text-sm leading-relaxed">
                  This platform uses invite codes to maintain data quality. Each code is
                  single-use. After you submit, you&apos;ll receive 3 codes to share
                  with peers.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Invite Code"
                  placeholder="e.g., ABCD1234"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setInviteError('');
                  }}
                  error={inviteError}
                  className="text-center"
                />

                <Button
                  className="w-full"
                  onClick={handleInviteSubmit}
                  loading={validatingCode}
                >
                  Continue
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/30 text-sm">
                  Don&apos;t have a code? Reach out to a colleague who has already
                  contributed, or{' '}
                  <a
                    href="mailto:info@healthcomp.org"
                    className="text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    contact us
                  </a>{' '}
                  to request one.
                </p>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── THANK YOU SCREEN ──
  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-12">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-serif text-3xl font-bold text-white mb-4">
                Thank You
              </h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Your compensation data has been submitted and will be included in our
                aggregated benchmarks. You&apos;re helping build a more transparent industry.
              </p>

              {/* Invite codes to share */}
              {generatedCodes.length > 0 && (
                <div className="bg-navy-800/50 border border-gold-500/20 rounded-xl p-6 mb-8 text-left">
                  <h2 className="font-serif text-lg font-bold text-gold-500 mb-2">
                    Your Invite Codes
                  </h2>
                  <p className="text-white/50 text-sm mb-4">
                    Share these with healthcare executive peers. Each code is single-use.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {generatedCodes.map((code) => (
                      <div
                        key={code}
                        className="bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-center"
                      >
                        <span className="font-mono text-lg font-bold text-white tracking-wider">
                          {code}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCodes.join('\n'));
                    }}
                    className="mt-3 text-sm text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    Copy all codes
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button>View Benchmarks</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── WIZARD STEPS ──
  const isConfirmationStep = currentStep === WIZARD_STEPS.length;
  const isOptionalStep = !isConfirmationStep && WIZARD_STEPS[currentStep]?.optional;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Progress */}
          <ProgressBar currentStep={Math.min(currentStep, WIZARD_STEPS.length - 1)} className="mb-10" />

          {/* Step content */}
          <div className="bg-navy-900/30 border border-white/5 rounded-2xl p-6 sm:p-8">
            {currentStep === 0 && <StepOrganization form={form} />}
            {currentStep === 1 && <StepRole form={form} />}
            {currentStep === 2 && <StepCashComp form={form} />}
            {currentStep === 3 && <StepDeferredComp form={form} />}
            {currentStep === 4 && <StepAgreement form={form} />}
            {currentStep === 5 && <StepConfirmation form={form} onGoToStep={handleGoToStep} />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
              <div>
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isOptionalStep && (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                )}

                {isConfirmationStep ? (
                  <Button onClick={handleSubmit} loading={isSubmitting}>
                    Submit Anonymously
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
