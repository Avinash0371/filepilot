import type { Metadata } from 'next';
import PdfToTextClient from './client';

export const metadata: Metadata = {
  title: 'PDF to Text Converter | Extract Text from PDF | FilePilot',
  description: 'Extract raw text from PDF files instantly. Convert PDF documents to TXT files. Free, secure, and processing happens locally.',
  alternates: {
    canonical: '/tools/pdf-to-text',
  },
};

export default function PdfToTextPage() {
  return <PdfToTextClient />;
}
