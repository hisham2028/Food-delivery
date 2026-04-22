export const resolveFoodImageUrl = (image, apiBaseUrl) => {
  if (!image) return '';

  // Keep already absolute URLs unchanged (e.g., Cloudinary).
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const baseUrl = (apiBaseUrl || '').replace(/\/$/, '');
  const normalizedImage = String(image).replace(/^\//, '');

  // Backward compatible with old records that stored only a filename.
  return `${baseUrl}/images/${normalizedImage}`;
};
