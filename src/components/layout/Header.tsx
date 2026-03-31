'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-white tracking-tight">
              Health<span className="text-gold-500">Comp</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Benchmarks
            </Link>
            <Link
              href="/data"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Open Data
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link href="/submit">
              <Button size="sm">Contribute Data</Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm font-medium text-white/70 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block text-sm font-medium text-white/70 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Benchmarks
            </Link>
            <Link
              href="/data"
              className="block text-sm font-medium text-white/70 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Open Data
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium text-white/70 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link href="/submit" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">
                Contribute Data
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
