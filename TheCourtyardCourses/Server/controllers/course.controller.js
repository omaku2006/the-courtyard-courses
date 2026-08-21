import slugify from 'slugify';
import Course from '../models/course.js';
import User from '../models/user.js';
import Enrollment from '../models/enrollment.js';
import Community from '../models/community.js';
import DailyActivity from '../models/dailyActivity.js';
import { extractYouTubeId, youtubeDuration } from '../utils/youtubeDuration.js';
import razorpay from '../config/razorpay';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import Payment from '../models/payment.js';

const withYoutubeDuration = async (c) => {
  if (c.duration || c.typeOfChapter !== 'video') return c;
  const id = extractYouTubeId(c.videoUrl);
  if (!id) return c;
  const duration = await youtubeDuration(id);
  return duration ? { ...c, duration } : c;
};

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
      ? value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
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
      chapters: await Promise.all(
        (chapters ?? []).map(async (c) => {
          const enriched = await withYoutubeDuration(c);
          return {
            title: enriched.title,
            description: enriched.description,
            duration: enriched.duration,
            typeOfChapter: enriched.typeOfChapter,
            videoUrl: enriched.videoUrl,
            videoId: enriched.videoId,
            resources: enriched.resources ?? [],
            order: Number(enriched.order ?? 0),
            demo: enriched.demo === 'true' || enriched.demo === true,
          };
        })
      ),
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

    const { category, level, search, sortBy, status } = req.query;

    const filter = {};

    if (status === 'published') {
      filter.publishedAt = { $ne: null, $lte: new Date() };
    } else if (status === 'scheduled') {
      filter.publishedAt = { $gt: new Date() };
    } else {
      // Default: only published courses
      filter.publishedAt = { $ne: null };
    }

    if (category) filter.category = category;
    if (level) filter.level = level;

    if (search) {
      filter.$text = { $search: search };
    }

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    let sort = { publishedAt: -1 };
    if (sortBy === 'popularity') {
      sort = { studentCount: -1, publishedAt: -1 };
    } else if (sortBy === 'oldest') {
      sort = { publishedAt: 1 };
    } else if (sortBy === 'rating') {
      sort = { averageRating: -1, publishedAt: -1 };
    }

    const courses = await Course.find(filter)
      .select(
        'title description slug thumbnail coverImage price averageRating creator category level language tags duration publishedAt students studentCount'
      )
      .populate('creator', 'name username avatarImage')
      .skip(skip)
      .limit(limit)
      .sort(sort);

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

    const total = await User.findById(userId).select('courses');

    if (!total) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const totalCourses = total.courses.length;
    const totalPages = Math.ceil(totalCourses / limit);

    const user = await User.findById(userId).populate({
      path: 'courses',
      select:
        'title description slug coverImage thumbnail category level language duration price averageRating publishedAt',
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
        select: 'name username avatarImage occupation description',
      })
      .populate({
        path: 'community',
        select: 'name slug thumbnail description memberCount isPrivate canEveryOneMessage',
      })
      .lean(); // Plain JavaScript object return kare (faster)

    if (!courseDetails) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    // ✅ Lazy backfill: juna courses ma community reference nathi hoy
    // to community.courses ma thi link shodhi ne set karo (self-healing)
    if (!courseDetails.community) {
      const linkedCommunity = await Community.findOne({
        courses: courseDetails._id,
      }).select(
        'name slug thumbnail description memberCount isPrivate canEveryOneMessage'
      );
      if (linkedCommunity) {
        await Course.updateOne(
          { _id: courseDetails._id },
          { $set: { community: linkedCommunity._id } }
        );
        courseDetails.community = linkedCommunity;
      }
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

  const parseList = (value) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(value)
        ? value
        : [];

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
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = parseList(tags);
    if (level !== undefined) updateData.level = level;
    if (language !== undefined) updateData.language = language;
    if (price !== undefined) updateData.price = Number(price) || 0;
    if (community !== undefined) updateData.community = community;
    if (badges !== undefined) updateData.badges = parseList(badges);
    if (certificate !== undefined) updateData.certificate = certificate;
    if (chapters !== undefined) {
      updateData.chapters = await Promise.all(
        chapters.map(async (c) => {
          let existingResources = [];
          if (c.existingResources) {
            try {
              existingResources = JSON.parse(c.existingResources);
            } catch {
              existingResources = [];
            }
          }
          const enriched = await withYoutubeDuration(c);
          return {
            title: enriched.title,
            description: enriched.description,
            duration: enriched.duration,
            typeOfChapter: enriched.typeOfChapter,
            videoUrl: enriched.videoUrl,
            videoId: enriched.videoId,
            resources: [...existingResources, ...(enriched.resources ?? [])],
            order: Number(enriched.order ?? 0),
            demo: enriched.demo === 'true' || enriched.demo === true,
          };
        })
      );
    }

    if (req.cloudinaryImages?.thumbnail) {
      updateData.thumbnail = req.cloudinaryImages.thumbnail;
    }
    if (req.cloudinaryImages?.coverImage) {
      updateData.coverImage = req.cloudinaryImages.coverImage;
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
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

const completeEnrollment = async (course, studentId) => {
  if (course.students.includes(studentId)) return { alreadyEnrolled: true };

  course.students.push(studentId);
  course.studentCount += 1;
  await course.save();

  await User.findByIdAndUpdate(studentId, { $addToSet: { courses: course._id } });

  // ✅ Idempotent upsert — double-fire/race par E11000 na faake
  await Enrollment.findOneAndUpdate(
    { student: studentId, course: course._id },
    { $setOnInsert: { student: studentId, course: course._id } },
    { upsert: true, returnDocument: 'after' }
  );

  return { alreadyEnrolled: false };
};

export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found!' });

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled!' });
    }

    // Free course -> turant enroll
    if (!course.price || course.price <= 0) {
      await completeEnrollment(course, studentId);

      await Payment.create({
        user: studentId,
        course: courseId,
        amount: 0,
        paymentMethod: 'free',
        orderId: null,
        transactionId: `FREE-${Date.now()}-${studentId}`,
        status: 'completed',
      });

      return res.status(200).json({ enrolled: true, message: 'Enrolled successfully!' });
    }

    // Paid course -> Razorpay order banao (amount paise ma, INR 100x)
    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: 'INR',
      receipt: `course_${course._id}_${Date.now()}`,
      notes: { courseId: course._id.toString(), studentId: studentId.toString() },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error('Enroll Error:', e.message);
    return res.status(500).json({ message: 'Error initiating enrollment!' });
  }
};

