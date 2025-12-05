import { NextRequest } from 'next/server';
import {
  saveUploadedFiles,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileSize,
  execAsync,
  generateTmpPath,
} from '@/lib/fileUtils';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import * as path from 'path';
import * as fs from 'fs/promises';

async function zipfilesHandler(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  const inputPaths: string[] = [];
  let outputPath = '';
  let tempDir = '';

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return errorResponse('No files provided');
    }

    // Validate all files
    for (const file of files) {
      if (!validateFileSize(file.size)) {
        return errorResponse(`File "${file.name}" exceeds 50MB limit`);
      }
    }

    // Create a temporary directory for the files
    tempDir = generateTmpPath('_zipdir');
    await fs.mkdir(tempDir, { recursive: true });

    // Save files with their original names in the temp directory
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(tempDir, file.name);
      await fs.writeFile(filePath, buffer);
      inputPaths.push(filePath);
    }

    outputPath = generateTmpPath('.zip');
    registerForCleanup(outputPath);

    // Create ZIP using zip command
    const fileNames = files.map(f => `"${f.name}"`).join(' ');
    await execAsync(`cd "${tempDir}" && zip -j "${outputPath}" ${fileNames}`);

    // Verify the zip file was created and has content
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error('ZIP file is empty');
    }

    const buffer = await readFileAsBuffer(outputPath);

    const response = fileResponse(buffer, 'archive.zip', 'application/zip');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('ZIP error:', error);
    return errorResponse('ZIP creation failed. Please try again.', 500);
  } finally {
    unregisterFromCleanup(outputPath);
    await cleanupFiles(...inputPaths, outputPath);
    // Clean up temp directory
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// Export with production features
export const POST = withProductionFeatures(zipfilesHandler, {
  toolName: 'zip-files',
  category: 'archive',
});
