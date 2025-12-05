import type { Metadata } from 'next';
import BackgroundRemoverClient from './client';

export const metadata: Metadata = {
  title: 'Background Remover | Remove Image Background Online | FilePilot',
  description: 'Remove backgrounds from images instantly for free. AI-powered background removal for JPG, PNG, and WebP files.',
  alternates: {
    canonical: '/tools/background-remover',
  },
};

export default function BackgroundRemoverPage() {
  return <BackgroundRemoverClient />;
}
