'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function DashboardGate() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setStatus('error');
      } else {
        setStatus('sent');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm rounded-xl z-10" />

      {/* Gate content */}
      <div className="relative z-20 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-14 h-14 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="font-serif text-2xl font-bold text-white mb-3">
            Unlock Detailed Benchmarks
          </h3>
          <p className="text-white/50 text-sm mb-6">
            Create a free account to access filtered percentile breakdowns,
            detailed comp tables, and downloadable reports.
          </p>

          {status === 'sent' ? (
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-4">
              <p className="text-gold-500 font-medium">Check your email!</p>
              <p className="text-white/50 text-sm mt-1">
                We sent a magic link to {email}. Click it to access your benchmarks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-lg border bg-navy-800 border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              />
              <Button className="w-full" loading={status === 'loading'}>
                Get Free Access
              </Button>
              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
              )}
              <p className="text-white/30 text-xs">
                No password required. We&apos;ll send you a magic link.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
