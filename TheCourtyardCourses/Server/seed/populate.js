import { connect } from '../config/db.js';
import User from '../models/user.js';
import Course from '../models/course.js';
import Enrollment from '../models/enrollment.js';

const SEED_STUDENTS = [
  'emily_brooks',
  'liam_harper',
  'sophia_nguyen',
  'noah_williams',
  'ava_martinez',
  'oliver_turner',
  'mia_dubois',
  'lucas_fischer',
];

const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const COMMENTS = {
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
  const pool = COMMENTS[stars];
  return pool[Math.floor(rnd() * pool.length)];
};

const main = async () => {
  await connect();

  const rnd = mulberry32(20260816);

  const students = await User.find({ username: { $in: SEED_STUDENTS } });
  const courses = await Course.find({ publishedAt: { $ne: null } });

  if (!students.length || !courses.length) {
    console.log('Nothing to populate — no seed students or published courses found.');
    process.exit(0);
  }

  console.log(`Populating ${students.length} students across ${courses.length} published courses...`);

  let enrolled = 0;
  let rated = 0;
  let existingEnroll = 0;
  let existingRating = 0;

  const existingPairs = new Set(
    (await Enrollment.find({}).select('student course')).map(
      (e) => `${e.student.toString()}:${e.course.toString()}`,
    ),
  );

  for (const student of students) {
    const shuffled = [...courses].sort(() => rnd() - 0.5);
    const maxTake = Math.min(6, shuffled.length);
    const n = 2 + Math.floor(rnd() * (maxTake - 1));
    const targets = shuffled.slice(0, n);

    for (const course of targets) {
      const pairKey = `${student._id.toString()}:${course._id.toString()}`;
      const alreadyEnrolled = existingPairs.has(pairKey);
      if (!alreadyEnrolled) {
        await Enrollment.create({ student: student._id, course: course._id });
        existingPairs.add(pairKey);
        if (!course.students.some((id) => id.equals(student._id))) {
          course.students.push(student._id);
        }
        await User.findByIdAndUpdate(student._id, { $addToSet: { courses: course._id } });
        enrolled++;
      } else {
        existingEnroll++;
      }

      const alreadyRated = course.ratings.some((r) => r.user.equals(student._id));
      if (!alreadyRated) {
        const stars = pickStars(rnd);
        const hasComment = rnd() < 0.8;
        course.ratings.push({
          user: student._id,
          stars,
          description: hasComment ? pickComment(stars, rnd) : '',
          createdAt: new Date(Date.now() - Math.floor(rnd() * 30) * 86400000),
        });
        rated++;
      } else {
        existingRating++;
      }
    }
  }

  for (const course of courses) {
    course.studentCount = course.students.length;
    if (course.ratings.length) {
      const total = course.ratings.reduce((s, r) => s + r.stars, 0);
      course.averageRating = (total / course.ratings.length).toFixed(1);
    }
    await course.save();
  }

  console.log('\n================= POPULATE COMPLETE =================');
  console.log(`New enrollments : ${enrolled}`);
  console.log(`Already enrolled: ${existingEnroll}`);
  console.log(`New ratings     : ${rated}`);
  console.log(`Already rated   : ${existingRating}`);
  console.log('======================================================');
  console.log('\nPer-course state:');
  for (const c of courses) {
    console.log(
      `  "${c.title}" -> students:${c.students.length} ratings:${c.ratings.length} avg:${c.averageRating}`
    );
  }

  process.exit(0);
};

main().catch((e) => {
  console.error('Populate failed:', e);
  process.exit(1);
});
