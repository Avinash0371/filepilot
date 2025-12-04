// Helper function to extract filename from Content-Disposition header
export function getFilenameFromResponse(response: Response, fallbackFilename: string): string {
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
            return filenameMatch[1].replace(/['"]/g, '');
        }
    }
    return fallbackFilename;
}
