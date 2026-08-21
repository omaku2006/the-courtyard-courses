import { connect } from '../config/db.js';
import User from '../models/user.js';
import Course from '../models/course.js';
import Enrollment from '../models/enrollment.js';
import Community from '../models/community.js';
import Post from '../models/post.js';
import DailyActivity from '../models/dailyActivity.js';
import UserSchedule from '../models/userSchedule.js';
import slugify from 'slugify';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WALLPAPER_DIR = '/home/omaku2006/Pictures/Wallpapers/Natural';
const OTHER_DIR = path.join(WALLPAPER_DIR, 'Other');
const MAIN_WALLPAPER_DIR = '/home/omaku2006/Pictures/mainWallpaper';

const MAX_BYTES = 9 * 1024 * 1024;

const collectImages = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => path.join(dir, f))
    .filter((f) => fs.statSync(f).size <= MAX_BYTES);
};

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

const V = (id) => `https://www.youtube.com/watch?v=${id}`;

// ─── Course data from user-provided YouTube playlists ────────────────────────

const COURSES = [
  // ── Course 1: Sigma Web Dev Part 1 — HTML & CSS (Tutorials 1-51) ──────────
  {
    title: 'HTML & CSS Fundamentals',
    category: 'Web Development',
    tags: 'html,css,webdev,frontend,responsive',
    level: 'beginner',
    language: 'English',
    price: 0,
    description:
      'HTML aur CSS seekhein scratch se — website banana sikhein with hands-on exercises and real projects. Based on the Sigma Web Development Course.',
    chapters: [
      { title: 'Setting Up & How Websites Work', videoId: 'tVzUXW6siu0', duration: '18:24', demo: true, description: 'VS Code install karna aur samajhna ki websites kaise kaam karti hain.' },
      { title: 'Your First HTML Website', videoId: 'kJEsTjH5mVg', duration: '22:15', description: 'Pehla HTML page banana — structure, tags, aur browser mein dekhna.' },
      { title: 'HTML Structure & Text Elements', videoId: 'BGeDBfCIqas', duration: '25:30', description: 'Headings, paragraphs, links — HTML ka basic structure master karo.' },
      { title: 'Images, Lists & Tables', videoId: '1BsVhumGlNc', duration: '28:45', description: 'Images add karna, ordered/unordered lists, aur tables banana.' },
      { title: 'Forms & Input Tags', videoId: 'tLBlhp0SA_0', duration: '32:10', description: 'Contact forms, input types, aur validation basics.' },
      { title: 'Semantic HTML & SEO', videoId: 'fhoDRB53DwY', duration: '20:55', description: 'Semantic tags use karke SEO-friendly websites banao.' },
      { title: 'CSS Introduction & Selectors', videoId: '1dkfuga2_Ps', duration: '30:20', description: 'CSS kya hai, kaise lagta hai, aur selectors ka complete guide.' },
      { title: 'Box Model, Fonts & Colors', videoId: 'Xrxd6cEajhM', duration: '35:40', description: 'Margin, padding, borders — CSS box model aur styling properties.' },
      { title: 'Specificity, Cascade & Units', videoId: 'uTcpbPMZlFE', duration: '28:15', description: 'CSS specificity, cascade rule, aur sizing units (px, rem, em, vh, vw).' },
      { title: 'Display, Position & Overflow', videoId: 'hRHV5cjEB1w', duration: '26:50', description: 'Display property, positioning techniques, aur overflow handling.' },
      { title: 'Flexbox & Grid MasterClass', videoId: 'DWk2mndNTHY', duration: '45:30', description: 'Flexbox aur CSS Grid dono complete — modern layouts banana seekho.' },
      { title: 'Transforms, Transitions & Animations', videoId: 'GGlzzLTLzxs', duration: '38:20', description: 'CSS transforms, transitions, aur keyframe animations.' },
      { title: 'Media Queries & Responsive Design', videoId: 'eHye3PxH4jU', duration: '24:45', description: 'Mobile-first approach se responsive websites banao.' },
      { title: 'Netflix Clone Project', videoId: 'ovKVqo-L2EM', duration: '55:00', description: 'Pure HTML & CSS se Netflix homepage clone banao — final project.' },
    ],
  },
  // ── Course 2: Sigma Web Dev Part 2 — JavaScript (Tutorials 54-84) ─────────
  {
    title: 'JavaScript Mastery',
    category: 'Web Development',
    tags: 'javascript,js,dom,frontend,async',
    level: 'intermediate',
    language: 'English',
    price: 1499,
    description:
      'JavaScript complete karo — variables se lekar async/await aur OOP tak. Real exercises aur Spotify clone project included.',
    chapters: [
      { title: 'JS Introduction & Setup', videoId: 'NrhP53Divco', duration: '20:10', description: 'JavaScript kya hai, Node.js install karna, aur pehla script likho.' },
      { title: 'Variables, Data Types & Objects', videoId: 'HGCDMJXS1cc', duration: '30:25', description: 'let, const, var — data types, objects, aur type coercion.' },
      { title: 'Conditionals & Loops', videoId: '1R4NGtsj7hw', duration: '28:40', description: 'if/else, switch, for, while — control flow complete.' },
      { title: 'Functions & Scope', videoId: 'Jtc3j4ZNZEQ', duration: '25:55', description: 'Function declarations, expressions, arrow functions, aur scope.' },
      { title: 'Strings & Arrays Deep Dive', videoId: 'uJbYqm7W_mA', duration: '35:30', description: 'String methods, array methods (map, filter, reduce) — complete guide.' },
      { title: 'DOM Selection & Manipulation', videoId: 'oxO1Z5L5S4c', duration: '32:15', description: 'Document Object Model — elements select karna, banana, aur modify karna.' },
      { title: 'DOM Events & Event Bubbling', videoId: 'CO_DAXswOrc', duration: '28:50', description: 'Event listeners, event bubbling, setInterval aur setTimeout.' },
      { title: 'Callbacks, Promises & Async/Await', videoId: '9JaDBYPmiJ0', duration: '40:20', description: 'Asynchronous JavaScript — callbacks se async/await tak ka safar.' },
      { title: 'Error Handling & OOP', videoId: 'aQn7ssqHYp4', duration: '30:45', description: 'try/catch, classes, objects — Object Oriented Programming in JS.' },
      { title: 'Spotify Clone Project', videoId: 'CYwEq1GdU4E', duration: '65:00', description: 'HTML, CSS aur JavaScript se Spotify clone banao — capstone project.' },
    ],
  },
  // ── Course 3: Sigma Web Dev Part 3 — Node.js & Backend (Tutorials 85-100) ─
  {
    title: 'Node.js & Backend Development',
    category: 'Web Development',
    tags: 'nodejs,express,mongodb,backend,api',
    level: 'intermediate',
    language: 'English',
    price: 1999,
    description:
      'Backend development seekho — Node.js, Express, MongoDB, aur CRUD operations. Real projects ke saath.',
    chapters: [
      { title: 'Node.js & npm Introduction', videoId: 'NoWRBo3Uf8E', duration: '22:30', description: 'Backend kya hai, Node.js install karna, aur npm packages use karna.' },
      { title: 'CommonJS vs ES Modules', videoId: 'bU69doALJGU', duration: '18:45', description: 'Module systems — CommonJS aur ECMAScript modules mein kya fark hai.' },
      { title: 'File System & Path Modules', videoId: 'BTcmvrCTyNg', duration: '25:20', description: 'Files read, write, aur manipulate karna Node.js ke fs aur path modules se.' },
      { title: 'Introduction to Express.js', videoId: 'R11tvGM3nDY', duration: '30:15', description: 'Express.js setup, routing, aur basic server banana.' },
      { title: 'Request, Response & Routers', videoId: 'SksvlZM-5Sk', duration: '28:40', description: 'HTTP methods, request/response handling, aur Express routers.' },
      { title: 'Middlewares in Express', videoId: 'VELNPK0dK84', duration: '26:55', description: 'Custom middlewares, built-in middlewares, aur middleware chain.' },
      { title: 'EJS Template Engine', videoId: 'Kah88N8W5rs', duration: '22:30', description: 'Server-side rendering with EJS — templates, variables, aur partials.' },
      { title: 'MongoDB & CRUD Operations', videoId: 'oMrKVEedpHg', duration: '35:40', description: 'MongoDB install, Compass setup, aur CRUD operations with Mongoose.' },
    ],
  },
  // ── Course 4: Flux Academy — Web Design ───────────────────────────────────
  {
    title: 'Web Design Fundamentals',
    category: 'Design',
    tags: 'webdesign,uiux,figma,designtools,responsive',
    level: 'beginner',
    language: 'English',
    price: 999,
    description:
      'Learn web design from scratch — design principles, Figma basics, design systems, and UI/UX fundamentals from Flux Academy.',
    chapters: [
      { title: 'Web Design Full Course', videoId: 'j6Ule7GXaRs', duration: '3:45:00', description: 'Complete web design course — from zero to designing your first website.', demo: true },
      { title: '6 UI Hacks for Beginners', videoId: '88XxC0_zs74', duration: '15:20', description: 'Six powerful UI tricks every beginner designer should know.' },
      { title: 'Your First Design System in Figma', videoId: '_uva2dQPlV8', duration: '25:40', description: 'Figma mein apna pehla design system banana — step by step.' },
      { title: 'Design System 101', videoId: 'shuIfhrLIP0', duration: '22:15', description: 'Design systems kya hain aur kyun zaroori hain — beginner guide.' },
      { title: 'How to Make a Design System in Figma', videoId: 'N1G5KSEXzDM', duration: '20:30', description: 'Practical guide — Figma mein design system create karna.' },
      { title: 'Color Systems in Figma', videoId: 'uSZirUYhtf4', duration: '18:45', description: 'Color palettes, color tokens, aur systematic color management.' },
      { title: 'Design System Fundamentals', videoId: 'G1xmkQeExJo', duration: '24:10', description: 'Design system ke core fundamentals — typography, spacing, components.' },
      { title: 'Tokens, Variables & Styles', videoId: 'JyCmacSyDY4', duration: '16:55', description: 'Design tokens, variables, aur styles — modern design system workflow.' },
    ],
  },
  // ── Course 5: SSC History — Indian History Medieval to Modern ──────────────
  {
    title: 'Indian History: Medieval to Modern',
    category: 'History',
    tags: 'india,history,medieval,mughal,freedom,struggle',
    level: 'intermediate',
    language: 'English',
    price: 1499,
    description:
      'Arab invasion se lekar Independence tak — complete Indian history. Delhi Sultanate, Mughal Empire, Marathas, aur Freedom Movement covered.',
    chapters: [
      { title: 'Arab Invasion & Delhi Sultanate', videoId: 'kQz6vaU-bVY', duration: '1:54:00', description: 'Arab invasion of India aur early Sultanate dynasties.', demo: true },
      { title: 'From Aibak to Iltutmish', videoId: 'Iz1iWX-GTtw', duration: '1:56:00', description: 'Slave Dynasty, Razia Sultan, aur Sultanate ka rise.' },
      { title: 'Khilji Dynasty & Alauddin Khilji', videoId: 'aSqNLEyobEM', duration: '2:00:00', description: 'Khilji dynasty aur Alauddin Khilji ke military reforms.' },
      { title: 'Tughlaq Dynasty', videoId: 'RAr_NKx_73w', duration: '1:36:00', description: 'Tughlaq dynasty — Muhammad bin Tughluq aur FST.' },
      { title: 'Sayyid & Lodi Dynasties', videoId: 'wq0v0QXbJsI', duration: '1:36:00', description: 'Sayyid dynasty, Lodi dynasty, aur Delhi Sultanate ka end.' },
      { title: 'Mughal Empire: Babur to Akbar', videoId: '483IUQpq9pY', duration: '2:00:00', description: 'Mughal Empire ki shuruaat — Babur, Humayun, aur Akbar.' },
      { title: 'Akbar to Aurangzeb', videoId: 'WmT8eCl4lr0', duration: '1:28:00', description: 'Jahangir, Shah Jahan, Aurangzeb — Mughal Empire ka golden age aur decline.' },
      { title: 'Shivaji & Maratha Empire', videoId: 'VmSjxhXjtBQ', duration: '2:04:00', description: 'Chhatrapati Shivaji Maharaj aur Maratha Empire ka rise.' },
      { title: 'European Companies & Battle of Plassey', videoId: 'GYFl31XCpF8', duration: '1:49:00', description: 'European companies ka India mein entrance aur Plassey/Buxar.' },
      { title: 'Freedom Movement: Gandhi to Bose', videoId: '9T6VRzYTe20', duration: '1:16:00', description: 'Gandhi era, Non-Cooperation, Quit India, aur Netaji Subhas Chandra Bose.' },
    ],
  },
  // ── Course 6: History of British India ─────────────────────────────────────
  {
    title: 'History of British India',
    category: 'History',
    tags: 'british,colonial,india,raj,independence',
    level: 'intermediate',
    language: 'English',
    price: 1299,
    description:
      'Comprehensive lectures on the history of British India — from early colonial expansion to the independence movement.',
    chapters: [
      { title: 'Early Colonial Expansion', videoId: 'Y0uh9uUGvlM', duration: '1:18:00', description: 'British East India Company aur India mein pehle kadam.', demo: true },
      { title: 'Growth of British Power', videoId: 'q3eiZjzhRGg', duration: '1:17:00', description: 'Anglo-Mysore wars, Anglo-Maratha wars, aur British dominance.' },
      { title: 'Administrative Control', videoId: '0muHKbPm2Os', duration: '1:17:00', description: 'British administrative systems aur governance in India.' },
      { title: 'Governors & Viceroys', videoId: 'oclCsntdFDo', duration: '1:17:00', description: 'Important governors aur viceroys who shaped colonial India.' },
      { title: 'Social Reform Movements', videoId: 'pQ3ZqRk2BQI', duration: '1:17:00', description: 'Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, aur social reforms.' },
      { title: 'Early Nationalist Movement', videoId: 'WzGmwtwqJbA', duration: '1:17:00', description: 'Indian National Congress, Partition of Bengal, aur Swadeshi Movement.' },
      { title: 'Revolutionary Phase', videoId: 'Ngyjno0Q8NA', duration: '1:11:00', description: 'Bhagat Singh, Jallianwala Bagh, aur revolutionary movements.' },
      { title: 'Gandhi Era & Mass Movements', videoId: 'c3TVKwJszOo', duration: '1:18:00', description: 'Gandhi ke leadership mein Non-Cooperation, Civil Disobedience, aur Quit India.' },
      { title: 'Road to Independence', videoId: 'JVwA8kXVat4', duration: '1:14:00', description: 'Round Table Conferences, Quit India, aur independence ki taiyari.' },
      { title: 'Independence & Legacy', videoId: 'cxnfHzwJTi4', duration: '1:16:00', description: 'Partition, independence, aur British legacy in modern India.' },
    ],
  },
];

