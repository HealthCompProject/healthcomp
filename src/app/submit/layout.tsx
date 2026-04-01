import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Compensation Data',
  description:
    'Contribute your anonymous compensation data. Takes about 3 minutes. No names or emails collected. Data is only shown in aggregate.',
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
