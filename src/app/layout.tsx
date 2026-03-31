import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthcomp.org';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'HealthComp — Healthcare Executive Compensation Benchmarks',
    template: '%s | HealthComp',
  },
  description:
    'The first free compensation benchmark built by and for healthcare executives. Anonymous, aggregated data from real hospital and health system leaders.',
  keywords: [
    'healthcare executive compensation',
    'hospital CEO salary',
    'health system compensation benchmarks',
    'CFO compensation healthcare',
    'COO salary hospital',
    'CNO compensation',
    'CMO salary',
    'healthcare executive salary survey',
    'free compensation benchmark',
    'hospital executive pay',
  ],
  authors: [{ name: 'HealthComp', url: BASE_URL }],
  openGraph: {
    title: 'HealthComp — Healthcare Executive Compensation Benchmarks',
    description:
      'Free, anonymous compensation benchmarking for senior healthcare executives at U.S. hospitals and health systems.',
    url: BASE_URL,
    siteName: 'HealthComp',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthComp',
    description: 'Free healthcare executive compensation benchmarks.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
