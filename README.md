<p align="center">
  <img src="https://raw.githubusercontent.com/omaku2006/the-courtyard-courses/main/.github/assets/hero2.svg"
       alt="The Courtyard Courses"
       width="100%" />
</p>

<h3 align="center">
  <em>A full-stack e-learning platform dressed as a Victorian academy</em>
</h3>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React_19-1f1e1c?style=for-the-badge&logo=react&logoColor=c9a86a" alt="React 19"></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite_8-1f1e1c?style=for-the-badge&logo=vite&logoColor=c9a86a" alt="Vite 8"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript_6-1f1e1c?style=for-the-badge&logo=typescript&logoColor=c9a86a" alt="TypeScript 6"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_v4-1f1e1c?style=for-the-badge&logo=tailwindcss&logoColor=c9a86a" alt="Tailwind v4"></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express_5-1f1e1c?style=for-the-badge&logo=express&logoColor=c9a86a" alt="Express 5"></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-1f1e1c?style=for-the-badge&logo=mongodb&logoColor=c9a86a" alt="MongoDB"></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1f1e1c?style=for-the-badge&logo=bun&logoColor=c9a86a" alt="Bun"></a>
</p>

<p align="center">
  <a href="https://the-courtyard-courses.vercel.app"><img src="https://img.shields.io/badge/Live_Site-1f1e1c?style=for-the-badge&logo=vercel&logoColor=c9a86a" alt="Live Site"></a>
  <a href="https://the-courtyard-courses.onrender.com"><img src="https://img.shields.io/badge/API-1f1e1c?style=for-the-badge&logo=render&logoColor=c9a86a" alt="API"></a>
</p>

<p align="center">
  <a href="#-features">Features</a> ·
  <a href="#-themes">Themes</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-run-it-locally">Getting Started</a> ·
  <a href="#-api-routes">API</a>
</p>

---

## What is this?

**The Courtyard Courses** is a full-stack e-learning platform where teachers publish courses with chaptered video lessons, students enroll — free or through Razorpay checkout — and work toward daily reading targets. Between lectures they gather in course-gated communities, plan their study schedule, and watch their progress charted in a personal analytics hall.

Everything runs on a hand-tuned design system: Cormorant serif typography, gilded borders, lamplit courtyards — and **four curated themes** you can switch between from any page.

---

## Features

<table>
<tr>
<td width="50%">

### Courses
- Chapters with YouTube-hosted video lessons
- Resource files and demo chapters
- Wishlist for saving courses later
- Star ratings with written reviews
- Free enrollment or Razorpay checkout
- Chapter-by-chapter progress tracking
- Course completion certificates
- Per-course earned badges

</td>
<td width="50%">

### Communities
- Teachers create, students join
- Course-gated access for enrolled members
- Per-community messaging permissions
- Public and private visibility toggle
- Real-time chat with file attachments

</td>
</tr>
<tr>
<td>

### Schedule & Analysis
- Set daily chapter targets per course
- Today's study plan at a glance
- Visual calendar integration
- Student progress charts
- Teacher course statistics dashboards

</td>
<td>

### Auth & Design
- JWT authentication with teacher/student roles
- Four hand-tuned themes (Light, Parchment, Lamplight, Midnight)
- Scroll-reveal choreography & animated gates
- Lamplight glows & atmospheric fog overlays

</td>
</tr>
</table>

---

## Themes

Switch anytime from the palette button in the navbar or dashboard sidebar.

<table>
<tr>
<td align="center" width="25%">
  <b>Light</b><br/>
  <code>#f5eddf</code> · <code>#c9a86a</code><br/>
  <em>Warm ivory, gilded gold</em>
</td>
<td align="center" width="25%">
  <b>Parchment</b><br/>
  <code>#efefdf</code> · <code>#8b6b46</code><br/>
  <em>Aged paper, sepia tones</em>
</td>
<td align="center" width="25%">
  <b>Lamplight</b><br/>
  <code>#1f1e1c</code> · <code>#8c7b63</code><br/>
  <em>Dark study, warm lamp glow</em>
</td>
<td align="center" width="25%">
  <b>Midnight</b><br/>
  <code>#1c232b</code> · <code>#a9927d</code><br/>
  <em>Night sky, antique brass</em>
