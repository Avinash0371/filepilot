import type { Metadata } from 'next';
import VideoConverterClient from './client';

export const metadata: Metadata = {
  title: 'Video Converter | MP4 to WebM & WebM to MP4 | FilePilot',
  description: 'Convert video formats online. Switch between MP4 and WebM sizes compatible with modern browsers. Free, secure, and fast conversion.',
  alternates: {
    canonical: '/tools/video-converter',
  },
};

export default function VideoConverterPage() {
  return <VideoConverterClient />;
}
