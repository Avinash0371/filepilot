import type { Metadata } from 'next';
import PptToPdfClient from './client';

export const metadata: Metadata = {
  title: 'PPT to PDF Converter | PowerPoint to PDF | FilePilot',
  description: 'Convert PowerPoint (PPT, PPTX) files to PDF format online. Keep your slides formatting intact. Free, secure, and fast conversion.',
  alternates: {
    canonical: '/tools/ppt-to-pdf',
  },
};

export default function PptToPdfPage() {
  return <PptToPdfClient />;
}
