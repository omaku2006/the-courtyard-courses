import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (file: string) => {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'TheCourtyardCourses',
    resource_type: 'auto',
  });
  return { url: result.secure_url, publicId: result.public_id };
};
