import mongoose from 'mongoose';

const userScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    days: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => v.every((d) => d >= 0 && d <= 6),
        message: 'Days must be 0-6 (Sun-Sat)',
      },
    },
    targetChaptersPerDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userScheduleSchema.index({ user: 1, course: 1 }, { unique: true });

const UserSchedule = mongoose.model('UserSchedule', userScheduleSchema);
export default UserSchedule;
