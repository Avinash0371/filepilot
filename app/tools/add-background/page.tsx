import type { Metadata } from 'next';
import AddBackgroundClient from './client';

export const metadata: Metadata = {
  title: 'Add Background to Image | Transparent to Solid Color | FilePilot',
  description: 'Add a solid background color to transparent PNG or WebP images. Choose from presets or custom colors. Free online tool.',
  alternates: {
    canonical: '/tools/add-background',
  },
};

export default function AddBackgroundPage() {
  return <AddBackgroundClient />;
}
