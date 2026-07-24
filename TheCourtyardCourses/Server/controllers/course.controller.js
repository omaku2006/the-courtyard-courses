import slugify from 'slugify';
import Course from '../models/course.js';
import User from '../models/user.js';

export const createCourse = async (req, res) => {
  const { title, description, category, tags, level, language, chapters, price } = req.body;

  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      message: 'Only teachers can create courses!',
    });
  }

  const username = req.user.username;
  const creatorId = req.user.id;

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
      category,
      tags: tags || [],
      level: level || 'beginner',
      language: language || 'English',
      chapters: chapters || [],
      price: price || 0,
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
  const userId = req.user.id;
};


