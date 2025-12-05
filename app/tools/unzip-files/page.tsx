import type { Metadata } from 'next';
import UnzipFilesClient from './client';

export const metadata: Metadata = {
  title: 'Unzip Files Online | Extract ZIP Archive | FilePilot',
  description: 'Unzip files online instantly. Extract contents from ZIP archives without installing software. Secure, free, and easy file extraction.',
  alternates: {
    canonical: '/tools/unzip-files',
  },
};

export default function UnzipFilesPage() {
  return <UnzipFilesClient />;
}
