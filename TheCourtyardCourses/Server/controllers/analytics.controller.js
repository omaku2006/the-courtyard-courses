import Enrollment from '../models/enrollment.js';
import Course from '../models/course.js';
import User from '../models/user.js';
import Payment from '../models/payment.js';
import DailyActivity from '../models/dailyActivity.js';

export const fetchStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ student: userId })
      .populate('course', 'title slug thumbnail chapters averageRating studentCount');

    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter((e) => e.completed).length;
    const inProgress = totalEnrolled - completed;
    const overallProgress = totalEnrolled
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalEnrolled)
      : 0;

    const totalChaptersCompleted = enrollments.reduce(
      (sum, e) => sum + (e.completedChapters?.length || 0),
      0
    );

    const courseProgress = enrollments.map((e) => {
      const course = e.course;
      const totalChapters = course?.chapters?.length || 0;
      return {
        courseId: course?._id,
        title: course?.title,
        slug: course?.slug,
        thumbnail: course?.thumbnail,
        progress: e.progress || 0,
        completedChapters: e.completedChapters?.length || 0,
        totalChapters,
        lastAccessedAt: e.lastAccessedAt,
        enrolledAt: e.enrolledAt,
        completed: e.completed,
        completedAt: e.completedAt,
      };
    });

    const user = await User.findById(userId).select('learningHours badges certificates');

    const weeklyActivity = await getWeeklyActivity(userId);
    const streak = await calculateStreak(userId);

    return res.status(200).json({
      stats: {
        totalEnrolled,
        completed,
        inProgress,
        overallProgress,
        totalChaptersCompleted,
      },
      courseProgress,
      learningHours: user.learningHours || [],
      badges: user.badges || [],
      certificates: user.certificates || [],
      weeklyActivity,
      streak,
    });
  } catch (e) {
    console.error('Fetch Student Analytics Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchTeacherAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await Course.find({ creator: userId });
    const courseIds = courses.map((c) => c._id);

    const totalStudents = courses.reduce((sum, c) => sum + (c.studentCount || 0), 0);
    const avgRating = courses.length
      ? (courses.reduce((sum, c) => sum + (c.averageRating || 0), 0) / courses.length).toFixed(1)
      : 0;

    const payments = await Payment.find({
      course: { $in: courseIds },
      status: 'captured',
    });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const courseStats = courses.map((c) => ({
      courseId: c._id,
      title: c.title,
      slug: c.slug,
      thumbnail: c.thumbnail,
      studentCount: c.studentCount || 0,
      averageRating: c.averageRating || 0,
      ratingCount: c.ratings?.length || 0,
      publishedAt: c.publishedAt,
      createdAt: c.createdAt,
    }));

    const publishedCourses = courses.filter((c) => c.publishedAt).length;
    const scheduledCourses = courses.filter(
      (c) => c.publishedAt && new Date(c.publishedAt) > new Date()
    ).length;

    return res.status(200).json({
      stats: {
        totalCourses: courses.length,
        publishedCourses,
        scheduledCourses,
        totalStudents,
        avgRating: Number(avgRating),
        totalRevenue,
      },
      courseStats,
    });
  } catch (e) {
    console.error('Fetch Teacher Analytics Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

async function getWeeklyActivity(userId) {
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const activity = await DailyActivity.findOne({ user: userId, date: dateStr });
    result.push({
      date: dateStr,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      chaptersCompleted: activity?.totalCompleted || 0,
    });
  }

  return result;
}

async function calculateStreak(userId) {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const activity = await DailyActivity.findOne({ user: userId, date: dateStr });
    if (activity && activity.totalCompleted > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}
