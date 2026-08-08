import { uploadToCloudinary } from '../utils/uploadToCloudinary';

export const uploadImage = async (req, res, next) => {
  try {
    let avatar = null;
    let header = null;

    if (req.files?.avatarImage?.[0]) {
      avatar = await uploadToCloudinary(req.files.avatarImage[0].path);
    }

    if (req.files?.headerImage?.[0]) {
      header = await uploadToCloudinary(req.files.headerImage[0].path);
    }

    req.cloudinaryImages = {
      avatarImage: avatar,
      headerImage: header,
    };

    next();
  } catch (e) {
    next(e);
  }
};
