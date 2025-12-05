import { NextRequest } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import {
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
} from '@/lib/fileUtils';
import { withProductionFeatures } from '@/lib/apiWrapper';

async function backgroundremoverHandler(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided');
    }

    // Validate file size (limit to 10MB for this specific AI tool as it's memory intensive)
    if (!validateFileSize(file.size, 10 * 1024 * 1024)) {
      return errorResponse('File size exceeds 10MB limit for background removal');
    }

    if (!validateFileType(file.name, ['.png', '.jpg', '.jpeg', '.webp'])) {
      return errorResponse('Only image files (PNG, JPG, WEBP) are allowed');
    }

    // Convert File to Blob for the library
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || 'image/png' });

    // Perform background removal
    const outputBlob = await removeBackground(blob);
    const outputBuffer = Buffer.from(await outputBlob.arrayBuffer());

    const outputFilename = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '_nobg.png');

    return fileResponse(outputBuffer, outputFilename, 'image/png');
  } catch (error) {
    console.error('Background removal error:', error);
    return errorResponse('Background removal failed. Please try again.', 500);
  }
}

// Export with production features
export const POST = withProductionFeatures(backgroundremoverHandler, {
  toolName: 'background-remover',
  category: 'image',
});
