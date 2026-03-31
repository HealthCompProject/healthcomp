'use client';

import { useEffect, useState } from 'react';

export default function SubmissionCounter({ className = '' }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    fetch('/api/submission-count')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, []);

  // Animate count-up
  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 1500;
    const steps = 30;
    const increment = count / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(interval);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [count]);

  if (count === null) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
      <p className="text-sm text-white/60">
        <span className="font-bold text-white">{displayCount.toLocaleString()}</span>{' '}
        executive{count !== 1 ? 's have' : ' has'} contributed
      </p>
    </div>
  );
}
