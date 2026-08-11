import slugify from 'slugify';
import Course from '../models/course.js';
import User from '../models/user.js';
import Enrollment from '../models/enrollment.js';

export const createCourse = async (req, res) => {
  const { title, description, category, tags, level, language, chapters, price, badges } = req.body;

  const { thumbnail, coverImage } = req.cloudinaryImages;
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      message: 'Only teachers can create courses!',
    });
  }

  const username = req.user.username;
  const creatorId = req.user.id;

  const parseList = (value) =>
    typeof value === 'string'
      ? value.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(value)
        ? value
        : [];

  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: 'en',
  });

  let counter = 0;
  let finalSlug = `${baseSlug}-by-${username}-${counter}`;

  while (await Course.findOne({ slug: finalSlug })) {
    counter++;
    finalSlug = `${baseSlug}-by-${username}-${counter}`;
  }

  try {
    const course = await Course.create({
      title,
      description,
      slug: finalSlug,
      creator: creatorId,
      thumbnail,
      coverImage,
      category,
      tags: parseList(tags),
      level: level || 'beginner',
      language: language || 'English',
      chapters: (chapters ?? []).map((c) => ({
        title: c.title,
        description: c.description,
        duration: c.duration,
        typeOfChapter: c.typeOfChapter,
        videoUrl: c.videoUrl,
        videoId: c.videoId,
        resources: c.resources ?? [],
        order: Number(c.order ?? 0),
        demo: c.demo === 'true' || c.demo === true,
      })),
      price: Number(price) || 0,
      badges: parseList(badges),
    });

    return res.status(201).json({
      message: 'Course Created Successfully!',
      course: {
        id: course._id,
        slug: course.slug,
        title: course.title,
      },
    });
  } catch (e) {
    console.error('Create Course Error:', e.message);

    if (e.code === 11000) {
      return res.status(400).json({
        message: 'Course with this slug already exists!',
      });
    }

    return res.status(500).json({
      message: 'Error creating course!',
      error: e.message,
    });
  }
};

