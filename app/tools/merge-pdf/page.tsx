import type { Metadata } from 'next';
import MergePdfClient from './client';

export const metadata: Metadata = {
  title: 'Merge PDF - Combine PDF Files Online | FilePilot',
  description: 'Merge multiple PDF files into one document instantly. Drag and drop file reordering. Free, secure, and processing happens locally.',
  alternates: {
    canonical: '/tools/merge-pdf',
  },
};

export default function MergePdfPage() {
  return <MergePdfClient />;
}
