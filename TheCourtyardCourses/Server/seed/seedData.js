import { connect } from '../config/db.js';
import User from '../models/user.js';
import Course from '../models/course.js';
import Enrollment from '../models/enrollment.js';
import bcrypt from 'bcrypt';
import slugify from 'slugify';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NATURAL_DIR = '/home/omaku2006/Pictures/Wallpapers/Natural';
const OTHER_DIR = path.join(NATURAL_DIR, 'Other');

const PASSWORD = 'Courtyard123';

const MAX_BYTES = 9 * 1024 * 1024; // Cloudinary free tier caps uploads at 10MB

const collectImages = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => path.join(dir, f))
    .filter((f) => fs.statSync(f).size <= MAX_BYTES);

const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffle = (arr, rnd) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const videoId = (url) => url.match(/[?&]v=([^&]+)/)?.[1] ?? '';

const V = (id) => `https://www.youtube.com/watch?v=${id}`;
const VIDEO_IDS = [
  'jNQXAC9IVRw', // Me at the zoo
  'dQw4w9WgXcQ', // Rick Astley
  '9bZkp7q19f0', // Gangnam Style
  'kJQP7kiw5Fk', // Despacito
  'aqz-KE-bpKQ', // Big Buck Bunny
  'LXb3EKWsInQ', // Costa Rica in 4K
];

const TEACHERS = [
  {
    name: 'Eleanor Whitmore',
    username: 'eleanor_whitmore',
    email: 'eleanor.whitmore@courtyard.dev',
    occupation: 'Master Photographer',
    description:
      'Award-winning landscape photographer who has wandered the world chasing light.',
    subjects: ['Photography', 'Visual Arts'],
    experience: 12,
  },
  {
    name: 'Arthur Blackwood',
    username: 'arthur_blackwood',
    email: 'arthur.blackwood@courtyard.dev',
    occupation: 'Historian & Author',
    description:
      'Historian of the Tudor and Victorian eras, with a passion for dusty archives and grand tales.',
    subjects: ['History', 'Literature'],
    experience: 18,
  },
  {
    name: 'Isabella Fontaine',
    username: 'isabella_fontaine',
    email: 'isabella.fontaine@courtyard.dev',
    occupation: 'Fine Artist',
    description:
      'Painter working in watercolour and oils, inspired by the quiet beauty of the natural world.',
    subjects: ['Painting', 'Drawing'],
    experience: 15,
  },
  {
    name: 'Ravi Chandra',
    username: 'ravi_chandra',
    email: 'ravi.chandra@courtyard.dev',
    occupation: 'Astrophysicist',
    description:
      'Astrophysicist who spends his nights with telescopes and his days making the cosmos simple.',
    subjects: ['Astronomy', 'Physics'],
    experience: 10,
  },
];

const STUDENTS = [
  { name: 'Emily Brooks', username: 'emily_brooks', email: 'emily.brooks@courtyard.dev', occupation: 'Student' },
  { name: 'Liam Harper', username: 'liam_harper', email: 'liam.harper@courtyard.dev', occupation: 'Designer' },
  { name: 'Sophia Nguyen', username: 'sophia_nguyen', email: 'sophia.nguyen@courtyard.dev', occupation: 'Teacher' },
  { name: 'Noah Williams', username: 'noah_williams', email: 'noah.williams@courtyard.dev', occupation: 'Engineer' },
  { name: 'Ava Martinez', username: 'ava_martinez', email: 'ava.martinez@courtyard.dev', occupation: 'Student' },
  { name: 'Oliver Turner', username: 'oliver_turner', email: 'oliver.turner@courtyard.dev', occupation: 'Writer' },
  { name: 'Mia Dubois', username: 'mia_dubois', email: 'mia.dubois@courtyard.dev', occupation: 'Architect' },
  { name: 'Lucas Fischer', username: 'lucas_fischer', email: 'lucas.fischer@courtyard.dev', occupation: 'Student' },
];

