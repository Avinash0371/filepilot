import type { Metadata } from 'next';
import PdfToPptClient from './client';

export const metadata: Metadata = {
  title: 'PDF to PPT Converter | Convert PDF to PowerPoint | FilePilot',
  description: 'Convert PDF files to editable PowerPoint (PPTX) presentations online. Preserve slides, layout, and formatting. Free and secure tool.',
  alternates: {
    canonical: '/tools/pdf-to-ppt',
  },
};

export default function PdfToPptPage() {
  return <PdfToPptClient />;
}
