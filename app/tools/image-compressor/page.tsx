import type { Metadata } from 'next';
import ImageCompressorClient from './client';

export const metadata: Metadata = {
  title: 'Image Compressor - Compress JPG, PNG, WebP | FilePilot',
  description: 'Reduce image file size without losing quality. Support for JPG, PNG, and WebP. Compress multiple images at once securely in your browser.',
  alternates: {
    canonical: '/tools/image-compressor',
  },
};

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}
