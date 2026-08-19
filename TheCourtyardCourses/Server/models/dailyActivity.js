import mongoose from 'mongoose';

const dailyActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    entries: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        chapterIndex: Number,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

dailyActivitySchema.index({ user: 1, date: 1 }, { unique: true });

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);
export default DailyActivity;
