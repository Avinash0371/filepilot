import type { Metadata } from 'next';
import ImageToWebpClient from './client';

export const metadata: Metadata = {
  title: 'Image to WebP Converter | JPG & PNG to WebP | FilePilot',
  description: 'Convert JPG and PNG images to the modern WebP format. Reduce file size while maintaining quality. Fast and free online converter.',
  alternates: {
    canonical: '/tools/image-to-webp',
  },
};

export default function ImageToWebpPage() {
  return <ImageToWebpClient />;
}
