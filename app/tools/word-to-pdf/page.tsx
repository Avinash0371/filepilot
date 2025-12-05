import type { Metadata } from 'next';
import WordToPdfClient from './client';

export const metadata: Metadata = {
  title: 'Word to PDF Converter | Free & Secure | FilePilot',
  description: 'Convert Word documents (DOC, DOCX) to PDF format instantly. Free, secure, and no registration required. Processing happens locally for maximum privacy.',
  alternates: {
    canonical: '/tools/word-to-pdf',
  },
};

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
