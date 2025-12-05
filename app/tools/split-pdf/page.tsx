import type { Metadata } from 'next';
import SplitPdfClient from './client';

export const metadata: Metadata = {
  title: 'Split PDF Online | Extract Pages from PDF | FilePilot',
  description: 'Split PDF files and extract specific pages online. Separate PDF documents into multiple files. Free, fast, and easy to use.',
  alternates: {
    canonical: '/tools/split-pdf',
  },
};

export default function SplitPdfPage() {
  return <SplitPdfClient />;
}
