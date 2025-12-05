import type { Metadata } from 'next';
import CompressPdfClient from './client';

export const metadata: Metadata = {
  title: 'Compress PDF Online | Reduce PDF File Size | FilePilot',
  description: 'Reduce PDF file size online for free. Compress PDF documents without losing quality. Fast, secure, and private - files are processed locally.',
  alternates: {
    canonical: '/tools/compress-pdf',
  },
};

export default function CompressPdfPage() {
  return <CompressPdfClient />;
}
