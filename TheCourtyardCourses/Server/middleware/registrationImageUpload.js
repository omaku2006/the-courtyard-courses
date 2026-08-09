import { unlink } from 'node:fs/promises';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const cleanup = async (file) => {
  if (!file) return;
  try {
    await unlink(file.path);
  } catch {
    // Ignore cleanup errors; the request itself must not fail.
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    let avatar = null;
    let header = null;

    if (req.files?.avatarImage?.[0]) {
      const file = req.files.avatarImage[0];
      avatar = await uploadToCloudinary(file.path);
      await cleanup(file);
    }

    if (req.files?.headerImage?.[0]) {
      const file = req.files.headerImage[0];
      header = await uploadToCloudinary(file.path);
      await cleanup(file);
    }

    req.cloudinaryImages = {
      avatarImage: avatar,
      headerImage: header,
    };

    next();
  } catch (e) {
    // Make sure temp files never leak even if a single upload fails.
    if (req.files?.avatarImage?.[0]) await cleanup(req.files.avatarImage[0]);
    if (req.files?.headerImage?.[0]) await cleanup(req.files.headerImage[0]);
    next(e);
  }
};
