import UserSchedule from '../models/userSchedule.js';
import DailyActivity from '../models/dailyActivity.js';
import Enrollment from '../models/enrollment.js';
import Course from '../models/course.js';

export const fetchSchedule = async (req, res) => {
  try {
    const schedules = await UserSchedule.find({ user: req.user.id, isActive: true })
      .populate('course', 'title slug thumbnail chapters')
      .sort({ createdAt: -1 });

    const today = new Date().toISOString().split('T')[0];
    const todayDayOfWeek = new Date().getDay();
    const todayActivity = await DailyActivity.findOne({ user: req.user.id, date: today });

    const entries = todayActivity?.entries || [];

    const todayByCourse = {};
    schedules.forEach((s) => {
      const courseId = s.course?._id?.toString();
      if (!courseId) return;
      const isScheduledToday = s.days.includes(todayDayOfWeek);
      const completedCount = entries.filter((e) => e.course?.toString() === courseId).length;
      todayByCourse[courseId] = {
        completed: completedCount,
        target: isScheduledToday ? s.targetChaptersPerDay : 0,
        scheduledToday: isScheduledToday,
      };
    });

    const enrolledCount = await Enrollment.countDocuments({ student: req.user.id });
    const scheduledCount = schedules.length;

    return res.status(200).json({
      schedules,
      todayActivity: todayActivity || { entries: [], totalCompleted: 0 },
      todayByCourse,
      stats: {
        totalEnrolled: enrolledCount,
        scheduled: scheduledCount,
        unscheduled: enrolledCount - scheduledCount,
      },
    });
  } catch (e) {
    console.error('Fetch Schedule Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const createSchedule = async (req, res) => {
  const { courseId, days, targetChaptersPerDay } = req.body;

  if (!courseId || !Array.isArray(days) || days.length === 0) {
    return res.status(400).json({ message: 'Course and at least one day are required!' });
  }

  try {
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course!' });
    }

    const schedule = await UserSchedule.findOneAndUpdate(
      { user: req.user.id, course: courseId },
      {
        user: req.user.id,
        course: courseId,
        days,
        targetChaptersPerDay: targetChaptersPerDay || 1,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    ).populate('course', 'title slug thumbnail chapters');

    return res.status(200).json({ message: 'Schedule updated!', schedule });
  } catch (e) {
    console.error('Create Schedule Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const schedule = await UserSchedule.findOneAndDelete({
      _id: scheduleId,
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found!' });
    }

    return res.status(200).json({ message: 'Schedule removed!' });
  } catch (e) {
    console.error('Delete Schedule Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchDailyActivity = async (req, res) => {
  const { month, year } = req.query;

  try {
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const endMonth = m === 12 ? 1 : m + 1;
    const endYear = m === 12 ? y + 1 : y;
    const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const activities = await DailyActivity.find({
      user: req.user.id,
      date: { $gte: start, $lt: end },
    }).populate('entries.course', 'title slug thumbnail');

    const schedules = await UserSchedule.find({ user: req.user.id, isActive: true })
      .populate('course', 'title slug thumbnail chapters');

    return res.status(200).json({ activities, schedules });
  } catch (e) {
    console.error('Fetch Daily Activity Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};
