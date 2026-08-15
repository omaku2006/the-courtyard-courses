# The Courtyard Courses — Learning Guide (Learn.md)

> Aa file tamne badhu samjave che: file upload kaise works, React Query,
> TypeScript types, Redux, ane badha concepts jo tamne code ma malse.
> Terminal ma read karva: `cat Learn.md` (thodu nakki lage to `less -R Learn.md`).

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Request Lifecycle (Data Flow)](#2-request-lifecycle-data-flow)
3. [File Upload — Full Journey](#3-file-upload--full-journey)
4. [TanStack Query (React Query)](#4-tanstack-query-react-query)
5. [TypeScript Essential Types](#5-typescript-essential-types)
6. [Redux Toolkit Basics](#6-redux-toolkit-basics)
7. [HTTP & REST — Quick Recap](#7-http--rest--quick-recap)
8. [JSON vs multipart/form-data](#8-json-vs-multipartform-data)
9. [Case Study: The Bugs We Fixed](#9-case-study-the-bugs-we-fixed)
10. [Practice Exercises](#10-practice-exercises)
11. [How to Become a Powerful Web Dev](#11-how-to-become-a-powerful-web-dev)

---

## 1. Project Structure

### Folder Structure

```
synent-task8-TheCourses-OmUpadhyay/
├── TheCourtyardCourses/
│   ├── Client/          → React + Vite + TypeScript
│   │   └── src/
│   │       ├── pages/           → FetchMe.tsx (profile page)
│   │       ├── components/      → auth, common, ui components
│   │       ├── features/        → authSlice (Redux), useAuth.ts (React Query hooks)
│   │       ├── services/        → api.ts (axios), authServices.ts (API calls)
│   │       ├── utils/           → imageUrl.ts
│   │       └── layouts/         → DashboardLayout etc.
│   └── Server/         → Express + Mongoose + Multer + Cloudinary
│       ├── app.js               → entry point
│       ├── routes/user.router.js
│       ├── controllers/auth.controller.js
│       ├── middleware/          → auth.middleware.js, registrationImageUpload.js
│       ├── models/user.js
│       ├── utils/uploadToCloudinary.js
│       └── config/              → db.js, cloudinary.js
└── Learn.md             → aaho, aa file
```

### Client vs Server — Kaun Kya Kare

| | Client | Server |
|---|---|---|
| Kyam chhe | Browser ma | Computer par (localhost:3000) |
| Shun chhe | UI, form, request mokle | Data, files, DB, logic |
| Tech | React, axios, Redux, Query | Express, Mongoose, Multer, Cloudinary |
| Data mokle | `http://localhost:3000/api/...` | Response bheje |

Client **direct** MongoDB ma nahi lakh sakto — har cheez **API** thi jay che.

---

## 2. Request Lifecycle (Data Flow)

Har request na 5 steps:

```
[Browser]                    [Server]
─────────                    ────────
 1. User click/form
 2. axios request bheje ────▶  3. Route match (multer parse)
                               4. Middleware (verify token, upload image)
                               5. Controller → DB / Cloudinary
 6. Response user ne bheje ◀── 5. Response JSON ma return
```

Example — Profile Update:

```
FetchMe.tsx (Save button)
    │  FormData + files
    ▼
api.put('/users/:username', fd)      ← axios, token header auto
    │
    ▼
user.router.js: PUT /users/:username
    │  upload.fields([avatar, header])   ← multer: files → upload/ folder
    │  verifyToken                        ← JWT check, req.user set kare
    │  uploadImage                        ← Cloudinary par upload, req.cloudinaryImages
    ▼
auth.controller.js: updateUser
    │  $set updateData → MongoDB
    ▼
json response { message: 'Profile updated successfully!' }
    │
    ▼
useAuth.ts onSuccess → invalidateQueries(['user']) → UI auto-refresh
```

---

## 3. File Upload — Full Journey

### Step 1: User File Select Kare (Client)

`Client/src/components/auth/RegistrationForm.tsx`

```tsx
<input
  type="file"
  id="avatar"
  accept="image/png, image/jpeg"
  className="hidden"
  {...register('avatarImage')}   // react-hook-form ne files aapi de
/>
```

- `type="file"` input user ne **`File` object** aape (actual binary data, file no path nahi).
- React-hook-form `register()` thi value `data.avatarImage` ma malse, je **`FileList`** chhe.

### Step 2: FormData — Files + Text Ek Sath

```tsx
const fd = new FormData();                       // browser no built-in API
fd.append('name', data.name);                    // text field
fd.append('subjects', 'Physics');                // repeated key → array server par
fd.append('avatarImage', data.avatarImage[0]);   // actual File object
registerMutate(fd);
```

### Step 3: Axios Send Kare

`Client/src/services/authServices.ts`

```ts
register: async (data: FormData) => {
  const res = await api.post('/auth/register', data);
  return res.data;
},
```

**Magic:** axios `FormData` joye to:
- `Content-Type: multipart/form-data` (with boundary) auto set kare
- JSON.stringify KARE NAHI — binary as-is jay

> `api.ts` ma default `Content-Type: application/json` chhe, pan axios FormData thi e auto remove kari de chhe.

### Step 4: Multer Receive Kare (Server)

`Server/routes/user.router.js`

```js
const upload = multer({ dest: 'upload/' });   // temp folder

userRouter.post(
  '/auth/register',
  upload.fields([{ name: 'avatarImage', maxCount: 1 },
                 { name: 'headerImage', maxCount: 1 }]),
  checkValidInputForRegistration,
  uploadImage,
  registerUser
);
```

**Multer kya kare:**
1. Multipart body **parse** kare
2. Files **disk par temp** save kare (`upload/`)
3. Info `req.files` ma muke:
   `{ avatarImage: [{ path: 'upload/xxx', mimetype, size, ... }] }`
4. Baaki text fields `req.body` ma

### Step 5: Custom Middleware → Cloudinary

`Server/middleware/registrationImageUpload.js`

```js
import { unlink } from 'node:fs/promises';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

if (req.files?.avatarImage?.[0]) {
  const file = req.files.avatarImage[0];
  avatar = await uploadToCloudinary(file.path);  // disk file → cloudinary
  await cleanup(file);                            // temp file delete
}

req.cloudinaryImages = { avatarImage: avatar, headerImage: header };
```

### Step 6: Cloudinary Upload (Cloud Storage)

`Server/utils/uploadToCloudinary.js`

```js
const result = await cloudinary.uploader.upload(file, {
  folder: 'TheCourtyardCourses',
  resource_type: 'auto',
});
return { url: result.secure_url, publicId: result.public_id };
```

Upload pachhi 2 cheez malse:
- **`url`** — internet par image link, browser ma `<img src={url}>`
- **`publicId`** — image no ID, **delete** karva mate jaruri

### Step 7: MongoDB Save (Controller)

```js
const user = await User.create({ avatarImage, headerImage, ... });
```

MongoDB ma object j save thay:

```js
avatarImage: { url: 'https://res.cloudinary.com/.../abc.jpg', publicId: 'abc' }
```

### Kem a badhu? (Why this whole chain)

- **JSON na files?** Binary data JSON ma nahi sakato (base64 heavy hoi).
- **Multer na temp files?** Cloudinary SDK file path maange, pachhi cleanup jaruri.
- **publicId kyu?** Update ma nayi image aave to juni delete karva (`deleteFromCloudinary`).

---

## 4. TanStack Query (React Query)

### Philosophy

Aapde DB (server state) ne React state ma nahi rakhta. Query cache = server data no store. Component khali `useQuery` mangaav che.

### useQuery — READ

`Client/src/features/auth/useAuth.ts`

```ts
export const useFetchMyProfile = () => {
  const token = useAppSelector((state) => state.auth.token);
  return useQuery({
    queryKey: ['user'],                    // cache no unique key
    queryFn: authServices.fetchMyProfile,  // GET /users/me/profile
    enabled: !!token,                      // token nahi to request na karo
  });
};
```

Returns:

```ts
{
  data,        // success no response body
  isLoading,   // pehli var request chalu che (koyi data nahi)
  isError,     // request fail thai
  error,       // error object
  refetch,     // manually dubi var
  isFetching,  // koi var request chalu (background refetch pn)
}
```

**Query Key kyu?** `['user']` same key vaali query React Query cache ma rakhe. Biji component e query use kare to network nathi — cache mathi instantly mile, pachhi stale thai to background refetch.

### useMutation — WRITE

```ts
const { mutate: updateProfile, isPending } = useUpdateProfile();

<button onClick={() => updateProfile({ username, formData })} disabled={isPending}>
  {isPending ? 'Inscribing...' : 'Save Changes'}
</button>
```

- `mutate(payload)` — request call karo
- `isPending` — request chalu che (button disabled + text change)
- **Mutation cache kare nathi** — write request che, caching no sens nahi

### queryClient + invalidateQueries — Data Refresh

Mutation pachhi server par data badlai, pan page par juno cache che. Fix:

```ts
const queryClient = useQueryClient();   // main.tsx no QueryClient reference

onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['user'] });
  // "['user'] wali query stale chhe → refetch karo"
}
```

Flow:

```
Save → mutate → PUT request → onSuccess toast
     → invalidateQueries(['user']) → useFetchMyProfile refetch → UI update
```

### Key Rules

1. **READ → useQuery**, **WRITE → useMutation**.
2. Write pachhi hamesha `invalidateQueries` (kemke cache juno j rahe).
3. `queryKey` consistent rakho — ekthi j key har jagya.

---

## 5. TypeScript Essential Types

### Generics — TS No Core Concept

```ts
function identity<T>(value: T): T {
  return value;
}
```

`<T>` = "Kai type avse e pehla khabar nahi, caller decide kare." `useMutation`, `useQuery`, `useState`, `PayloadAction` — badha generics chhe.

### useMutation<TData, TError, TVariables>

```ts
useMutation<unknown, AxiosError, { username: string; formData: FormData }>({
  mutationFn: ({ username, formData }) => authServices.updateProfile(username, formData),
  ...
});
```

| Generic | Meaning | Aama che |
|---|---|---|
| `TData` | Mutation shu return kare | `unknown` (na use karta) |
| `TError` | Ketli rite fail thai | `AxiosError` (=> `onError` typed) |
| `TVariables` | `mutate()` no input | `{ username, formData }` |

### AxiosError — Kem Ane Kyare

**Problem:** Default `onError` na `error` no type `Error` che, ane `Error` ma `response` nathi. Tyare `error.response?.data?.message` likho to TS bhule:
`Property 'response' does not exist on type 'Error'`

**Fix:** Axios fail thay tyare e **`AxiosError`** throw kare (Error + `response`):

```ts
AxiosError {
  message: 'Request failed with status code 500',
  response: {
    status: 500,
    data: { message: 'Unable to update profile!' },  // server no response body
  },
}
```

**Generic:** `AxiosError<{ message?: string }>` — `response.data` ne type kari de.
Tamara server na badha errors ma `{ message }` aave, etle aa type correct chhe.

```ts
onError: (error) => {
  const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
  toast.error('Profile Update Failed.', { description: message || 'Something went wrong!' });
}
```

### SubmitHandler<T> (react-hook-form)

```ts
const onSubmit: SubmitHandler<RegisterFormData> = (data) => { ... };
// handleSubmit(onSubmit) — validate kare, phir typed data aapo
```

### PayloadAction<T> (Redux Toolkit)

```ts
setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
  state.user = action.payload.user;
}
```

Reducer na action na `payload` no type.

### interface vs type

```ts
interface User { name: string; role: string }     // object shapes
type Result = 'success' | 'error'                 // union / alias
```

### unknown vs any

- `any` = TS check j bandh (dangerous)
- `unknown` = "pata nahi" → use karva pehla narrow karvo pade (safe)

---

## 6. Redux Toolkit Basics

### Aa kyu? 

React Query = server data. Redux = **client/global state** (auth token, theme).

### createSlice

`Client/src/features/auth/authSlice.ts`

```ts
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => { state.user = null; state.token = null; ... },
  },
});
```

- `reducers` na functions = **actions** (`setCredentials`, `logout`)
- State **direct mutate** karo — Toolkit immutable update handle kari le che

### Selectors

```ts
export const selectCurrentUser = (state) => state.auth.user;

// Hook ma:
const token = useAppSelector((state) => state.auth.token);
```

### Dispatch

```ts
const dispatch = useAppDispatch();
dispatch(setCredentials({ user, token }));
```

---

## 7. HTTP & REST — Quick Recap

| Method | Use | Aama |
|---|---|---|
| GET | Manga (read) | `/users/me/profile` |
| POST | Navu banavo | `/auth/register` |
| PUT | Puru update | `/users/:username` |
| PATCH | Aadha update | (aama nahi) |
| DELETE | Delete | `/users/:username` |

Status codes:

- `200` OK, `201` Created, `400` Bad request, `401` Unauthenticated,
  `403` Forbidden, `404` Not found, `500` Server error

**REST naming:** resources = plural nouns, actions = HTTP methods.

---

## 8. JSON vs multipart/form-data

| | JSON | multipart/form-data |
|---|---|---|
| Content-Type | `application/json` | `multipart/form-data; boundary=...` |
| Files? | Nahi (binary na sakto) | Haan |
| Aama kya | Login, text-only API | Register, profile update (images) |

**Axios rule:** `data` FormData hase to JSON header bhuline multipart karine mokle.

---

## 9. Case Study: The Bugs We Fixed

Real bugs aape fix kari chhe — e badhu shikhavani cheez:

1. **`.js` ma TypeScript syntax**
   `Server/utils/uploadToCloudinary.js` ma `async (publicId: string)` — `.js` file ma `: string` invalid chhe → SyntaxError → server crash. Fix: type annotation kari.

2. **Missing `.js` extension in import**
   `registrationImageUpload.js` import karto `'../utils/uploadToCloudinary'` (bin extension) — Node ESM ma extension jaruri. Fix: `.js` add.

3. **`fs` imported j nahi**
   `fs.unlink` use thay to `fs` reference na hoto → ReferenceError. Fix: `import { unlink } from 'node:fs/promises'`.

4. **Copy-paste bug**
   Header unlink karva nathi, `avatarImage` no path delete thay-to (line ma). Fix: `req.files.headerImage[0].path`.

5. **Import bhuli gyu**
   `auth.controller.js` ma `deleteFromCloudinary` use thay to import nahi → ReferenceError. Fix: import add.

6. **Lowercase `string` in schema**
   `models/user.js` ma `type: string` — JS ma `string` variable na hoy → ReferenceError. Fix: `type: String` (mongoose built-in).

7. **Client files replace filenames bhejto**
   `RegistrationForm.tsx` ma `data.avatarImage[0].name` (filename!) moklatu, actual `File` nahi. Fix: `fd.append('avatarImage', file)`.

8. **Image shape mismatch**
   Server return kare `{ url, publicId }`, client string manti. Fix: `utils/imageUrl.ts` helper.

> **Debugging rule:** error message dhaan thi vacho — `at <file>:<line>` batave che kya nu problem chhe.

---

## 10. Practice Exercises

Khaali vaat vachi ne nathi — **kari ne shikhavu.** 2-3 exercises:

1. **Nayi field add karo:** User ma `favoriteQuote` (string) server model ma add karo,
   profile update ma send karo, FetchMe ma display karo. (DB → API → Client full loop)

2. **Profile refresh button:** `refetch()` use kari ne FetchMe ma "Refresh" button banao.

3. **Delete confirm:** Logout button par click karo to `window.confirm` puchhe.

4. **`queryKey` experiment:** `['user']` ne `['user', username]` kari ne dekho,
   cache kaise different hoy.

---

## 11. How to Become a Powerful Web Dev

1. **System samjo, moklu nahi.** File upload no 7-step flow samjya etle tu e cheez "maap kari" li chhe. Koyi new tech aave to e j flow draw karo.

2. **"Kem?" puchhta raho.** Tu aa j kari rahyo che. Badha great dev ne ek var "kem?" aavyu hato.

3. **Docs padho:** TanStack Query docs, MDN, React docs. Books karta live docs better.

4. **TypeScript ko no chhooto.** Types = compiler tu single hi pade che, tu raat no crash nahi.

5. **Small projects banao.** Aa project jevu ek loop (form → API → DB → display) badha apps ma chhe.

6. **Error no dushman nahi — teacher chhe.** Aape 8 bugs fix karya. Error jova to problem nipe ne solve karvana practice. Evuj ma web dev banse.

---

> **Note:** Aa guide project-specific chhe. Naya project ma paths, libs, structure change thai sake —
> pan concepts (FormData → multer → cloudinary, useQuery/useMutation, generics) universal chhe.
