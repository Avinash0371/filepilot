import type { Metadata } from 'next';
import ImagesToPdfClient from './client';

export const metadata: Metadata = {
  title: 'Images to PDF Converter | JPG & PNG to PDF | FilePilot',
  description: 'Convert JPG, PNG, and other images to a single PDF document. Combine multiple images into one PDF file. Free, fast, and secure.',
  alternates: {
    canonical: '/tools/images-to-pdf',
  },
};

export default function ImagesToPdfPage() {
  return <ImagesToPdfClient />;
}
