'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  source: 'footer' | 'post_submission' | 'dashboard_gate';
  headline?: string;
  subtext?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export default function EmailCapture({
  source,
  headline,
  subtext,
  variant = 'dark',
  className = '',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={className}>
        <p className={`text-sm font-medium ${variant === 'dark' ? 'text-gold-500' : 'text-gold-600'}`}>
          You&apos;re in! Watch for our next quarterly report.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {headline && (
        <h4
          className={`text-lg font-serif font-bold mb-2 ${
            variant === 'dark' ? 'text-white' : 'text-navy-950'
          }`}
        >
          {headline}
        </h4>
      )}
      {subtext && (
        <p
          className={`text-sm mb-3 ${
            variant === 'dark' ? 'text-white/50' : 'text-navy-500'
          }`}
        >
          {subtext}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`
            flex-1 rounded-lg border px-3 py-2 text-sm
            transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/20
            ${variant === 'dark'
              ? 'bg-navy-800 border-white/10 text-white placeholder:text-white/30 focus:border-gold-500'
              : 'bg-white border-navy-200 text-navy-950 placeholder:text-navy-400 focus:border-gold-500'
            }
          `}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-1 text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