</td>
</tr>
</table>

---

## Tech Stack

<table>
<tr><th>Layer</th><th>Tools</th></tr>
<tr><td><b>Client</b></td><td>React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Redux Toolkit · TanStack Query · Motion · Phosphor Icons · react-hook-form · Sonner</td></tr>
<tr><td><b>Server</b></td><td>Express 5 · Mongoose 9 · JSON Web Tokens · bcrypt · Multer · Cloudinary SDK · Razorpay SDK</td></tr>
<tr><td><b>Runtime</b></td><td>Bun (server, scripts, and package management)</td></tr>
<tr><td><b>Database</b></td><td>MongoDB via Mongoose ODM</td></tr>
<tr><td><b>Storage</b></td><td>Cloudinary (images, course assets)</td></tr>
<tr><td><b>Payments</b></td><td>Razorpay (course purchases)</td></tr>
<tr><td><b>Linting</b></td><td>oxlint (client)</td></tr>
</table>

---

## Project Structure

```
the-courtyard-courses/
│
├── TheCourtyardCourses/
│   ├── Client/                         # React SPA (Vite + TypeScript)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── auth/               # LoginForm, RegistrationForm
│   │       │   ├── common/             # Navbar, Footer, DashboardSidebar
│   │       │   ├── course/             # ViewCourse, AddCourseForm
│   │       │   ├── community/          # CommunityChat, CommunityCard
│   │       │   ├── dashboardComponents/# Course video, chapters, reviews
│   │       │   ├── schedule/           # ScheduleCreator, ScheduleCalendar
│   │       │   ├── section/            # Hero, FacultyCard, Testimonials
│   │       │   ├── analysis/           # ProgressChart, StatsCard
│   │       │   └── ui/                 # ThemePicker, Fence, Pole, Fog
│   │       ├── features/
│   │       │   ├── auth/               # authSlice (Redux) + useAuth (Query)
│   │       │   ├── course/             # useCourse hooks
│   │       │   ├── community/          # useCommunity hooks
│   │       │   ├── schedule/           # useSchedule hooks
│   │       │   ├── analysis/           # useAnalysis hooks
│   │       │   ├── post/               # usePost hooks
│   │       │   └── themes/             # themeSlice (Redux)
│   │       ├── pages/                  # Route-level components
│   │       ├── services/               # Axios API layer
│   │       ├── app/                    # store.ts, hooks.ts (Redux)
│   │       ├── layouts/                # DashboardLayout, PublicLayout
│   │       └── utils/                  # imageUrl helper
│   │
│   └── Server/                         # Express API
│       ├── app.js                      # Entry point
│       ├── config/                     # db.js, cloudinary.js, razorpay.js
│       ├── controllers/                # auth, course, community, post, schedule, analytics
│       ├── middleware/                  # auth, imageUpload, community
│       ├── models/                     # user, course, community, enrollment, post, payment, schedule
│       ├── routes/                     # user, course, community, post, schedule, analytics
│       ├── utils/                      # uploadToCloudinary, youtubeDuration
│       └── seed/                       # Database seeders
│
├── Learn.md                            # Learning guide (Gujarati + English)
└── README.md
```

---

## Data Models

<details>
<summary><b>User</b></summary>

| Field | Type | Description |
|---|---|---|
| `name` | String | Display name |
| `email` | String | Unique email |
| `username` | String | Unique, lowercase, immutable handle |
| `password` | String | Hashed (select: false) |
| `role` | `student` / `teacher` / `admin` | Access level |
| `avatarImage` | `{ url, publicId }` | Cloudinary-hosted avatar |
| `headerImage` | `{ url, publicId }` | Cloudinary-hosted header |
| `description` | String | Bio text |
| `occupation` | String | Teacher's occupation |
| `experience` | Number | Years of experience |
| `subjects` | `[String]` | Teaching subjects |
| `courses` | `[ObjectId → Course]` | Created courses (teachers) |
| `wishlist` | `[ObjectId → Course]` | Saved courses (students) |
| `learningHours` | `[{ date, hours }]` | Daily study log |
| `badges` | `[String]` | Earned badges |
| `certificates` | `[{ courseId, certificateUrl, issuedAt }]` | Completion certificates |

</details>