export const verifyPayment = async (req, res) => {
  const { courseId, orderId, paymentId, signature } = req.body;
  const studentId = req.user.id;

  if (!courseId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ message: 'Missing payment details!' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found!' });

    // 1. Signature verify karo (tampering/forgery rokava mate)
    const valid = validatePaymentVerification(
      { order_id: orderId, payment_id: paymentId },
      signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!valid) {
      return res.status(400).json({ message: 'Payment verification failed!' });
    }

    // 2. Order ne Razorpay pase thi fetch kari amount/status confirm karo
    const order = await razorpay.orders.fetch(orderId);
    if (order.status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed!' });
    }
    if (order.amount !== course.price * 100) {
      return res.status(400).json({ message: 'Payment amount mismatch!' });
    }

    // 3. Payment pehle thi processed? (handler double-fire / retry guard)
    const existingPayment = await Payment.findOne({ transactionId: paymentId });
    if (existingPayment) {
      return res.status(200).json({
        enrolled: true,
        alreadyEnrolled: true,
        message: 'Already enrolled!',
      });
    }

    // 4. Enrollment complete karo (idempotent)
    const { alreadyEnrolled } = await completeEnrollment(course, studentId);

    // 5. Payment record: { amount, orderId, transactionId }
    try {
      await Payment.create({
        user: studentId,
        course: courseId,
        amount: course.price,
        paymentMethod: 'razorpay',
        orderId,
        transactionId: paymentId,
        status: 'completed',
      });
    } catch (err) {
      // Race condition: be call saath maa aa record banavva koshish kare
      // to duplicate (E11000) na faake — payment pehle thi record thay chhe to success game
      if (err?.code !== 11000) throw err;
    }

    return res.status(200).json({
      enrolled: true,
      alreadyEnrolled,
      message: alreadyEnrolled ? 'Already enrolled!' : 'Enrolled successfully!',
    });
  } catch (e) {
    console.error('Verify Payment Error:', e.message);
    return res.status(500).json({ message: 'Error completing enrollment!' });
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

export const fetchWishlistCourses = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isWishlisted = user.wishlist.some((id) => id.toString() === courseId);

    return res.status(200).json({ isWishlisted });
  } catch (e) {
    console.error('Fetch Wishlist Status Error:', e.message);
    return res.status(500).json({
      message: 'Internal Server Error!',
      error: e.message,
    });
  }
};

export const updateWishlistCourses = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const already = user.wishlist.some((id) => id.toString() === courseId);

    if (already) {
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: courseId } });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: courseId } });
    }

    return res.status(200).json({
      message: already ? 'Removed from wishlist.' : 'Added to wishlist.',
      isWishlisted: !already,
    });
  } catch (e) {
    console.error('Update Wishlist Error:', e.message);
    return res.status(500).json({
      message: 'Internal Server Error!',
      error: e.message,
    });
  }
};

