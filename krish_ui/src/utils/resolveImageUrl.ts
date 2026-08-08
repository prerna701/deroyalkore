const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN || 'http://localhost:7000';

/**
 * Resolves a treatment image URL.
 * - If the image is a relative path (starts with '/'), prepend the backend domain.
 * - If it's already a full URL (http/https), return as-is.
 * - If empty/null, return empty string.
 */
export const resolveImageUrl = (image: string | undefined | null): string => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // Relative path like /uploads/treatments/filename.jpg
    return `${BACKEND_DOMAIN}${image}`;
};
