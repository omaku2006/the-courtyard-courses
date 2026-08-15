# The Courtyard Courses — Course Upload & Publish (Learn2.md)

> Aa file Course (create + publish) na full flow ne samjave chhe:
> **FormData** → **Multer** → **busboy bracket-parsing** → **Cloudinary {url, publicId}**
> → **publishedAt (Draft / Scheduled / Published)**.
> Terminal ma read karva: `cat Learn2.md` (thodu nakki lage to `less -R Learn2.md`).

---

## Table of Contents

1. [Aa File Ma Shun Shikhashe](#1-aa-file-ma-shun-shikhashe)
2. [FormData — Sab Nu Mul (fd.append)](#2-formdata--sab-nu-mul-fdappend)
3. [Multer — Server Par Files Receive Kare](#3-multer--server-par-files-receive-kare)
4. [The Busboy Surprise (The Bug We Fixed)](#4-the-busboy-surprise-the-bug-we-fixed)
5. [uploadCourseAssets Middleware Walkthrough](#5-uploadcourseassets-middleware-walkthrough)
6. [Controller — String Values Cast Karna](#6-controller--string-values-cast-karna)
7. [Cloudinary {url, publicId} Pattern](#7-cloudinary-url-publicid-pattern)
8. [publishedAt — Draft / Scheduled / Published](#8-publishedat--draft--scheduled--published)
9. [React Query Hooks — useQuery / useMutation](#9-react-query-hooks--usequery--usemutation)
10. [Full Request Lifecycle (End-to-End)](#10-full-request-lifecycle-end-to-end)
11. [Gotchas Cheat-Sheet](#11-gotchas-cheat-sheet)
12. [Practice Exercises](#12-practice-exercises)

---

## 1. Aa File Ma Shun Shikhashe

| Concept | Kya code ma chhe | Ek line ma |
|---|---|---|
| FormData | `AddCourseForm.tsx` (`onSubmit`) | Form ma files + text bhejvanu |
| Multer `any()` | `course.router.js` | Files server par receive karvanu |
| busboy bracket parsing | `imageUpload.js` (middleware) | `chapters[0][title]` khud nested banse |
| Cloudinary `{url, publicId}` | `imageUpload.js` + `models/course.js` | URL + publicId bane store karvu |
| `publishedAt` | `course.controller.js` + `MyCourses.tsx` | Draft/Schedule/Publish flow |
| React Query | `useCourse.ts` | Fetch + Mutate + cache invalidate |

---

## 2. FormData — Sab Nu Mul (fd.append)

### 2.1 FormData chhe shun?

FormData = browser nu built-in object je **text + files bane** ek request ma bhejva mate bane chhe. Content-type `multipart/form-data` thay chhe — etle server par file upload thay chhe.

```ts
const fd = new FormData();

fd.append('title', 'Victorian History');          // text field
fd.append('thumbnail', fileObject);               // file (File object)
fd.append('tags', 'History, India');
```

### 2.2 `.append()` kem kaam kare?

```ts
fd.append(name, value)
```

- **name** = server par `req.body` / `req.files` maa je key thi aavse
- **value** = string hoy to text field, `File`/`Blob` hoy to file field

Ek nam **barabar append** karvi sake (array jem):
```ts
fd.append('chapters[0][resources]', pdf1);
fd.append('chapters[0][resources]', pdf2);
```

### 2.3 Bracket Notation — `chapters[0][title]` kem?

HTML `<input name="chapters[0][title]">` nu puranu standard chhe. Ante:
- `chapters` → array
- `[0]` → index 0
- `[title]` → chhella object nu key

**Matlab client par tu structure FormData ma lakhe chhe** (bracket syntax thi), ane server par busboy e structure **jodi ne** aape chhe. Aapde evu kariye:

```ts
data.chapters.forEach((chapter, index) => {
  fd.append(`chapters[${index}][title]`, chapter.title);
  fd.append(`chapters[${index}][typeOfChapter]`, chapter.typeOfChapter);
  fd.append(`chapters[${index}][demo]`, String(chapter.demo));

  if (chapter.videoSource === 'url') {
    fd.append(`chapters[${index}][videoUrl]`, chapter.videoUrl);
  } else if (chapter.video?.[0]) {
    fd.append(`chapters[${index}][video]`, chapter.video[0]);   // File object
  }

  Array.from(chapter.resources ?? []).forEach((file) => {
    fd.append(`chapters[${index}][resources]`, file);          // FileList -> loop
  });
});
```

### 2.4 FileList Gotcha (aa bug padi hatu!)

`<input type="file" multiple>` nu value **`FileList`** chhe — array **nathi**.

```ts
chapter.resources.forEach(...)   // ❌ TypeError: forEach is not a function!
```

FileList maa `.length`, `[0]`, `item(i)` chhe, pan `.forEach` **nathi**. Fix:

```ts
Array.from(chapter.resources ?? []).forEach((file) => fd.append(..., file));
// athva:
[...chapter.resources].forEach(...)
// athva:
for (const file of chapter.resources ?? []) ...
```

> RHF (`react-hook-form`) file input ni value FileList j rakhe chhe, ete `data.chapters[i].resources` FileList chhe.

### 2.5 Axios + FormData

```ts
const res = await api.post('/course/', fd);
```

Axios `FormData` joi ne **khud** `Content-Type: multipart/form-data; boundary=...` set kare chhe — kai `headers` manual set karvu nahi padatu. (Manual `application/json` set karso to file break thase.)

---

## 3. Multer — Server Par Files Receive Kare

### 3.1 Multer chhe shun?

Express khud multipart parse nahi kare (express.json khali JSON kare). **Multer** = middleware je multipart body parse kari ne:
- **text fields** → `req.body`
- **files** → `req.files` (temp file `upload/` folder ma)

```js
import multer from 'multer';
const upload = multer({
  dest: 'upload/',
  limits: { fileSize: 10 * 1024 * 1024, files: 50 },  // 10MB/file, max 50 files
});
```

### 3.2 `fields()` vs `any()` — kyo any()?

**`upload.fields([{ name: 'thumbnail' }, { name: 'coverImage' }])`** — tu exact names batave chhe. Jo request ma koi **biji** file aave to multer `Unexpected field` error faake.

Aapda chapter files na names **dynamic** chhe (`chapters[0][video]`, `chapters[1][video]`, ...) — pehla thi list banai na shake. Ete:

```js
courseRouter.post('/', verifyToken, isTeacher, upload.any(), uploadCourseAssets, createCourse);
```

**`upload.any()`** — badhi files accept kare (`req.files` maa badhi aavse), ane grouping aapde middleware maa khud kariye. (Limits pan ete j set kari — `any()` unlimited files letu nathi etle protection.)

### 3.3 Request Par Shun Aavse?

```
multipart body                          →  multer
├── text:  title                        →  req.body.title
├── text:  chapters[0][title]           →  req.body.chapters[0].title   ← nested!
├── text:  chapters[0][demo]            →  req.body.chapters[0].demo
├── file:  chapters[0][video]           →  req.files → fieldname "chapters[0][video]"
├── file:  chapters[0][resources] ×2    →  req.files (be alag entries)
├── file:  thumbnail                    →  req.files → fieldname "thumbnail"
```

---

## 4. The Busboy Surprise (The Bug We Fixed)

### 4.1 Shun thayu hatu?

Pehla mero middleware **flat keys** parse karva niche hato:

```js
// ❌ GALAT — aa kaddu nathi
for (const [key, value] of Object.entries(req.body)) {
  const m = key.match(/^chapters\[(\d+)\]\[(\w+)\]$/);
  ...
}
```

Error: `chapters.0.title: Path 'title' is required` — kem ke `title` kabhi na pocheto.

### 4.2 Asli sachchai

**multer/busboy bracket notation ne KHUD parse kare chhe!** `chapters[0][title]` aavta j aavse as **nested object**, flat key naa.

```js
// Actual: req.body.chapters[0] = { title: 'Intro', demo: 'false', ... }
// Nahoti: req.body['chapters[0][title]']
```

Eto flat-key parse kare ne `req.body.chapters` maa **khali** text fields na pocheta. Files thi entry banai (kyo ke file nu `fieldname` raw `chapters[0][video]` j rey chhe) → chapter 0 maa title khali.

### 4.3 Kevi rite sodhi? (Debugging method)

Koi assumption par bhrosso nahi — **real FormData + real multer** valo tiny test lakh:

```ts
const fd = new FormData();
fd.append('chapters[0][title]', 'Intro');
fd.append('chapters[0][video]', new File(['x'], 'a.mp4', { type: 'video/mp4' }));

const res = await fetch(`http://localhost:${port}/t`, { method: 'POST', body: fd });
console.log(JSON.stringify(await res.json()));
// → {"body":{"chapters":[{"title":"Intro"}]},"fileCount":1}
```

Ena thi `any()` text + files bane parse kare chhe ane **nested** body male chhe evu sidhu padyu.

### 4.4 Final Design

Middleware **khali files** handle kare (text already `req.body.chapters` ma chhe):

```js
const chapters = Array.isArray(req.body.chapters) ? req.body.chapters : [];
// files ne regex thi match kari ne chapter object maa inject karo
```

> **Lesson:** File kaam karva mate khabar padvu joiye ke library (busboy) pehla thi shun kari chuke chhe. Test lakh, assume nai.

---

## 5. uploadCourseAssets Middleware Walkthrough

File: `Server/middleware/imageUpload.js` (line 43–85)

```js
const CHAPTER_FILE = /^chapters\[(\d+)\]\[(video|resources)\]$/;
```

Regex samju:
- `^chapters\[` → "chapters[" thi start
- `(\d+)` → index (capture group 1)
- `\]\[` → "]["
- `(video|resources)` → file type (capture group 2)
- `\]$` → "]" end

Middleware flow:

```js
export const uploadCourseAssets = async (req, res, next) => {
  try {
    let thumbnail = null;
    let coverImage = null;

    // 1) Text fields pehla thi j nested req.body.chapters maa chhe (busboy)
    const chapters = Array.isArray(req.body.chapters) ? req.body.chapters : [];

    // 2) Badhi files par loop
    for (const file of req.files ?? []) {
      const m = file.fieldname.match(CHAPTER_FILE);
      if (m) {
        const idx = Number(m[1]);
        const chapter = chapters[idx] ?? {};
        const uploaded = await uploadToCloudinary(file.path);   // Cloudinary par upload

        if (m[2] === 'video') {
          chapter.videoUrl = uploaded.url;       // cloud URL
          chapter.videoId = uploaded.publicId;   // public_id (delete mate)
        }
        if (m[2] === 'resources') {
          chapter.resources = [...(chapter.resources ?? []), uploaded]; // array ma push
        }
        chapters[idx] = chapter;
      } else if (file.fieldname === 'thumbnail') {
        thumbnail = await uploadToCloudinary(file.path);
      } else if (file.fieldname === 'coverImage') {
        coverImage = await uploadToCloudinary(file.path);
      }
      await cleanup(file);                       // temp file delete
    }

    req.body.chapters = chapters.filter(Boolean);   // gaps remove
    req.cloudinaryImages = { thumbnail, coverImage }; // niche controller maa jay

    next();                                      // createCourse par jao
  } catch (e) {
    for (const file of req.files ?? []) await cleanup(file);
    next(e);                                     // error handler par
  }
};
```

### 5.1 cleanup() — temp file leak nahi thay

```js
const cleanup = async (file) => {
  if (!file) return;
  try { await unlink(file.path); } catch { /* request fail na thay */ }
};
```

Multer file ne `upload/` folder ma save kare. Cloudinary par upload thaya pachi `unlink` thi temp file delete karvi pade — nahi to server disk full thay.

### 5.2 Middleware chain kem chaleye

```
POST /api/course/
  ├── verifyToken       → req.user set kare (JWT verify)
  ├── isTeacher         → role check
  ├── upload.any()      → req.body + req.files parse
  ├── uploadCourseAssets→ Cloudinary upload + chapters ni URL inject
  └── createCourse      → final DB ma save
```

Darek middleware `req` par kai **attach** kare chhe ane `next()` kare chhe; chello controller response bheje.

---

## 6. Controller — String Values Cast Karna

### 6.1 FormData badhu STRING bheje chhe!

Browser FormData text fields hamesha **string** bane bheje. Eto:

- `demo: "false"` — aapde boolean joiye
- `price: "100"` — aapde number joiye
- `order: "0"` — number joiye

### 6.2 The "false" Bug (important!)

```js
if ("false") { ... }   // ✅ string "false" TRUTHY chhe!
if (false) { ... }     // ❌ boolean false falsy chhe
```

Eto `demo` string "false" rahe to mongoose `demo: "false"` cast kare → **truthy** → demo always true! Ete controller maa cast:

```js
chapters: (chapters ?? []).map((c) => ({
  title: c.title,
  typeOfChapter: c.typeOfChapter,
  videoUrl: c.videoUrl,
  videoId: c.videoId,
  resources: c.resources ?? [],
  order: Number(c.order ?? 0),
  demo: c.demo === 'true' || c.demo === true,   // ← boolean cast
})),
```

### 6.3 Tags/Badges — comma string → array

Form maa tags ek input chhe ("History, India Colonise, 1755"). Model `tags: [String]` chhe. `parseList` helper:

```js
const parseList = (value) =>
  typeof value === 'string'
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(value) ? value : [];

tags: parseList(tags),
```

---

## 7. Cloudinary {url, publicId} Pattern

### 7.1 Kyo bane store karvu?

`uploadToCloudinary(filePath)` return kare:

```js
{ url: 'https://res.cloudinary.com/...', publicId: 'TheCourtyardCourses/abc123' }
```

- **url** — display/stream mate (img src, video src)
- **publicId** — Cloudinary par asset nu ID → **delete/update** mate

Course update thay tyare **purani image delete** karvi pade (`deleteFromCloudinary(publicId)`). publicId na store kare to delete na bane. Ete model maa object rakhyu:

```js
// models/course.js
thumbnail: {
  url: { type: String, default: '' },
  publicId: { type: String, default: '' },
},
```

Chapter resources:

```js
resources: [
  { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
],
videoUrl: String,   // video no URL
videoId: String,    // video nu publicId
```

### 7.2 Client side helper — imageUrl()

`Client/src/utils/imageUrl.ts` — purana data (`thumbnail` as string) + navo (`{url, publicId}`) bane handle kare:

```ts
type CloudinaryImage = string | { url?: string | null; publicId?: string | null } | null | undefined;

export const imageUrl = (image: CloudinaryImage): string =>
  typeof image === 'string' ? image : (image?.url ?? '') || '';
```

---

## 8. publishedAt — Draft / Scheduled / Published

### 8.1 Design (taro idea — YouTube premiere jem)

| Value | Status | Students ne |
|---|---|---|
| `null` | **Draft** | Dikhe j nathi |
| future date | **Scheduled** | Catalog maa dikhe, "unlocks on {date}" pan content lock |
| past/now | **Published** | Kholi shake |

### 8.2 Model

```js
publishedAt: { type: Date, default: null },
```

### 8.3 Catalog — kyo scheduled dikhe chhe?

`fetchCourses` maa:

```js
const filter = { publishedAt: { $ne: null } };   // null nathi e badha (future + past)
```

Draft (`null`) filter thai jay. Scheduled (future) ane Published bane **dikhse** — e j tari requirement chhe.

### 8.4 publishCourse Controller (3 modes, ek function)

File: `Server/controllers/course.controller.js`

```js
export const publishCourse = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id;
  const { publishedAt } = req.body;   // body maa kya aavyo

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found!' });
  if (course.creator.toString() !== teacherId) {
    return res.status(403).json({ message: "You cannot publish someone else's course!" });
  }

  let value;
  if (publishedAt === null) value = null;            // → Draft
  else if (publishedAt) value = new Date(publishedAt); // → Scheduled
  else value = new Date();                            // → Publish Now

  course.publishedAt = value;
  await course.save();

  return res.status(200).json({ message: 'Course publish status updated!', publishedAt: course.publishedAt });
};
```

**Ek function, teen behavior** — `req.body` maa shun aavyo ena par depend:
- `{ publishedAt: null }` → draft
- `{ publishedAt: "2026-09-01T..." }` → schedule
- `{}` (khali) → publish now

### 8.5 Route

```js
courseRouter.patch('/:courseId/publish', verifyToken, isTeacher, publishCourse);
```

### 8.6 MyCourses UI

`Client/src/pages/MyCourses.tsx`:

- `useMyCourses()` → teacher na courses
- Status helper:

```ts
const getStatus = (publishedAt?: string | null): CourseStatus => {
  if (!publishedAt) return 'Draft';
  return new Date(publishedAt).getTime() > Date.now() ? 'Scheduled' : 'Published';
};
```

- Card par: status badge, `datetime-local` input + **Schedule**, **Publish Now**, **Set Draft** buttons

```ts
// Schedule → date string moklu
onPublish(course._id, new Date(schedule).toISOString());
// Publish Now → undefined ({} body) → server Publish Now
onPublish(course._id);
// Set Draft → null
onPublish(course._id, null);
```

---

## 9. React Query Hooks — useQuery / useMutation

File: `Client/src/features/course/useCourse.ts`

### 9.1 useQuery (fetch karo)

```ts
export const useMyCourses = () => {
  return useQuery({
    queryKey: ['myCourses'],      // cache key
    queryFn: courseServices.fetchMyCourses,
  });
};
```

- `data` → response
- `isLoading` → loading state
- Same `queryKey` walu query cache maa rey — page switch pachi **refetch na thay** (automatic)

### 9.2 useMutation (write karo)

```ts
export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, publishedAt }) =>
      courseServices.publishCourse(courseId, publishedAt),
    onSuccess: () => {
      toast.success('Publication Status Updated!');
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });   // ← key!
    },
    onError: (error) => {
      toast.error('Interruption in Proceedings', {
        description: error?.response?.data?.message || error?.message || 'Something went wrong!',
      });
    },
  });
};
```

### 9.3 invalidateQueries — success pachi fetch

Publish thaya pachi list maa **status change** thay. `invalidateQueries({ queryKey: ['myCourses'] })` kahse "aa cache puranu thai gyu, refetch karo" — etle card par status badge instantly update thay jay.

> Mutation → server par write → cache invalidate → list khud refetch. Aa React Query ni sabse badi power chhe.

---

## 10. Full Request Lifecycle (End-to-End)

### Create Course (files + text)

```
[Browser] form submit
   │  RHF → data (FileList + strings)
   ▼
onSubmit() → build FormData (fd.append, bracket notation)
   │
   ▼
courseServices.createCourse(fd)  → axios POST /course/
   │  Content-Type: multipart/form-data; boundary=...
   ▼
[Server] course.router.js
   ├── verifyToken (JWT → req.user)
   ├── isTeacher (role check)
   ├── upload.any() → req.body (nested chapters) + req.files (temp files)
   ├── uploadCourseAssets
   │     ├── chapters[0][video]  → Cloudinary → videoUrl + videoId
   │     ├── chapters[0][resources] ×2 → Cloudinary → resources [{url, publicId}]
   │     ├── thumbnail / coverImage → Cloudinary → req.cloudinaryImages
   │     └── temp files cleanup()
   └── createCourse → mongoose save → 201 { id, slug, title }
   │
   ▼
[Browser] toast "Curriculum Established!"
```

### Publish (small JSON)

```
[Browser] MyCourses card → Publish Now / Schedule / Set Draft
   │
   ▼
usePublishCourse().mutate({ courseId, publishedAt })
   │
   ▼
axios PATCH /course/:courseId/publish  (JSON body)
   │
   ▼
[Server] verifyToken → isTeacher → publishCourse
   │  publishedAt = null | new Date(date) | new Date()
   ▼
Course.save() → invalidateQueries → MyCourses refetch → status badge update
```

---

## 11. Gotchas Cheat-Sheet

| Gotcha | Fix |
|---|---|
| `FileList.forEach is not a function` | `Array.from(fileList).forEach(...)` |
| `fields()` Unexpected field (dynamic names) | `upload.any()` + `limits` |
| busboy `chapters[0][title]` nested aave, flat nahi | Text khud parse nai karvu, `req.body.chapters` ready chhe |
| `"false"` string truthy chhe! | `demo: c.demo === 'true' \|\| c.demo === true` |
| FormData badhu string | `Number(price)`, `Number(order)` cast |
| `tags: "a, b"` vs model `[String]` | `parseList()` split + trim |
| Cloudinary free plan 10MB/file | multer `limits.fileSize` + Cloudinary error handle |
| Temp files `upload/` maa rehse | `cleanup()` — `unlink` after upload |
| `any()` unlimited files (DoS) | `limits: { files: 50 }` |
| publishedAt default `null` = draft | Catalog `$ne: null` filter e scheduled ane published bane dikhade |

---

## 12. Practice Exercises

1. **FormData build karo** — ek chapter video file + 2 resources file sathe (bracket notation). `console.log(fd.getAll('chapters[0][resources]').length)` → 2 aavvu joiye.

2. **Test lakh** — busboy parsing verify karva: `chapters[0][title]` + `chapters[0][video]` file → real multer route par. Khabar karo nested `req.body.chapters` aavse ke nahi (aa file section 4 ma batavyu).

3. **Status badge logic** — `getStatus` ne 3 cases maa test karo: null, future date, past date. Ek JavaScript file maa `Date.now()` sathe.

4. **parseList** — `"History, India Colonise, 1755"` → `['History', 'India Colonise', '1755']`. Edge: `"  a  ,,  b  "` → `['a', 'b']`.

5. **deleteFromCloudinary use** — `publishCourse` jem ek `unpublish` flow maa purani video ni `videoId` thi delete kaise thay e plan karo (delete route maa pan aaj use thay).

6. **Future date content lock** — `fetchCourse` maa check: `publishedAt` future hoy ane user creator naa hoy to `403 "Unlocks on {date}"`. (Ahiya aje nathi — tu banave toh `fetchCourse` controller maa.)

---

> Sarsari: **FormData** text+files mokle → **multer** parse kare (text nested, files alag) → middleware files ne Cloudinary par mokli ne **{url, publicId}** inject kare → controller strings ne **cast** kare → **publishedAt** draft/schedule/publish nu taali chalaave. Darek level par test + `console.log` — assumption kabhi nai.
