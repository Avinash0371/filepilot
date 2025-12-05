import type { Metadata } from 'next';
import ZipFilesClient from './client';

export const metadata: Metadata = {
  title: 'ZIP Files Online | Create ZIP Archive | FilePilot',
  description: 'Create ZIP archives online for free. Compress multiple files into a single ZIP file. Secure file compression tool without installation.',
  alternates: {
    canonical: '/tools/zip-files',
  },
};

export default function ZipFilesPage() {
  return <ZipFilesClient />;
}
