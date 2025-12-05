import type { Metadata } from 'next';
import PngToJpgClient from './client';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter | Convert PNG to JPG Online | FilePilot',
  description: 'Convert PNG images to JPG format instantly. Optimal quality and compression. Support for bulk conversion. Free and secure.',
  alternates: {
    canonical: '/tools/png-to-jpg',
  },
};

export default function PngToJpgPage() {
  return <PngToJpgClient />;
}
