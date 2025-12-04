'use client';

import { useState } from 'react';
import { uploadWithProgress, formatBytes, formatTime, UploadProgress } from '@/lib/uploadWithProgress';

interface UseUploadProgressReturn {
    uploadProgress: number;
    uploadSpeed: string;
    timeRemaining: string;
    uploadFile: (url: string, formData: FormData) => Promise<Response>;
    resetProgress: () => void;
}

/**
 * Custom hook for handling file uploads with real-time progress tracking
 * Usage:
 * 
 * const { uploadProgress, uploadSpeed, timeRemaining, uploadFile, resetProgress } = useUploadProgress();
 * 
 * // Reset before upload
 * resetProgress();
 * 
 * // Upload with progress
 * const response = await uploadFile('/api/endpoint', formData);
 * 
 * // Pass to ProgressIndicator
 * <ProgressIndicator progress={uploadProgress} speed={uploadSpeed} timeRemaining={timeRemaining} />
 */
export function useUploadProgress(): UseUploadProgressReturn {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState('');
    const [timeRemaining, setTimeRemaining] = useState('');

    const handleProgress = (progress: UploadProgress) => {
        setUploadProgress(progress.percentage);
        setUploadSpeed(progress.speed ? `${formatBytes(progress.speed)}/s` : '');
        setTimeRemaining(progress.timeRemaining ? formatTime(progress.timeRemaining) : '');
    };

    const uploadFile = async (url: string, formData: FormData): Promise<Response> => {
        return uploadWithProgress(url, formData, handleProgress);
    };

    const resetProgress = () => {
        setUploadProgress(0);
        setUploadSpeed('');
        setTimeRemaining('');
    };

    return {
        uploadProgress,
        uploadSpeed,
        timeRemaining,
        uploadFile,
        resetProgress,
    };
}
