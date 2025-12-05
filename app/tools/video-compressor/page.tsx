import type { Metadata } from 'next';
import VideoCompressorClient from './client';

export const metadata: Metadata = {
  title: 'Video Compressor | Reduce MP4 Size Online | FilePilot',
  description: 'Compress video files online without losing quality. Reduce MP4 file size for easy sharing. Adjustable compression levels. Fast and free.',
  alternates: {
    canonical: '/tools/video-compressor',
  },
};

export default function VideoCompressorPage() {
  return <VideoCompressorClient />;
}