export const fetchCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const { category, level, search } = req.query;

    const filter = { publishedAt: { $ne: null } };

    if (category) filter.category = category;
    if (level) filter.level = level;

    if (search) {
      filter.$text = { $search: search };
    }

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find(filter)
      .select('title description thumbnail price averageRating creator category level publishedAt')
      .populate('creator', 'name username avatarImage')
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 }); // ✅ Fixed

    return res.status(200).json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1, // ✅ Consistency
        limit,
      },
    });
  } catch (e) {
    console.error('Fetch Courses Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchMyCourses = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const filter = { creator: teacherId };

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.find(filter)
      .select('title description slug thumbnail price averageRating category level publishedAt')
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (e) {
    console.error('Fetch My Courses Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchEnrolledCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).populate({
      path: 'courses',
      select: 'title description thumbnail category level averageRating publishedAt',
      populate: {
        path: 'creator',
        select: 'name username avatarImage',
      },
      options: {
        skip,
        limit,
        sort: { publishedAt: -1 },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const totalCourses = user.courses.length;
    const totalPages = Math.ceil(totalCourses / limit);

    return res.status(200).json({
      courses: user.courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (e) {
    console.error('Fetch Enrolled Courses Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchCourse = async (req, res) => {
  const { slug } = req.params;

  try {
    const courseDetails = await Course.findOne({ slug })
      .populate({
        path: 'creator',
        select: 'name username avatarImage occupation',
      })
      .populate({
        path: 'community',
        select: 'name thumbnail memberCount',
      })
      .lean(); // Plain JavaScript object return kare (faster)

    if (!courseDetails) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    delete courseDetails.__v;

    return res.status(200).json({ courseDetails });
  } catch (e) {
    console.error('Fetch Course Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id;

  const {
    title,
    description,
    thumbnail,
    coverImage,
    category,
    tags,
    level,
    language,
    chapters,
    price,
    community,
    badges,
    certificate,
  } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    if (course.creator.toString() !== teacherId) {
      return res.status(403).json({
        message: "You cannot edit someone else's course!",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (level !== undefined) updateData.level = level;
    if (language !== undefined) updateData.language = language;
    if (chapters !== undefined) updateData.chapters = chapters;
    if (price !== undefined) updateData.price = price;
    if (community !== undefined) updateData.community = community;
    if (badges !== undefined) updateData.badges = badges;
    if (certificate !== undefined) updateData.certificate = certificate;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Course updated successfully!',
      course: updatedCourse,
    });
  } catch (e) {
    console.error('Update Course Error:', e.message);
    return res.status(500).json({
      message: 'Error updating course!',
      error: e.message,
    });
  }
};

export const publishCourse = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id;
  const { publishedAt } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    if (course.creator.toString() !== teacherId) {
      return res.status(403).json({
        message: "You cannot publish someone else's course!",
      });
    }

    // undefined/omit -> publish now | null -> draft | date -> schedule
    let value;
    if (publishedAt === null) value = null;
    else if (publishedAt) value = new Date(publishedAt);
    else value = new Date();

    course.publishedAt = value;
    await course.save();

    return res.status(200).json({
      message: 'Course publish status updated!',
      publishedAt: course.publishedAt,
    });
  } catch (e) {
    console.error('Publish Course Error:', e.message);
    return res.status(500).json({
      message: 'Error updating publish status!',
      error: e.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    if (course.creator.toString() !== teacherId) {
      return res.status(403).json({
        message: "You cannot delete someone else's course!",
      });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      message: 'Course deleted successfully!',
    });
  } catch (e) {
    console.error('Delete Course Error:', e.message);
    return res.status(500).json({
      message: 'Error deleting course!',
      error: e.message,
    });
  }
};

// TODO: Razor pay Implementation

export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  try {
    // 1. Course shodho
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found!' });

    // 2. Check karo ke already enrolled toh nathi
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled!' });
    }

    // 3. Student ne course ma add karo
    course.students.push(studentId);
    course.studentCount += 1;
    await course.save();

    // 4. User na courses ma add karo
    await User.findByIdAndUpdate(studentId, {
      $push: { courses: courseId },
    });

    // 5. Enrollment record banao (progress tracking mate)
    await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    return res.status(200).json({ message: 'Enrolled successfully!' });
  } catch (e) {
    console.error('Enroll Error:', e.message);
    return res.status(500).json({ message: 'Error enrolling!' });
  }
};

export const updateRatingsCourse = async (req, res) => {
  const { stars, description } = req.body;
  const { courseId } = req.params;
  const userId = req.user.id;

  // ✅ Validation: Stars 1-5 ma hovva joie
  if (!stars || stars < 1 || stars > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5 stars!' });
  }

  try {
    // 1. Course shodho
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    // 2. Check karo ke user enrolled chhe ke nahi
    // (Faktu enrolled students j rate kari shake)
    if (!course.students.includes(userId)) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to rate it!',
      });
    }

    // 3. Check karo ke user pahle thi j rate toh nathi karyu
    const existingRatingIndex = course.ratings.findIndex(
      (rating) => rating.user.toString() === userId
    );

    // 4. Rating update/add karo
    if (existingRatingIndex !== -1) {
      // ✅ User ne pahle thi rating apeli chhe → Update karo
      course.ratings[existingRatingIndex].stars = stars;
      course.ratings[existingRatingIndex].description = description || '';
    } else {
      // ✅ New rating add karo
      course.ratings.push({
        user: userId,
        stars,
        description: description || '',
      });
    }

    // 5. Average rating recalculate karo
    const totalStars = course.ratings.reduce((sum, rating) => sum + rating.stars, 0);
    course.averageRating = (totalStars / course.ratings.length).toFixed(1);

    // 6. Course save karo
    await course.save();

    return res.status(200).json({
      message: 'Rating submitted successfully!',
      averageRating: course.averageRating,
      totalRatings: course.ratings.length,
    });
  } catch (e) {
    console.error('Update Rating Error:', e.message);
    return res.status(500).json({
      message: 'Error submitting rating!',
      error: e.message,
    });
  }
};

export const fetchRatingsCourse = async (req, res) => {
  // ✅ async add karyu
  const { courseId } = req.params;

  try {
    // ✅ Sahi syntax + Populate (User ni details lakva mate)
    const course = await Course.findById(courseId).populate({
      path: 'ratings.user',
      select: 'name username avatarImage', // ✅ Faktu aa 3 fields lakho
    });

    // ✅ Null check
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    // ✅ Sahi JSON syntax
    return res.status(200).json({
      ratings: course.ratings,
      averageRating: course.averageRating, // ✅ Bonus: Average rating pan mokli do
      totalRatings: course.ratings.length, // ✅ Bonus: Total reviews count
    });
  } catch (e) {
    console.error('Fetch Course Ratings Error:', e.message); // ✅ Typo fix karyo
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Course shodho (Faktu jaruri fields lakho for speed)
    const course = await Course.findById(courseId).select('title certificate students');

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    // 2. Check karo: Course ma certificate enabled chhe ke nahi?
    if (!course.certificate || !course.certificate.enabled) {
      return res.status(400).json({
        message: 'Certificate is not available for this course.',
      });
    }

    // 3. Check karo: User enrolled chhe ke nahi?
    const isEnrolled = course.students.some((studentId) => studentId.toString() === userId);

    if (!isEnrolled) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to get the certificate!',
      });
    }

    // 4. (Optional) Check karo: User ne course complete karyu chhe?
    // Jo tame Enrollment model banavyu hoy toh:
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (!enrollment || enrollment.progress < 100) {
      return res.status(403).json({
        message: 'Please complete 100% of the course to unlock the certificate!',
      });
    }

    // 5. User ni details lakho (Certificate par naam lakva mate)
    const user = await User.findById(userId).select('name username');

    // 6. Certificate data return karo
    return res.status(200).json({
      message: 'Certificate fetched successfully!',
      certificate: {
        courseTitle: course.title,
        studentName: user.name,
        username: user.username,
        template: course.certificate.template, // PDF/Image URL
        issuedAt: new Date().toISOString().split('T')[0], // Aaj ni date (YYYY-MM-DD)
        courseId: course._id,
      },
    });
  } catch (e) {
    console.error('Fetch Certificate Error:', e.message);
    return res.status(500).json({
      message: 'Internal Server Error!',
      error: e.message,
    });
  }
};
