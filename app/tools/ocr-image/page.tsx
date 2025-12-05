import type { Metadata } from 'next';
import OcrImageClient from './client';

export const metadata: Metadata = {
  title: 'OCR Image to Text | Extract Text from Images | FilePilot',
  description: 'Extract text from JPG, PNG, and scanned images using advanced OCR technology. Convert images to editable text files. Free and secure.',
  alternates: {
    canonical: '/tools/ocr-image',
  },
};

export default function OcrImagePage() {
  return <OcrImageClient />;
}
