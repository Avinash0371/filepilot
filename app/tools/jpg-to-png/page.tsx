import type { Metadata } from 'next';
import JpgToPngClient from './client';

export const metadata: Metadata = {
  title: 'JPG to PNG Converter | Convert JPG to Transparent PNG | FilePilot',
  description: 'Convert JPG images to high-quality PNG format online. Supports batch processing. Free, clear, and easy to use.',
  alternates: {
    canonical: '/tools/jpg-to-png',
  },
};

export default function JpgToPngPage() {
  return <JpgToPngClient />;
}
