import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How The Healthcare Executive Compensation Project collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm mb-12">
            Last updated: March 2026
          </p>

          <div className="prose-custom space-y-10">
            <Section title="What We Collect">
              <p>
                The Healthcare Executive Compensation Project collects anonymous compensation data through our
                survey form. This data includes organizational characteristics
                (size, region, tax status), role information (title, tenure),
                and compensation details (salary, incentives, deferred
                compensation, equity, and employment agreement terms).
              </p>
              <p>
                We do <strong>not</strong> collect your name, employer name, or
                any information that could directly identify you or your
                organization.
              </p>
            </Section>

            <Section title="How We Use Your Data">
              <ul>
                <li>
                  <strong>Aggregated benchmarks:</strong> Your submission is
                  combined with others to produce percentile-based compensation
                  statistics (25th, 50th, 75th percentiles). Individual
                  submissions are never displayed.
                </li>
                <li>
                  <strong>Prevalence statistics:</strong> We report what
                  percentage of respondents have certain plan types (deferred
                  comp, LTIP, severance, etc.) to help executives understand
                  what is standard in the market.
                </li>
                <li>
                  <strong>Email (optional):</strong> If you provide your email
                  to create a free account or subscribe to our newsletter, we
                  use it solely for account access and to send quarterly
                  compensation insights. We never sell or share your email.
                </li>
              </ul>
            </Section>

            <Section title="Privacy Thresholds">
              <p>
                We enforce strict aggregation rules to protect your anonymity:
              </p>
              <ul>
                <li>
                  No statistic is ever displayed unless it represents{' '}
                  <strong>at least 5 submissions</strong>.
                </li>
                <li>
                  No single submission can represent more than{' '}
                  <strong>25% of any displayed statistic</strong>.
                </li>
                <li>
                  We only show percentile ranges and prevalence rates — never
                  individual data points.
                </li>
                <li>
                  When a filter combination returns fewer than 5 results, we
                  display an &ldquo;insufficient data&rdquo; message instead.
                </li>
              </ul>
            </Section>

            <Section title="Duplicate Detection">
              <p>
                To maintain data quality, we use a one-way hash of your IP
                address and a browser fingerprint (screen resolution, timezone,
                and language settings) to detect duplicate submissions. These
                hashes are irreversible — we cannot determine your actual IP
                address or identity from them. They are used solely to prevent
                the same person from submitting multiple times within a 24-hour
                period.
              </p>
            </Section>

            <Section title="Invite Codes">
              <p>
                The Healthcare Executive Compensation Project uses an invite code system to maintain data quality.
                Each invite code is single-use and tracks only whether it has
                been used — not who used it. After submitting, you receive 3
                new codes to share with peers. The invite system creates a trust
                chain without collecting identifying information.
              </p>
            </Section>

            <Section title="Data Storage & Security">
              <p>
                Your data is stored in a secured PostgreSQL database hosted by
                Supabase with row-level security policies. The public API and
                website only access data through aggregation functions that
                enforce our privacy thresholds. Individual submissions are never
                exposed publicly.
              </p>
              <p>
                All data is transmitted over HTTPS. We do not store raw IP
                addresses, and browser fingerprints are hashed before storage.
              </p>
            </Section>

            <Section title="Cookies & Analytics">
              <p>
                We use essential cookies only for authentication (if you create
                a free account). We do not use advertising cookies, tracking
                pixels, or third-party analytics that follow you across the web.
              </p>
            </Section>

            <Section title="Third-Party Services">
              <ul>
                <li>
                  <strong>Supabase:</strong> Database hosting and
                  authentication.
                </li>
                <li>
                  <strong>Vercel:</strong> Application hosting.
                </li>
                <li>
                  <strong>Resend:</strong> Transactional email delivery (only if
                  you provide your email).
                </li>
              </ul>
              <p>
                We do not sell, rent, or share your data with any other third
                parties.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>
                Because submissions are anonymous and not linked to any
                identifying information, we cannot retrieve, modify, or delete a
                specific individual&apos;s submission after it has been submitted.
                This is by design — it&apos;s part of how we protect your privacy.
              </p>
              <p>
                If you have created an account (email login), you can request
                deletion of your account and associated email address by
                contacting us.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this privacy policy from time to time. Material
                changes will be noted by updating the &ldquo;last updated&rdquo;
                date at the top of this page.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions about this privacy policy or how we handle your data?
                Reach out at{' '}
                <a
                  href="mailto:info@healthcomp.org"
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  info@healthcomp.org
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl font-bold text-white mb-4">{title}</h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white/80 [&_a]:text-gold-500 [&_a:hover]:text-gold-400">
        {children}
      </div>
    </section>
  );
}
