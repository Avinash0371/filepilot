import type { Metadata } from 'next';
import PdfToPngClient from './client';

export const metadata: Metadata = {
  title: 'PDF to PNG Converter | Convert PDF Pages to Images | FilePilot',
  description: 'Convert PDF document pages into high-quality PNG images. Secure, fast, and free online tool. Extract images from PDF files easily.',
  alternates: {
    canonical: '/tools/pdf-to-png',
  },
};

export default function PdfToPngPage() {
  return <PdfToPngClient />;
}