const REVIEW_COMMENTS = {
  5: [
    'A masterwork of instruction — every lesson left me longing for the next.',
    'Exquisite teaching. The Courtyard has outdone itself.',
    'I finished it in a single sitting and felt enriched beyond measure.',
    'Glorious detail, generous pacing, and wisdom on every page.',
    'The finest course I have yet taken within these walls.',
    'Truly transformative. I have recommended it to every scholar I know.',
  ],
  4: [
    'Delightful throughout, though I wished for a few more examples.',
    'Rich in charm and insight. A most enjoyable sojourn.',
    'Beautifully presented — a little more depth and it would be perfect.',
    'A lovely course; the early chapters especially were a joy.',
  ],
  3: [
    'Well crafted, though a few chapters felt rather rushed.',
    'Solid foundations, yet I craved greater depth in places.',
    'Pleasant enough, but it did not quite capture my imagination.',
  ],
  2: [
    'A decent effort, but the middle chapters lost my attention.',
    'Promising start that never quite fulfilled its promise.',
  ],
  1: ['Not what I had hoped — the pacing lost me early on.'],
};

const pickStars = (rnd) => {
  const r = rnd();
  if (r < 0.5) return 5;
  if (r < 0.75) return 4;
  if (r < 0.9) return 3;
  if (r < 0.96) return 2;
  return 1;
};

const pickComment = (stars, rnd) => {
  const pool = REVIEW_COMMENTS[stars];
  return pool[Math.floor(rnd() * pool.length)];
};

const COURSE_PLANS = [
  {
    teacher: 'eleanor_whitmore',
    courses: [
      {
        title: 'Landscapes of Light: A Photography Masterclass',
        category: 'Photography',
        tags: 'photography,camera,nature,landscape',
        level: 'beginner',
        language: 'English',
        price: 0,
        description:
          'Learn to capture breathtaking landscapes by mastering golden hour, framing, and exposure.',
      },
      {
        title: 'Composition & Colour: Seeing Like an Artist',
        category: 'Photography',
        tags: 'photography,composition,colour',
        level: 'intermediate',
        language: 'English',
        price: 1499,
        description:
          'Train your eye to build striking compositions and use colour theory to elevate every frame.',
      },
      {
        title: 'Wildlife Through the Lens',
        category: 'Photography',
        tags: 'photography,wildlife,animals',
        level: 'advanced',
        language: 'English',
        price: 2499,
        description:
          'Advanced field techniques for photographing animals in their natural habitats.',
      },
    ],
  },
  {
    teacher: 'arthur_blackwood',
    courses: [
      {
        title: 'The Tudor Courtyard: England’s Golden Age',
        category: 'History',
        tags: 'history,tudor,england',
        level: 'beginner',
        language: 'English',
        price: 0,
        description:
          'From Henry VIII to Elizabeth I — a journey through the court that shaped a nation.',
      },
      {
        title: 'Victorian London: Streets, Steam & Secrets',
        category: 'History',
        tags: 'history,victorian,london',
        level: 'intermediate',
        language: 'English',
        price: 1799,
        description:
          'Gaslit alleyways, roaring railways and the birth of the modern city.',
      },
      {
        title: 'Myths of the British Isles',
        category: 'Literature',
        tags: 'mythology,literature,folklore',
        level: 'intermediate',
        language: 'English',
        price: 1999,
        description:
          'Dragons, faeries and drowned kingdoms — the legends that still haunt these isles.',
      },
    ],
  },
  {
    teacher: 'isabella_fontaine',
    courses: [
      {
        title: 'Watercolour Wisdom: Painting the Natural World',
        category: 'Art',
        tags: 'painting,watercolour,nature',
        level: 'beginner',
        language: 'English',
        price: 0,
        description:
          'Gentle washes and loose brushwork — paint flowers, skies and woodland light in watercolour.',
      },
      {
        title: 'Oil Portraiture: The Masters’ Method',
        category: 'Art',
        tags: 'painting,oil,portrait',
        level: 'advanced',
        language: 'English',
        price: 2499,
        description:
          'Classical underpainting and glazing techniques for lifelike oil portraits.',
      },
      {
        title: 'Sketching Architecture: Lines & Shadows',
        category: 'Art',
        tags: 'drawing,sketching,architecture',
        level: 'beginner',
        language: 'English',
        price: 1299,
        description:
          'Perspective, proportion and dramatic shadow — draw buildings that stand solid on the page.',
      },
    ],
  },
  {
    teacher: 'ravi_chandra',
    courses: [
      {
        title: 'Stargazing 101: The Night Sky Unveiled',
        category: 'Science',
        tags: 'astronomy,stargazing,space',
        level: 'beginner',
        language: 'English',
        price: 0,
        description:
          'Constellations, planets and meteor showers — your guide to reading the night sky.',
      },
      {
        title: 'Cosmology: From Big Bang to Black Holes',
        category: 'Science',
        tags: 'cosmology,space,physics',
        level: 'advanced',
        language: 'English',
        price: 2999,
        description:
          'The origin, structure and ultimate fate of the universe, made graspable.',
      },
      {
        title: 'Planetary Wonders: A Tour of the Solar System',
        category: 'Science',
        tags: 'astronomy,planets,solarsystem',
        level: 'intermediate',
        language: 'English',
        price: 1999,
        description:
          'Hop from Mercury to Neptune and uncover the marvels of our cosmic neighbourhood.',
      },
    ],
  },
];