// ─── Community configurations ────────────────────────────────────────────────

const COMMUNITIES = [
  {
    courseIndex: 0, // HTML & CSS
    name: 'HTML & CSS Learners Hub',
    description: 'Open community for all HTML & CSS learners. Ask questions, share projects, help each other!',
    isPrivate: false,
    canEveryOneMessage: true,
  },
  {
    courseIndex: 1, // JavaScript
    name: 'JavaScript Study Group',
    description: 'Private community for JavaScript Mastery students. Teacher posts lessons, students can discuss.',
    isPrivate: true,
    canEveryOneMessage: false,
  },
  {
    courseIndex: 2, // Node.js
    name: 'Node.js Backend Builders',
    description: 'Open community for backend developers. Share your projects and learn together.',
    isPrivate: false,
    canEveryOneMessage: true,
  },
  {
    courseIndex: 3, // Web Design
    name: 'Web Design Studio',
    description: 'Private community for Web Design students. Only teacher can post assignments.',
    isPrivate: true,
    canEveryOneMessage: false,
  },
  {
    courseIndex: 4, // Indian History
    name: 'Indian History Discussion',
    description: 'Private community for Indian History students. Teacher shares notes and quiz questions.',
    isPrivate: true,
    canEveryOneMessage: false,
  },
  {
    courseIndex: 5, // British India
    name: 'British India Study Circle',
    description: 'Open community for discussing British colonial history. Everyone can share insights.',
    isPrivate: false,
    canEveryOneMessage: true,
  },
];

