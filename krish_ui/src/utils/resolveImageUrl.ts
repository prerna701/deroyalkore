const getBackendOrigin = (): string => {
    const configuredOrigin = import.meta.env.VITE_BACKEND_DOMAIN?.trim();
    if (configuredOrigin) return configuredOrigin;
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
};

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
    return `${getBackendOrigin()}${image}`;
};