const makeChapters = (course, coverImage, startIndex) => {
  const base = [
    {
      title: `Welcome to ${course.title}`,
      description: 'An introduction to the course, what you will learn, and how to get the most from it.',
      typeOfChapter: 'video',
      order: 0,
      demo: true,
    },
    {
      title: 'Core Principles Explained',
      description: 'The essential ideas and techniques, broken down step by step.',
      typeOfChapter: 'video',
      order: 1,
      demo: false,
    },
    {
      title: 'Hands-On Guided Practice',
      description: 'Follow along with a full worked example from start to finish.',
      typeOfChapter: 'video',
      order: 2,
      demo: false,
    },
    {
      title: 'Reading List & Further Study',
      description: 'Supplementary resources to deepen your understanding.',
      typeOfChapter: 'resource',
      order: 3,
      demo: false,
      resources: coverImage ? [{ url: coverImage.url, publicId: coverImage.publicId }] : [],
    },
  ];
  return base.map((ch, i) => {
    if (ch.typeOfChapter === 'video') {
      const id = VIDEO_IDS[(startIndex + i) % VIDEO_IDS.length];
      const duration = `${14 + i}:${10 + (i * 7) % 50}`;
      return { ...ch, videoUrl: V(id), videoId: id, duration };
    }
    return ch;
  });
};

const takeImage = (queue, uploaded) => {
  const file = queue.shift() ?? [...uploaded.keys()][0];
  return file;
};

