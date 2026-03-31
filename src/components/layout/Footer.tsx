import Link from 'next/link';
import EmailCapture from '@/components/shared/EmailCapture';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <span className="font-serif text-xl font-bold text-white tracking-tight">
              Health<span className="text-gold-500">Comp</span>
            </span>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">
              The first free compensation benchmark built by and for healthcare
              executives. Anonymous, aggregated, and independent.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  Submit Your Data
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  View Benchmarks
                </Link>
              </li>
              <li>
                <Link
                  href="/data"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  Open Data
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  About & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/50 hover:text-gold-500 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">
              Quarterly Insights
            </h3>
            <p className="text-sm text-white/50 mb-4">
              Get healthcare executive compensation trends and analysis delivered
              to your inbox.
            </p>
            <EmailCapture source="footer" />
          </div>
        </div>

        {/* Advisory disclaimer */}
        <p className="mt-12 pt-8 border-t border-white/5 text-xs text-white/20 leading-relaxed text-center max-w-3xl mx-auto">
          HealthComp provides self-reported, aggregated compensation data for informational
          purposes only. Nothing on this platform constitutes financial, legal, tax, or
          employment advice. Consult qualified professional advisors before making compensation
          decisions. See our{' '}
          <Link href="/terms" className="text-white/30 hover:text-white/50 transition-colors underline">
            Terms of Use
          </Link>
          .
        </p>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} HealthComp Project. Code licensed under{' '}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              AGPL-3.0
            </a>
            . Aggregated data licensed under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              CC BY 4.0
            </a>
            .
          </p>
          <span className="text-sm text-white/30 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Open Source (AGPL-3.0)
          </span>
        </div>
      </div>
    </footer>
  );
}
