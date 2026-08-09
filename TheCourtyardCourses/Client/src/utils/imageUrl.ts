type CloudinaryImage = string | { url?: string | null; publicId?: string | null } | null | undefined;

export const imageUrl = (image: CloudinaryImage): string =>
  typeof image === 'string' ? image : (image?.url ?? '') || '';
