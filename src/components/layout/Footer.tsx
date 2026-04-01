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
          The Healthcare Compensation Project provides self-reported, aggregated compensation data for informational
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
            &copy; {new Date().getFullYear()} The Healthcare Compensation Project. Code licensed under{' '}
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
          <a
            href="https://github.com/HealthCompProject/healthcomp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/30 hover:text-white/50 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Open Source (AGPL-3.0)
          </a>
        </div>
      </div>
    </footer>
  );
}