<details>
<summary><b>Course</b></summary>

| Field | Type | Description |
|---|---|---|
| `title` | String | Course title |
| `description` | String | Course description |
| `slug` | String | URL-safe unique identifier |
| `thumbnail` | `{ url, publicId }` | Course thumbnail |
| `coverImage` | `{ url, publicId }` | Course cover |
| `creator` | `ObjectId → User` | Teacher who created it |
| `category` | String | Course category |
| `tags` | `[String]` | Searchable tags |
| `level` | `beginner` / `intermediate` / `advanced` | Difficulty |
| `language` | String | Default: English |
| `chapters` | `[{ title, description, videoUrl, videoId, resources, order, demo }]` | Ordered lessons |
| `price` | Number | 0 = free |
| `students` | `[ObjectId → User]` | Enrolled students |
| `community` | `ObjectId → Community` | Linked community |
| `ratings` | `[{ user, stars, description }]` | Student reviews |
| `averageRating` | Number | Denormalized average |
| `certificate` | `{ enabled, template }` | Certificate config |
| `publishedAt` | Date | Null = draft |

</details>

<details>
<summary><b>Community</b></summary>

| Field | Type | Description |
|---|---|---|
| `name` | String | Community name |
| `description` | String | Description |
| `slug` | String | URL-safe identifier |
| `thumbnail` / `headerImage` | `{ url, publicId }` | Images |
| `creator` | `ObjectId → User` | Teacher who created it |
| `courses` | `[ObjectId → Course]` | Linked courses |
| `members` | `[ObjectId → User]` | Joined members |
| `canEveryOneMessage` | Boolean | Open vs restricted chat |
| `userMessagePermission` | `[ObjectId → User]` | Whitelisted chatters |
| `isPrivate` | Boolean | Visibility |

</details>

<details>
<summary><b>Enrollment</b></summary>

| Field | Type | Description |
|---|---|---|
| `student` | `ObjectId → User` | Enrolled student |
| `course` | `ObjectId → Course` | Target course |
| `progress` | Number | 0–100% |
| `completedChapters` | `[Number]` | Chapter indices completed |
| `completed` | Boolean | All chapters done |
| `completedAt` | Date | Completion timestamp |

</details>

---

## API Routes

### Auth & Users (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register (multipart: images + fields) |
| `POST` | `/auth/login` | Login, returns JWT |
| `GET` | `/users/me/profile` | Current user profile |
| `PUT` | `/users/:username` | Update profile (multipart) |
| `GET` | `/users/:username` | Public profile |

### Courses (`/api/course`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create course (teacher, multipart) |
| `GET` | `/` | List all published courses |
| `GET` | `/me/courses` | Teacher's own courses |
| `GET` | `/me/enrolled` | Student's enrolled courses |
| `GET` | `/:slug` | Course detail by slug |
| `PUT` | `/:courseId` | Update course (teacher) |
| `PATCH` | `/:courseId/publish` | Toggle publish status |
| `DELETE` | `/:courseId` | Delete course |
| `POST` | `/:courseId/enroll` | Enroll in course (student) |
| `POST` | `/payment/verify` | Razorpay payment verification |
| `POST` | `/:courseId/ratings` | Add/update rating |
| `GET` | `/:courseId/ratings` | Fetch ratings |
| `GET` | `/:courseId/progress` | Fetch progress |
| `POST` | `/:courseId/progress` | Update chapter completion |
| `GET` | `/:courseId/wishlist` | Check wishlist status |
| `POST` | `/:courseId/wishlist` | Toggle wishlist |
| `GET` | `/:courseId/certificate` | Fetch certificate |

### Communities (`/api/community`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create community |
| `GET` | `/` | List communities |
| `GET` | `/:slug` | Community detail |
| `PUT` | `/:slug` | Update community |
| `DELETE` | `/:slug` | Delete community |
| `POST` | `/:slug/join` | Join community |
| `DELETE` | `/:slug/leave` | Leave community |

### Posts / Messages (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/posts/:communitySlug` | Send message |
| `GET` | `/posts/:communitySlug` | Fetch messages |

### Schedule (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/schedule` | Create/update schedule |
| `GET` | `/schedule` | Fetch today's schedule |
| `GET` | `/schedule/calendar` | Calendar view |

