import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (
  filePath,
  { resourceType = 'image', filename } = {}
) => {
  const { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret } =
    cloudinary.config();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured correctly');
  }

  const params = {
    timestamp: Math.floor(Date.now() / 1000).toString(),
    folder: 'TheCourtyardCourses',
  };

  const signature = cloudinary.utils.api_sign_request(params, apiSecret);

  const form = new FormData();
  form.append('file', Bun.file(filePath), filename || filePath.split('/').pop());
  form.append('api_key', apiKey);
  form.append('timestamp', params.timestamp);
  form.append('folder', params.folder);
  form.append('resource_type', resourceType);
  form.append('signature', signature);

  const endpoint =
    resourceType === 'video' ? '/video/upload' : resourceType === 'raw' ? '/raw/upload' : '/image/upload';

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}${endpoint}`,
    { method: 'POST', body: form }
  );
  const data = await res.json();

  if (!res.ok || data.error) {
    const err = new Error(
      data.error?.message || `Cloudinary upload failed (${res.status})`
    );
    err.http_code = res.status;
    throw err;
  }

  return { url: data.secure_url, publicId: data.public_id };
};

export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
