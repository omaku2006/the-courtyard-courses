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
const CHAPTER_FILE = /^chapters\[(\d+)\]\[(video|resources)\]$/;
const ALLOWED_RESOURCE_MIME =
  /^(image\/|application\/pdf|text\/|application\/msword|application\/vnd\.ms-|application\/vnd\.openxmlformats-officedocument\.)/;

const resourceTypeFor = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';
};

export const uploadCourseAssets = async (req, res, next) => {
  try {
    let thumbnail = null;
    let coverImage = null;

    // busboy/multer `chapters[0][title]` ne pehla thi j nested req.body.chapters maa parse kari chuke chhe.
    const chapters = Array.isArray(req.body.chapters) ? req.body.chapters : [];

    // Khali FILES ne upload karo ane j chapter nu chhe te maa inject karo
    for (const file of req.files ?? []) {
      const m = file.fieldname.match(CHAPTER_FILE);
      if (m) {
        if (m[2] === 'video' && !file.mimetype.startsWith('video/')) {
          const err = new Error(`"${file.originalname}" is not a video file!`);
          err.status = 400;
          throw err;
        }
        if (m[2] === 'resources' && !ALLOWED_RESOURCE_MIME.test(file.mimetype)) {
          const err = new Error(`"${file.originalname}" has an unsupported file type!`);
          err.status = 400;
          throw err;
        }
        const idx = Number(m[1]);
        const chapter = chapters[idx] ?? {};
        const uploaded = await uploadToCloudinary(file.path, {
          resourceType:
            m[2] === 'video' ? 'video' : resourceTypeFor(file.mimetype),
          filename: file.originalname,
        });
        if (m[2] === 'video') {
          chapter.videoUrl = uploaded.url;
          chapter.videoId = uploaded.publicId;
        }
        if (m[2] === 'resources') {
          chapter.resources = [...(chapter.resources ?? []), uploaded];
        }
        chapters[idx] = chapter;
      } else if (file.fieldname === 'thumbnail') {
        thumbnail = await uploadToCloudinary(file.path);
      } else if (file.fieldname === 'coverImage') {
        coverImage = await uploadToCloudinary(file.path);
      }
      await cleanup(file);
    }

    req.body.chapters = chapters.filter(Boolean);
    req.cloudinaryImages = { thumbnail, coverImage };

    next();
  } catch (e) {
    // Make sure temp files never leak even if a single upload fails.
    for (const file of req.files ?? []) await cleanup(file);
    next(e);
  }
};

export const uploadCommunityImages = async (req, res, next) => {
  try {
    let thumbnail = null;
    let headerImage = null;

    if (req.files?.thumbnail?.[0]) {
      const file = req.files.thumbnail[0];
      thumbnail = await uploadToCloudinary(file.path);
      await cleanup(file);
    }

    if (req.files?.headerImage?.[0]) {
      const file = req.files.headerImage[0];
      headerImage = await uploadToCloudinary(file.path);
      await cleanup(file);
    }

    req.cloudinaryImages = { thumbnail, headerImage };
    next();
  } catch (e) {
    if (req.files?.thumbnail?.[0]) await cleanup(req.files.thumbnail[0]);
    if (req.files?.headerImage?.[0]) await cleanup(req.files.headerImage[0]);
    next(e);
  }
};

const ALLOWED_FILE_MIME =
  /^(image\/|application\/pdf|text\/|application\/msword|application\/vnd\.ms-|application\/vnd\.openxmlformats-officedocument\.)/;

const fileTypeFor = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
};

export const uploadPostAssets = async (req, res, next) => {
  try {
    const images = [];
    const files = [];
    const allFiles = Object.values(req.files ?? {}).flat();

    for (const file of allFiles) {
      if (file.fieldname === 'images') {
        const uploaded = await uploadToCloudinary(file.path, {
          resourceType: 'image',
          filename: file.originalname,
        });
        images.push(uploaded);
      } else if (file.fieldname === 'files') {
        if (!ALLOWED_FILE_MIME.test(file.mimetype)) {
          const err = new Error(`"${file.originalname}" has an unsupported file type!`);
          err.status = 400;
          throw err;
        }
        const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
        const uploaded = await uploadToCloudinary(file.path, {
          resourceType,
          filename: file.originalname,
        });
        files.push({
          ...uploaded,
          name: file.originalname,
          type: fileTypeFor(file.mimetype),
        });
      }
      await cleanup(file);
    }

    req.cloudinaryImages = { images, files };
    next();
  } catch (e) {
    const allFiles = Object.values(req.files ?? {}).flat();
    for (const file of allFiles) await cleanup(file);
    next(e);
  }
};