// ─── Posts for communities ────────────────────────────────────────────────────

const POSTS = [
  {
    communityIndex: 0,
    authorType: 'teacher',
    content: 'Welcome to the HTML & CSS Learners Hub! 🎉 Feel free to ask any questions about the course. Remember, practice is the key — try to build something every day!',
    comments: [
      { authorType: 'student', content: 'Thank you! Really excited to start this course. The Netflix clone project looks amazing!' },
      { authorType: 'student', content: 'Hello everyone! Can someone explain the difference between inline and block elements? Chapter 8 mentions it but I need more examples.' },
    ],
  },
  {
    communityIndex: 0,
    authorType: 'student',
    content: 'Just finished the Flexbox & Grid chapter and built my first responsive navbar! 🎨 Flexbox is so much easier than float-based layouts.',
    comments: [
      { authorType: 'teacher', content: 'Excellent progress! Flexbox has truly revolutionized CSS layouts. Try combining it with CSS Grid for complex page layouts.' },
    ],
  },
  {
    communityIndex: 1,
    authorType: 'teacher',
    content: '📢 Important: This week we are covering Promises and Async/Await. Make sure you complete chapters 1-7 before moving to Chapter 8. The Spotify clone project will use everything you have learned so far!',
    comments: [
      { authorType: 'student', content: 'Got it! Working through the DOM manipulation exercises right now. The event bubbling concept is fascinating.' },
    ],
  },
  {
    communityIndex: 2,
    authorType: 'teacher',
    content: 'Welcome to Node.js Backend Builders! This week\'s challenge: Build a simple REST API with Express.js and MongoDB. Share your code here for feedback.',
    comments: [
      { authorType: 'student', content: 'Started working on it! Using Mongoose for the first time — the schema definitions are so clean.' },
      { authorType: 'student', content: 'Quick question: What\'s the difference between app.get() and router.get()? Chapter 5 mentions routers but I\'m confused.' },
    ],
  },
  {
    communityIndex: 3,
    authorType: 'teacher',
    content: '🎨 Assignment #1: Create a color palette for a fictional brand using Figma. Use the design tokens approach from Chapter 6. Due next week!',
    comments: [
      { authorType: 'student', content: 'This is going to be fun! I\'ve been practicing with Figma variables since the last chapter.' },
    ],
  },
  {
    communityIndex: 4,
    authorType: 'teacher',
    content: '📝 Quiz coming next week on Delhi Sultanate and Mughal Empire. Focus on: Arab Invasion, Khilji reforms, Akbar\'s Navratnas, and Mughal architecture.',
    comments: [
      { authorType: 'student', content: 'Thank you for the heads up! Will revise the Alauddin Khilji and Akbar chapters thoroughly.' },
      { authorType: 'student', content: 'Can you share some important dates to remember for the Mughal period?' },
    ],
  },
  {
    communityIndex: 5,
    authorType: 'teacher',
    content: 'Welcome to the British India Study Circle! This course covers 20 detailed lectures. I recommend watching 2-3 per week and discussing key themes here.',
    comments: [
      { authorType: 'student', content: 'Looking forward to this! The social reform movements section seems particularly interesting.' },
    ],
  },
  {
    communityIndex: 5,
    authorType: 'student',
    content: 'Just watched Lecture 3 on Administrative Control. The way the British restructured Indian governance is mind-blowing. Anyone else finding the Permanent Settlement topic confusing?',
    comments: [
      { authorType: 'teacher', content: 'Great observation! The Permanent Settlement (1793) by Lord Cornwallis was indeed a turning point. It created the Zamindari system which had lasting effects on Indian agriculture. I\'ll cover it in more detail in the next lecture discussion.' },
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

const main = async () => {
  await connect();

  const rnd = mulberry32(20260820);

  // ── Find existing users ──────────────────────────────────────────────────
  const asha = await User.findOne({ username: 'asha' });
  const omaku = await User.findOne({ username: 'omaku' });

  if (!asha) {
    console.error('❌ User "asha" not found! Create the account first.');
    process.exit(1);
  }
  if (!omaku) {
    console.error('❌ User "omaku" not found! Create the account first.');
    process.exit(1);
  }

  console.log(`✓ Found teacher: ${asha.name} (${asha.username})`);
  console.log(`✓ Found student: ${omaku.name} (${omaku.username})`);

  // ── Clean previous seed data for these users ────────────────────────────
  const oldCourses = await Course.find({ creator: asha._id });
  const oldCourseIds = oldCourses.map((c) => c._id);
  if (oldCourseIds.length) {
    await Enrollment.deleteMany({ course: { $in: oldCourseIds } });
    await Post.deleteMany({ community: { $in: (await Community.find({ creator: asha._id })).map((c) => c._id) } });
    await Community.deleteMany({ creator: asha._id });
    await Course.deleteMany({ creator: asha._id });
    console.log(`Cleaned ${oldCourses.length} old courses and related data for asha`);
  }
  // Clean omaku's enrollments in asha's courses
  await Enrollment.deleteMany({ student: omaku._id, course: { $in: oldCourseIds } });
  await User.findByIdAndUpdate(omaku._id, { $pull: { courses: { $in: oldCourseIds } } });
  // Clean schedules and activity for omaku in old courses
  await UserSchedule.deleteMany({ user: omaku._id, course: { $in: oldCourseIds } });
  await DailyActivity.deleteMany({ user: omaku._id });

  // ── Image queue ─────────────────────────────────────────────────────────
  const imgQueue = shuffle(
    [
      ...collectImages(WALLPAPER_DIR),
      ...collectImages(OTHER_DIR),
      ...collectImages(MAIN_WALLPAPER_DIR),
    ],
    rnd
  );
  console.log(`Image queue ready: ${imgQueue.length} images`);

  const uploaded = new Map();
  const upload = async (file) => {
    if (!file) return { url: '', publicId: '' };
    if (uploaded.has(file)) return uploaded.get(file);
    console.log(`  upload: ${path.basename(file)}`);
    const res = await uploadToCloudinary(file);
    uploaded.set(file, res);
    return res;
  };

  const takeImage = () => {
    const file = imgQueue.shift() ?? imgQueue[0];
    return file;
  };

  // ── Ensure asha has avatar/header ───────────────────────────────────────
  if (!asha.avatarImage?.url) {
    const avatar = await upload(takeImage());
    asha.avatarImage = avatar;
    await asha.save();
    console.log('  Uploaded avatar for asha');
  }
  if (!asha.headerImage?.url) {
    const header = await upload(takeImage());
    asha.headerImage = header;
    await asha.save();
    console.log('  Uploaded header for asha');
  }

  // ── Ensure omaku has avatar/header ──────────────────────────────────────
  if (!omaku.avatarImage?.url) {
    const avatar = await upload(takeImage());
    omaku.avatarImage = avatar;
    await omaku.save();
    console.log('  Uploaded avatar for omaku');
  }
  if (!omaku.headerImage?.url) {
    const header = await upload(takeImage());
    omaku.headerImage = header;
    await omaku.save();
    console.log('  Uploaded header for omaku');
  }

  // ── Create Courses ──────────────────────────────────────────────────────
  const allCourses = [];
  for (const courseDef of COURSES) {
    const thumbnail = await upload(takeImage());
    const coverImage = await upload(takeImage());

    const baseSlug = slugify(courseDef.title, { lower: true, strict: true, locale: 'en' });
    let counter = 0;
    let slug = `${baseSlug}-by-${asha.username}-${counter}`;
    while (await Course.findOne({ slug })) {
      counter++;
      slug = `${baseSlug}-by-${asha.username}-${counter}`;
    }

    const publishedAt = new Date(Date.now() - (allCourses.length + 1) * 86400000);

    const chapters = courseDef.chapters.map((ch, i) => ({
      title: ch.title,
      description: ch.description || '',
      typeOfChapter: 'video',
      videoUrl: V(ch.videoId),
      videoId: ch.videoId,
      duration: ch.duration || `${15 + i * 3}:${10 + (i * 7) % 50}`,
      order: i,
      demo: ch.demo || false,
      resources: [],
    }));

    const course = await Course.create({
      title: courseDef.title,
      description: courseDef.description,
      slug,
      creator: asha._id,
      thumbnail,
      coverImage,
      category: courseDef.category,
      tags: courseDef.tags.split(',').map((s) => s.trim()),
      level: courseDef.level,
      language: courseDef.language,
      price: courseDef.price,
      chapters,
      badges: ['Featured'],
      publishedAt,
    });

    // Add course to asha's courses array
    await User.findByIdAndUpdate(asha._id, { $addToSet: { courses: course._id } });

    allCourses.push(course);
    console.log(`Course created: "${courseDef.title}" [${courseDef.price === 0 ? 'FREE' : `₹${courseDef.price}`}]`);
  }

  // ── Enroll omaku in selected courses ────────────────────────────────────
  // Enroll in: HTML & CSS (free), JavaScript (paid), Indian History, British India
  const enrollIndices = [0, 1, 4, 5];
  for (const idx of enrollIndices) {
    const course = allCourses[idx];
    const existing = await Enrollment.findOne({ student: omaku._id, course: course._id });
    if (!existing) {
      await Enrollment.create({
        student: omaku._id,
        course: course._id,
        progress: idx === 0 ? 35 : idx === 4 ? 20 : 0, // some progress on HTML/CSS and Indian History
        completedChapters: idx === 0 ? [0, 1, 2, 3] : idx === 4 ? [0] : [],
      });
    }
    await User.findByIdAndUpdate(omaku._id, { $addToSet: { courses: course._id } });
    if (!course.students.some((id) => id.equals(omaku._id))) {
      course.students.push(omaku._id);
      course.studentCount = course.students.length;
    }
    // Add rating
    const stars = pickStars(rnd);
    const hasComment = rnd() < 0.8;
    const alreadyRated = course.ratings.some((r) => r.user.equals(omaku._id));
    if (!alreadyRated) {
      course.ratings.push({
        user: omaku._id,
        stars,
        description: hasComment ? pickComment(stars, rnd) : '',
      });
    }
    await course.save();
    console.log(`  Enrolled omaku in: "${course.title}" (progress: ${enrollIndices.indexOf(idx) === 0 ? 35 : enrollIndices.indexOf(idx) === 2 ? 20 : 0}%)`);
  }

  // ── Recalculate averageRating for all courses ───────────────────────────
  for (const course of allCourses) {
    course.studentCount = course.students.length;
    if (course.ratings.length) {
      const total = course.ratings.reduce((sum, r) => sum + r.stars, 0);
      course.averageRating = Number((total / course.ratings.length).toFixed(1));
    }
    await course.save();
  }
  console.log('Recalculated averageRating for all courses');

  // ── Create Communities ──────────────────────────────────────────────────
  const allCommunities = [];
  for (const commDef of COMMUNITIES) {
    const course = allCourses[commDef.courseIndex];
    const thumbnail = await upload(takeImage());
    const headerImage = await upload(takeImage());

    const baseSlug = slugify(commDef.name, { lower: true, strict: true, locale: 'en' });
    let counter = 0;
    let slug = `${baseSlug}-by-${asha.username}-${counter}`;
    while (await Community.findOne({ slug })) {
      counter++;
      slug = `${baseSlug}-by-${asha.username}-${counter}`;
    }

    const members = [asha._id];
    // Add omaku if enrolled in the course
    const isEnrolled = enrollIndices.includes(commDef.courseIndex);
    if (isEnrolled) members.push(omaku._id);

    // For communities where canEveryOneMessage is false, add omaku to userMessagePermission
    // (so omaku can also post in teacher-controlled communities)
    const userMessagePermission = !commDef.canEveryOneMessage && isEnrolled ? [omaku._id] : [];

    const community = await Community.create({
      name: commDef.name,
      description: commDef.description,
      slug,
      creator: asha._id,
      thumbnail,
      headerImage,
      courses: [course._id],
      members,
      memberCount: members.length,
      isPrivate: commDef.isPrivate,
      canEveryOneMessage: commDef.canEveryOneMessage,
      userMessagePermission,
    });

    // Link community to course
    course.community = community._id;
    await course.save();

    allCommunities.push(community);
    console.log(`Community created: "${commDef.name}" [private: ${commDef.isPrivate}, everyoneMsg: ${commDef.canEveryOneMessage}]`);
  }

  // ── Create Posts ────────────────────────────────────────────────────────
  let postCount = 0;
  for (const postDef of POSTS) {
    const community = allCommunities[postDef.communityIndex];
    const author = postDef.authorType === 'teacher' ? asha : omaku;

    const post = await Post.create({
      community: community._id,
      author: author._id,
      content: postDef.content,
      images: [],
      files: [],
      likes: [],
      comments: (postDef.comments || []).map((c) => ({
        author: c.authorType === 'teacher' ? asha._id : omaku._id,
        content: c.content,
      })),
    });

    // Add some likes
    if (rnd() > 0.3) post.likes.push(omaku._id);
    if (rnd() > 0.5) post.likes.push(asha._id);
    await post.save();
    postCount++;
  }
  console.log(`Posts created: ${postCount}`);

  // ── Create UserSchedules for omaku (HTML & CSS + Indian History) ────────
  const scheduleCourses = [
    { index: 0, days: [1, 3, 5], target: 2 }, // HTML & CSS: Mon, Wed, Fri, 2 chapters/day
    { index: 4, days: [2, 4, 6], target: 1 }, // Indian History: Tue, Thu, Sat, 1 chapter/day
  ];
  for (const sc of scheduleCourses) {
    const course = allCourses[sc.index];
    const existing = await UserSchedule.findOne({ user: omaku._id, course: course._id });
    if (!existing) {
      await UserSchedule.create({
        user: omaku._id,
        course: course._id,
        days: sc.days,
        targetChaptersPerDay: sc.target,
      });
      console.log(`  Schedule created for omaku: "${course.title}" (${sc.days.length} days/week)`);
    }
  }

  // ── Create DailyActivity for omaku (last 7 days) ───────────────────────
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];

    const entries = [];
    // Some activity on HTML & CSS course
    if (d % 2 === 0 && d < 5) {
      entries.push({ course: allCourses[0]._id, chapterIndex: Math.min(d, 3) });
    }
    // Some activity on Indian History
    if (d % 3 === 0 && d < 4) {
      entries.push({ course: allCourses[4]._id, chapterIndex: Math.floor(d / 3) });
    }

    if (entries.length > 0) {
      const existing = await DailyActivity.findOne({ user: omaku._id, date: dateStr });
      if (!existing) {
        await DailyActivity.create({
          user: omaku._id,
          date: dateStr,
          entries,
          totalCompleted: entries.length,
        });
      }
    }
  }
  console.log('Daily activities created for last 7 days');

  // ── Final Stats ─────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════');
  console.log('  ASHA SEED COMPLETE');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Courses   : ${allCourses.length}`);
  console.log(`  Communities: ${allCommunities.length}`);
  console.log(`  Posts     : ${postCount}`);
  console.log(`  Enrollments (omaku): ${enrollIndices.length}`);
  console.log('');
  console.log('  Courses created:');
  for (const c of allCourses) {
    console.log(`    • ${c.title} [${c.category}]`);
  }
  console.log('');
  console.log('  Communities:');
  for (const c of allCommunities) {
    console.log(`    • ${c.name} [private: ${c.isPrivate}, everyoneMsg: ${c.canEveryOneMessage}]`);
  }
  console.log('');
  console.log('  Accounts:');
  console.log(`    asha  (teacher) — password: 12348765`);
  console.log(`    omaku (student) — password: 12348765`);
  console.log('═══════════════════════════════════════════════');

  process.exit(0);
};

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

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
