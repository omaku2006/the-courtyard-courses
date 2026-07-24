import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    avatarImage: {
      type: String,
      default: null,
    },
    headerImage: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },

    occupation: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    subjects: {
      type: [String],
      default: [],
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    learningHours: [
      {
        date: String,
        hours: Number,
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    badges: [
      {
        type: String,
      },
    ],

    certificates: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        certificateUrl: String,
        issuedAt: Date,
      },
    ],

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
