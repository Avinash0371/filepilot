import type { Metadata } from 'next';
import PdfToWordClient from './client';

export const metadata: Metadata = {
  title: 'PDF to Word Converter | Editable DOCX | FilePilot',
  description: 'Convert PDF files to editable Word (DOCX) documents online. Preserve formatting, images, and text. Free, secure, and fast conversion.',
  alternates: {
    canonical: '/tools/pdf-to-word',
  },
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