const parseDurationToMinutes = (duration) => {
  if (!duration) return 0;
  const s = String(duration).trim().toLowerCase();
  if (!s) return 0;

  // "14:10" (mm:ss) or "1:30:00" (hh:mm:ss)
  if (s.includes(':')) {
    const parts = s.split(':').map((p) => parseFloat(p) || 0);
    let totalSeconds = 0;
    for (const part of parts) totalSeconds = totalSeconds * 60 + part;
    return totalSeconds / 60;
  }

  // "1hr", "1h 30m", "45min", "2h"
  let minutes = 0;
  const h = s.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = s.match(/(\d+(?:\.\d+)?)\s*m/);
  if (h) minutes += parseFloat(h[1]) * 60;
  if (m) minutes += parseFloat(m[1]);
  return minutes;
};

const computeCourseProgress = (course, completedChapters) => {
  const completedSet = new Set((completedChapters ?? []).map(Number));
  let totalMinutes = 0;
  let completedMinutes = 0;
  course.chapters.forEach((chapter, index) => {
    const minutes = parseDurationToMinutes(chapter.duration);
    totalMinutes += minutes;
    if (completedSet.has(index)) completedMinutes += minutes;
  });

  let progress;
  if (totalMinutes > 0) {
    progress = Math.round((completedMinutes / totalMinutes) * 100);
  } else if (course.chapters.length > 0) {
    progress = Math.round((completedSet.size / course.chapters.length) * 100);
  } else {
    progress = 0;
  }

  return { progress, totalMinutes, completedMinutes };
};

export const fetchCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const [course, enrollment] = await Promise.all([
      Course.findById(courseId),
      Enrollment.findOne({ student: userId, course: courseId }),
    ]);

    if (!course) return res.status(404).json({ message: 'Course not found!' });

    const completedChapters = enrollment ? enrollment.completedChapters : [];
    const { progress, totalMinutes, completedMinutes } = computeCourseProgress(
      course,
      completedChapters
    );

    return res.status(200).json({
      progress,
      completedChapters,
      totalChapters: course.chapters.length,
      totalDurationMinutes: Math.round(totalMinutes),
      completedDurationMinutes: Math.round(completedMinutes),
      completed: enrollment?.completed ?? false,
    });
  } catch (e) {
    console.error('Fetch Course Progress Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!', error: e.message });
  }
};

export const updateChapterCompletion = async (req, res) => {
  const { courseId } = req.params;
  const { chapterIndex } = req.body;
  const userId = req.user.id;

  if (chapterIndex === undefined || !Number.isInteger(Number(chapterIndex))) {
    return res.status(400).json({ message: 'A valid chapter index is required!' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found!' });

    const index = Number(chapterIndex);
    if (index < 0 || index >= course.chapters.length) {
      return res.status(400).json({ message: 'Chapter index out of range!' });
    }

    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to track progress!',
      });
    }

    let completedChapters = enrollment.completedChapters ?? [];
    const wasCompleted = completedChapters.includes(index);

    if (wasCompleted) {
      completedChapters = completedChapters.filter((c) => c !== index);

      const today = new Date().toISOString().split('T')[0];
      await DailyActivity.findOneAndUpdate(
        { user: userId, date: today },
        {
          $pull: {
            entries: { course: courseId, chapterIndex: index },
          },
          $inc: { totalCompleted: -1 },
        }
      );
    } else {
      completedChapters = [...completedChapters, index];

      const today = new Date().toISOString().split('T')[0];
      await DailyActivity.findOneAndUpdate(
        { user: userId, date: today },
        {
          $push: {
            entries: {
              course: courseId,
              chapterIndex: index,
              completedAt: new Date(),
            },
          },
          $inc: { totalCompleted: 1 },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    completedChapters.sort((a, b) => a - b);

    const { progress, totalMinutes, completedMinutes } = computeCourseProgress(
      course,
      completedChapters
    );

    const allDone = progress >= 100;

    enrollment.completedChapters = completedChapters;
    enrollment.progress = progress;
    enrollment.completed = allDone;
    enrollment.completedAt = allDone ? enrollment.completedAt ?? new Date() : null;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    return res.status(200).json({
      message: 'Chapter progress updated!',
      progress,
      completedChapters,
      totalChapters: course.chapters.length,
      totalDurationMinutes: Math.round(totalMinutes),
      completedDurationMinutes: Math.round(completedMinutes),
      completed: allDone,
    });
  } catch (e) {
    console.error('Update Chapter Progress Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!', error: e.message });
  }
};
