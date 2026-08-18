import slugify from 'slugify';
import Community from '../models/community.js';

export const checkValidInputForCreateCommunity = (req, res, next) => {
  const { name, description, isPrivate, canEveryOneMessage } = req.body;

  // ✅ 1. Name Validation (Required)
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Community name is required' });
  }
  
  if (name.length < 3) {
    return res.status(400).json({ message: 'Community name must be at least 3 characters' });
  }
  
  if (name.length > 50) {
    return res.status(400).json({ message: 'Community name cannot exceed 50 characters' });
  }

  // ✅ 2. Description Validation (Optional but limit rakho)
  if (description && description.length > 500) {
    return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
  }

  // ✅ 3. Boolean Fields Validation (FormData sends strings, so accept both)
  if (isPrivate !== undefined && typeof isPrivate !== 'boolean' && !['true', 'false'].includes(isPrivate)) {
    return res.status(400).json({ message: 'isPrivate must be a boolean (true or false)' });
  }

  if (canEveryOneMessage !== undefined && typeof canEveryOneMessage !== 'boolean' && !['true', 'false'].includes(canEveryOneMessage)) {
    return res.status(400).json({ message: 'canEveryOneMessage must be a boolean (true or false)' });
  }

  // ✅ Sab kuch sahi chhe, next middleware par jao!
  next();
};

export const generateCommunitySlug = async (req, res, next) => {
  const { name } = req.body;
  const username = req.user.username; // ✅ verifyToken middleware mathi aavse

  try {
    // 1. Base slug banavo
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'en',
    });

    // 2. Username sathe combine karo (Unique banavva mate)
    let finalSlug = `${baseSlug}-by-${username}`;
    let counter = 0;

    // 3. Loop: Jo slug pahle thi exist kare, toh counter add karo
    while (await Community.findOne({ slug: finalSlug })) {
      counter++;
      finalSlug = `${baseSlug}-by-${username}-${counter}`;
    }

    // 4. Final slug ne req.body ma attach karo (Controller ma use karva mate)
    req.body.slug = finalSlug;

    next(); // ✅ Aagal no middleware (createCommunity) call karo
  } catch (e) {
    console.error('Slug Generation Error:', e.message);
    return res.status(500).json({ message: 'Error generating community slug!' });
  }
};