const main = async () => {
  await connect();

  const rnd = mulberry32(20260814);
  const seedUsernames = [
    ...TEACHERS.map((t) => t.username),
    ...STUDENTS.map((s) => s.username),
  ];

  // Clean previous seed data so re-runs are idempotent
  const existingUsers = await User.find({ username: { $in: seedUsernames } });
  const existingIds = existingUsers.map((u) => u._id);
  if (existingIds.length) {
    await Enrollment.deleteMany({ student: { $in: existingIds } });
    await Course.deleteMany({ creator: { $in: existingIds } });
    await User.deleteMany({ _id: { $in: existingIds } });
    console.log(`Cleaned ${existingIds.length} existing seed users + their data`);
  }

  const imgQueue = shuffle(
    [...collectImages(NATURAL_DIR), ...collectImages(OTHER_DIR)],
    rnd
  );
  const uploaded = new Map();
  console.log(`Image queue ready: ${imgQueue.length} wallpapers`);

  const upload = async (file) => {
    if (uploaded.has(file)) return uploaded.get(file);
    console.log(`  upload: ${path.basename(file)}`);
    const res = await uploadToCloudinary(file);
    uploaded.set(file, res);
    return res;
  };

  const hashedPassword = await bcrypt.hash(PASSWORD, 11);

  // ---- Teachers ----
  const teachers = [];
  for (const t of TEACHERS) {
    const avatar = await upload(takeImage(imgQueue, uploaded));
    const header = await upload(takeImage(imgQueue, uploaded));
    const user = await User.create({
      name: t.name,
      email: t.email,
      username: t.username,
      password: hashedPassword,
      role: 'teacher',
      occupation: t.occupation,
      description: t.description,
      subjects: t.subjects,
      experience: t.experience,
      avatarImage: avatar,
      headerImage: header,
    });
    teachers.push(user);
    console.log(`Teacher created: ${t.username} (${t.name})`);
  }

  // ---- Students ----
  const students = [];
  for (const s of STUDENTS) {
    const avatar = await upload(takeImage(imgQueue, uploaded));
    const header = await upload(takeImage(imgQueue, uploaded));
    const user = await User.create({
      name: s.name,
      email: s.email,
      username: s.username,
      password: hashedPassword,
      role: 'student',
      occupation: s.occupation,
      description: `An eager scholar of the Courtyard.`,
      avatarImage: avatar,
      headerImage: header,
    });
    students.push(user);
    console.log(`Student created: ${s.username} (${s.name})`);
  }

  // ---- Courses ----
  let courseCount = 0;
  let publishedCount = 0;
  const allCourses = [];
  for (const plan of COURSE_PLANS) {
    const teacher = teachers.find((t) => t.username === plan.teacher);

    for (let ci = 0; ci < plan.courses.length; ci++) {
      const courseDef = plan.courses[ci];
      const thumbnail = await upload(takeImage(imgQueue, uploaded));
      const coverImage = await upload(takeImage(imgQueue, uploaded));

      const baseSlug = slugify(courseDef.title, { lower: true, strict: true, locale: 'en' });
      let counter = 0;
      let slug = `${baseSlug}-by-${teacher.username}-${counter}`;
      while (await Course.findOne({ slug })) {
        counter++;
        slug = `${baseSlug}-by-${teacher.username}-${counter}`;
      }

      const isDraft = courseCount % 6 === 5; // publish ~5 of 6, keep 1 draft per 6
      const publishedAt = isDraft ? null : new Date(Date.now() - (courseCount + 2) * 86400000);

      const course = await Course.create({
        title: courseDef.title,
        description: courseDef.description,
        slug,
        creator: teacher._id,
        thumbnail,
        coverImage,
        category: courseDef.category,
        tags: courseDef.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        level: courseDef.level,
        language: courseDef.language,
        price: courseDef.price,
        chapters: makeChapters(courseDef, coverImage, courseCount),
        badges: isDraft ? [] : ['Featured'],
        publishedAt,
      });

      allCourses.push(course);
      courseCount++;
      if (!isDraft) publishedCount++;
      console.log(
        `Course created: "${courseDef.title}" [${courseDef.price === 0 ? 'FREE' : `₹${courseDef.price}`}] by ${teacher.username}`
      );
    }
  }

  // ---- Enrollments (round-robin, mix paid + free) ----
  let enrollmentCount = 0;
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const targets = allCourses.filter((_, ci) => (ci + i) % 3 === 0 && allCourses[ci].publishedAt);
    for (const course of targets) {
      await Enrollment.create({ student: student._id, course: course._id });
      await User.findByIdAndUpdate(student._id, { $addToSet: { courses: course._id } });
      if (!course.students.some((id) => id.equals(student._id))) {
        course.students.push(student._id);
      }
      enrollmentCount++;
    }
  }

  // ---- Ratings & Comments (enrolled students par random) ----
  let ratingCount = 0;
  for (const student of students) {
    const enrollments = await Enrollment.find({ student: student._id }).select('course');
    for (const enr of enrollments) {
      const course = allCourses.find((c) => c._id.equals(enr.course));
      if (!course || !course.publishedAt) continue;
      const stars = pickStars(rnd);
      const hasComment = rnd() < 0.8;
      course.ratings.push({
        user: student._id,
        stars,
        description: hasComment ? pickComment(stars, rnd) : '',
      });
      ratingCount++;
    }
  }
  for (const course of allCourses) {
    course.studentCount = course.students.length;
    if (course.ratings.length) {
      const total = course.ratings.reduce((sum, r) => sum + r.stars, 0);
      course.averageRating = (total / course.ratings.length).toFixed(1);
    }
    await course.save();
  }

  console.log('\n================= SEED COMPLETE =================');
  console.log(`Teachers : ${teachers.length}`);
  console.log(`Students : ${students.length}`);
  console.log(`Courses  : ${courseCount} (${publishedCount} published)`);
  console.log(`Enrollments: ${enrollmentCount}`);
  console.log(`Ratings  : ${ratingCount}`);
  console.log(`Password for all seed users: ${PASSWORD}`);
  console.log('=================================================');

  process.exit(0);
};

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
