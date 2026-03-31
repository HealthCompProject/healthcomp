import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Compensation Data',
  description:
    'Contribute your anonymous compensation data to HealthComp. Takes about 3 minutes. Your data is encrypted, never linked to your identity, and only shown in aggregate.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