### Analytics (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/student` | Student progress stats |
| `GET` | `/analytics/teacher` | Teacher course stats |

---

## Client Pages

<details>
<summary><b>Public Routes</b></summary>

| Path | Page | Description |
|---|---|---|
| `/` | `HomePage` | Hero section, faculty cards, testimonials, newsletter |
| `/courses` | `PublicCoursePage` | Browse all published courses |
| `/communities` | `PublicCommunityPage` | Browse communities |
| `/user/:username` | `PublicProfilePage` | View any user's public profile |
| `/login` | `AuthPage` | Login and registration forms |
| `/about` | `AboutPage` | About the platform |

</details>

<details>
<summary><b>Dashboard Routes</b> <em>(auth required)</em></summary>

| Path | Page | Description |
|---|---|---|
| `/dashboard` | `DashboardPage` | Overview hub |
| `/dashboard/me` | `FetchMe` | Edit own profile |
| `/dashboard/courses` | `PublicCoursePage` | Browse courses (authed) |
| `/dashboard/my-courses` | `MyCourses` | Teacher's created courses |
| `/dashboard/:slug` | `ViewCourse` | Full course viewer |
| `/dashboard/users/:username` | `PublicProfilePage` | Profile (authed) |
| `/dashboard/communities` | `CommunityPage` | Manage communities |
| `/dashboard/communities/:slug` | `CommunityChat` | Live messaging |
| `/dashboard/communities/:slug/details` | `CommunityDetails` | Community info |
| `/dashboard/schedule` | `SchedulePage` | Daily study plan |
| `/dashboard/analysis` | `AnalysisPage` | Progress charts |

</details>

---

## Run It Locally

> Requires [Bun](https://bun.sh) and a MongoDB instance (local or Atlas).

```bash
git clone https://github.com/omaku2006/the-courtyard-courses.git
cd the-courtyard-courses
```

### 1 — Server

Serves on `http://localhost:3000`

```bash
cd TheCourtyardCourses/Server
bun install
cp .env.example .env    # fill in the values below
bun run dev
```

### 2 — Client

Runs on `http://localhost:5173`, proxies `/api` to port 3000

```bash
cd TheCourtyardCourses/Client
bun install
bun dev
```

---

## Environment Variables

Create `TheCourtyardCourses/Server/.env` based on `.env.example`:

| Variable | Description |
|---|---|
| `MONGODB` | MongoDB connection string (`mongodb+srv://...` or `mongodb://localhost:27017/courtyard`) |
| `JWT_SECRET` | Secret key for JSON Web Token signing |
| `CLOUDINARY_URL` | Cloudinary credentials (`cloudinary://api_key:api_secret@cloud_name`) |
| `YOUTUBE_KEY` | YouTube Data API v3 key (for video duration fetching) |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

---

## Key Concepts

### Authentication Flow

```
Register/Login ──▶ JWT issued ──▶ Stored in Redux + localStorage
                                    │
                    Sent via Authorization header on every request
                                    │
                    verifyToken middleware decodes & attaches req.user
                                    │
                    isTeacher / isStudent middleware gates routes
```

### File Upload Pipeline

```
Client (FormData) ──▶ Axios (auto multipart) ──▶ Multer (temp disk)
        │                                            │
        │                                      Cloudinary SDK (upload)
        │                                            │
        │                                      MongoDB (save url + publicId)
        │                                            │
        └──────────── Response ◀──────────── Temp file cleanup
```

### State Management

| Concern | Solution |
|---|---|
| Server data (courses, users, etc.) | TanStack Query — `useQuery` / `useMutation` |
| Client/global state (auth, theme) | Redux Toolkit — `authSlice`, `themeSlice` |

### Data Flow — Enrolling in a Course

```
 1. Student clicks "Enroll" on PublicCoursePage
 2. If paid → Razorpay checkout opens
              → payment verified via /api/course/payment/verify
 3. POST /api/course/:courseId/enroll
              → Enrollment created in MongoDB
              → Course.students array updated
 4. Student redirected to /dashboard/:slug (ViewCourse)
 5. TanStack Query invalidates cache → UI refreshes
```

---

<p align="center">
  <sub>Built with Victorian elegance and modern web technology.</sub>
</p>
