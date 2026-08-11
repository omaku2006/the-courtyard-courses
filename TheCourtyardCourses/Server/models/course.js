import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
    },
    thumbnail: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    coverImage: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'English',
    },
    chapters: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        duration: String,
        typeOfChapter: {
          type: String,
          enum: ['video', 'resource'],
          default: 'video',
        },
        videoUrl: {
          type: String,
          required: function () {
            return this.typeOfChapter === 'video';
          },
        },
        videoId: {
          type: String,
          default: '',
        },
        resources: [
          {
            url: {
              type: String,
              default: '',
            },
            publicId: {
              type: String,
              default: '',
            },
          },
        ],
        order: {
          type: Number,
          default: 0,
        },
        demo: {
          type: Boolean,
          default: false,
        },
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    studentCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
    },
    badges: {
      type: [String],
      default: [],
    },
    certificate: {
      enabled: {
        type: Boolean,
        default: false,
      },
      template: {
        type: String,
        default: null,
      },
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        stars: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ publishedAt: -1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
