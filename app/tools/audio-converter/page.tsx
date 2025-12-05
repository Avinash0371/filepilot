import type { Metadata } from 'next';
import AudioConverterClient from './client';

export const metadata: Metadata = {
  title: 'Audio Converter | MP3 to WAV & WAV to MP3 | FilePilot',
  description: 'Convert audio files online for free. Support for MP3 and WAV formats. Fast conversion with high audio quality. Secure and private.',
  alternates: {
    canonical: '/tools/audio-converter',
  },
};

export default function AudioConverterPage() {
  return <AudioConverterClient />;
}
