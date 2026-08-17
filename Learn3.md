# The Courtyard Courses — Course Enrollment & Razorpay Payments (Learn3.md)

> Aa file Course **Enrollment + Razorpay Payment** nu full flow samjave chhe:
> **Free enroll** (turant) → **Paid enroll** (Razorpay order) → **Checkout** → **Payment verify**
> → **Secure enroll + Payment record**.
> Terminal ma read karva: `cat Learn3.md` (thodu nakki lage to `less -R Learn3.md`).

---

## Table of Contents

1. [Aa File Ma Shun Shikhashe](#1-aa-file-ma-shun-shikhashe)
2. [Razorpay Basics — 6 Points Javu Joiye](#2-razorpay-basics--6-points-javu-joiye)
3. [Server Setup — config/razorpay.js + .env](#3-server-setup--configrazorpayjs--env)
4. [Payment Model — orderId Nu Addition](#4-payment-model--orderid-nu-addition)
5. [The Big Picture — Full Flow](#5-the-big-picture--full-flow)
6. [completeEnrollment — Helper (Idempotent)](#6-completeenrollment--helper-idempotent)
7. [enrollCourse Controller — Free vs Paid](#7-enrollcourse-controller--free-vs-paid)
8. [The 8 Bugs We Fixed (Bahuj Important!)](#8-the-8-bugs-we-fixed-bahuj-important)
9. [verifyPayment Controller — 3-Layer Security](#9-verifypayment-controller--3-layer-security)
10. [Routes — isStudent Add Karyu](#10-routes--isstudent-add-karyu)
11. [Client — courseServices](#11-client--courseservices)
12. [useEnrollCourse Hook — Checkout Magic](#12-useenrollcourse-hook--checkout-magic)
13. [ViewCourse — Button Wiring](#13-viewcourse--button-wiring)
14. [Full Request Lifecycle (End-to-End)](#14-full-request-lifecycle-end-to-end)
15. [Testing — Curl Thi Verify Karo](#15-testing--curl-thi-verify-karo)
16. [Gotchas Cheat-Sheet](#16-gotchas-cheat-sheet)
17. [Practice Exercises](#17-practice-exercises)

---

## 1. Aa File Ma Shun Shikhashe

| Concept | Kya code ma chhe | Ek line ma |
|---|---|---|
| Razorpay SDK | `Server/config/razorpay.js` | key_id + key_secret thi client banavu |
| Orders API | `course.controller.js` (`enrollCourse`) | Paid course mate order banao (paise ma) |
| `validatePaymentVerification` | `course.controller.js` (`verifyPayment`) | Signature verify (payment forge nai thatu) |
| Payment record | `models/payment.js` | Darek enrollment nu { amount, orderId, transactionId } |
| Checkout script | `index.html` + `useCourse.ts` | Razorpay modal browser ma kholvu |
| React Query mutation chain | `useCourse.ts` (`useEnrollCourse`) | Order → Checkout → Verify |

---

## 2. Razorpay Basics — 6 Points Javu Joiye

Razorpay ek payment gateway chhe. Ena 6 fundamentals joiye — aa samjya vina kod jevu nathi:

### 2.1 Key ID + Key Secret (Credentials)

Dashboard (`dashboard.razorpay.com`) par thi test keys male chhe:

```
RAZORPAY_KEY_ID     = rzp_test_XXXXXXXXXXXXXX   # "public" — client par safe che
RAZORPAY_KEY_SECRET = 4bXXXXXXXXXXXXXXXXXXX     # "private" — server ma j rehvu joiye!
```

- **Key ID** client par jay (checkout ne kholva). `.env` ma che pan key secret jem secret **nathi**.
- **Key Secret** kabhi client par moklo nai — ena thi koi tamaru payment verify/refund kari shake.

### 2.2 Amount HAMESHA "Paise" Ma (₹ nai!)

Razorpay **amount = currency nu smallest unit** (paise) ma mangse:

| Tane ₹ javu che | Razorpay ne moklo | Code |
|---|---|---|
| ₹1499 | 149900 paise | `amount: course.price * 100` |
| ₹0 (free) | — | order banavo j nai |

> `amount: course.price` (₹1499) moklso to Razorpay **reject** karse — "amount must be in paise".

### 2.3 Currency String 'INR' — Quoted!

`currency: 'INR'` — **string** hovu joiye. Koi `currency: INR` (variable) lakhe to `ReferenceError: INR is not defined` → 500 error. (Aapde aa bug ma padiya — section 8.)

### 2.4 Orders API — Pay Pela Order Banao

Payment thi pehla server `orders.create` thi ek **order** banave:

```js
const order = await razorpay.orders.create({
  amount: course.price * 100,   // paise
  currency: 'INR',
  receipt: 'course_<id>_<timestamp>',
  notes: { courseId, studentId },
});
// order.id → "order_PxYb9bcY5Ixr6Q"
```

`order.id` client par moklvanu (checkout `order_id` tarike manges).

### 2.5 Checkout — Browser Modal

`checkout.razorpay.com/v1/checkout.js` load karo → `new Razorpay(options)` → `.open()` → modal khule.
Payment thay tyare Razorpay `handler` callback maa **3 cheez** aape:

```js
{
  razorpay_order_id: 'order_...',
  razorpay_payment_id: 'pay_...',
  razorpay_signature: 'Q2xvdWR...'   // HMAC signature
}
```

### 2.6 Signature Verification — "Payment Asli Che" Nu Proof

`razorpay_payment_id + order_id + your secret` → HMAC-SHA256 → `signature` aapde **server par** compute kari ne Razorpay ni mokli signature sathe sarakhiye. Match thay = payment asli che (tamara checkout ma thi j aavi). Match nai thay = koi ne **forged** karvanu → reject karo.

> Client na data par **kabhi vishwas nai** — verify hamesha server par secret thi.

---

## 3. Server Setup — config/razorpay.js + .env

### 3.1 Install Package

```sh
bun add razorpay
```

### 3.2 .env (Server)

```
RAZORPAY_KEY_ID=rzp_test_TPLi3NFHbSeKls
RAZORPAY_KEY_SECRET=4bXXXX...
```

Bun `.env` automatically load kare che (`dotenv` ni jaroor nathi).

### 3.3 config/razorpay.js

`Server/config/razorpay.js`:

```js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
```

Ek j instance (singleton) — badha controllers ma import thay.

---

## 4. Payment Model — orderId Nu Addition

`Server/models/payment.js` — **Payment schema** (pehla `orderId` na hati):

```js
const paymentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    orderId: { type: String, default: null },          // ← Aa ADD karyu (Razorpay order id)
    paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'paypal', 'free'], required: true },
    transactionId: { type: String, required: true, unique: true },  // pay_... athva FREE-...
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  },
  { timestamps: true }
);
```

`orderId` kyo? — Payment ne Razorpay order sathe link karva mate. Refund/audit maa `transactionId` (pay_id) + `orderId` bane hovu joiye.

---

## 5. The Big Picture — Full Flow

```
 [Student] ViewCourse par "Enroll" button
    │
    ▼
 enroll({ _id, title })                     [Client hook]
    │  POST /course/:courseId/enroll
    ▼
 enrollCourse [Server]
    ├── free?  → completeEnrollment + Payment(free)  → { enrolled: true }
    └── paid?  → razorpay.orders.create              → { orderId, amount, currency, keyId }
    │
    ▼
 [Browser] new Razorpay({ order_id, amount, key }) → rzp.open() → modal
    │
    ├── Payment cancel → ondismiss → toast "No amount was charged"
    │
    └── Payment success → handler(response)
          │  POST /course/payment/verify  { courseId, orderId, paymentId, signature }
          ▼
       verifyPayment [Server]
          │  1. signature verify (validatePaymentVerification)
          │  2. razorpay.orders.fetch  → status 'paid' + amount match
          │  3. completeEnrollment (idempotent)
          │  4. Payment.create (razorpay, amount, orderId, transactionId)
          ▼
       { enrolled: true, message: 'Enrolled successfully!' }
          │
          ▼
       toast "Welcome to the Course!" + cache invalidate → UI update
```

> **2-step dance:** Pehla order banao (payment NA karata), pachi checkout, pachi **verify** kari ne j enroll. Verify na karta enroll kabhi nai thatu — nahi to koi order_id fake mokli ne free ma course le jay.

---

## 6. completeEnrollment — Helper (Idempotent)

`Server/controllers/course.controller.js` — be controllers (free + verify) nu common kaam ek helper ma:

```js
const completeEnrollment = async (course, studentId) => {
  if (course.students.includes(studentId)) return { alreadyEnrolled: true };

  course.students.push(studentId);
  course.studentCount += 1;
  await course.save();

  await User.findByIdAndUpdate(studentId, { $addToSet: { courses: course._id } });

  await Enrollment.create({ student: studentId, course: course._id });

  return { alreadyEnrolled: false };
};
```

3 jagya update thay:
1. **Course** → `students` array + `studentCount`
2. **User** → `courses` array (`$addToSet` = duplicate na aave)
3. **Enrollment** collection → relation record

> **Idempotent:** Student pehla thi enrolled hoy to khali `{ alreadyEnrolled: true }` return — duplicate data nai banse.

---

## 7. enrollCourse Controller — Free vs Paid

```js
export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;          // verifyToken thi aavyo

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found!' });

  if (course.students.includes(studentId)) {
    return res.status(400).json({ message: 'Already enrolled!' });   // double-enroll roko
  }

  // ─── Free course → turant enroll ───
  if (!course.price || course.price <= 0) {
    await completeEnrollment(course, studentId);

    await Payment.create({
      user: studentId,
      course: courseId,
      amount: 0,
      paymentMethod: 'free',
      orderId: null,
      transactionId: `FREE-${Date.now()}-${studentId}`,
      status: 'completed',
    });

    return res.status(200).json({ enrolled: true, message: 'Enrolled successfully!' });
  }

  // ─── Paid course → Razorpay order banao ───
  const order = await razorpay.orders.create({
    amount: course.price * 100,           // paise!
    currency: 'INR',
    receipt: `course_${course._id}_${Date.now()}`,
    notes: { courseId: course._id.toString(), studentId: studentId.toString() },
  });

  return res.status(200).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,   // client checkout ne kholva
  });
};
```

Notes:
- `req.user.id` — `verifyToken` middleware JWT verify kari ne user set kare che.
- Free path `enrolled: true` mokle che → client janse "aa course free che, checkout nai khulvanu".
- Paid path maa **`enrolled` key nathi** — client e check karse `if (data.enrolled)` → nehi to checkout khole.

---

## 8. The 8 Bugs We Fixed (Bahuj Important!)

Aa feature ma aapde **8** alag problems fix kari — darek roj no bug che, samju to khub shikhashe:

| # | Bug | Problem | Fix |
|---|---|---|---|
| 1 | `currency: INR` | `INR` **undefined** che — `ReferenceError` → 500 | `currency: 'INR'` (string quotes) |
| 2 | `amount: course.price` | ₹1499 → Razorpay reject (paise joiye) | `amount: course.price * 100` |
| 3 | Free path ma `user.courses` push nai thatu | Student profile/dashboard ma course na dikhe | `User.findByIdAndUpdate(studentId, { $addToSet: { courses } })` |
| 4 | Payment record banatu j nathi | Audit/refund mate proof nathi | `Payment.create(...)` free + paid bane |
| 5 | `razorpay.order.create` (singular) | Method exist nathi → TypeError | `razorpay.orders.create` (`orders` collection, plural) |
| 6 | `razorpay.utils.validatePaymentVerification` | **v2.9.8 ma `utils` exist j nathi** → "undefined is not an object" | Named import: `import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils'` |
| 7 | `config/razorpay.js` ma TS syntax (`!`) JS file ma | `SyntaxError` → **module load fail** | `process.env.RAZORPAY_KEY_ID` (plain JS) |
| 8 | Razorpay install pachhi server **old code** chalto rehyo | `bun --hot` reload fail (module graph poiso) → tests old behavior batavta | Server full **restart** karo (`pkill bun; bun --hot app.js`) |

> **Bug #6 nu deep dive:** `razorpay` package ma `Razorpay` class `utils` **class instance par expose nathi karti** — utility functions alag path ma chhe:
>
> ```js
> import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
> ```
>
> Eto `razorpay.utils.validatePaymentVerification(...)` lakhso to runtime `undefined is not an object` thase — **compile time pan nai** (JS dynamic che) — etle run thay tyare j padvu. Import check karta j karo!

> **Bug #8 nu lesson:** Dependency install kariya pachhi koi pan server ma `bun --hot` par **bharoso na karo** — clean restart karvi joiye. Tamari terminal ma chalto server `ps aux | rg bun` thi joi ne `kill <pid>` karo.

---

## 9. verifyPayment Controller — 3-Layer Security

```js
export const verifyPayment = async (req, res) => {
  const { courseId, orderId, paymentId, signature } = req.body;
  const studentId = req.user.id;

  if (!courseId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ message: 'Missing payment details!' });
  }

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found!' });

  // ─── Layer 1: Signature verify (forgery roko) ───
  const valid = validatePaymentVerification(
    { order_id: orderId, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_KEY_SECRET
  );
  if (!valid) return res.status(400).json({ message: 'Payment verification failed!' });

  // ─── Layer 2: Order fetch kari amount/status confirm ───
  const order = await razorpay.orders.fetch(orderId);
  if (order.status !== 'paid') return res.status(400).json({ message: 'Payment not completed!' });
  if (order.amount !== course.price * 100) {
    return res.status(400).json({ message: 'Payment amount mismatch!' });
  }

  // ─── Layer 3: Enrollment complete (idempotent) ───
  const { alreadyEnrolled } = await completeEnrollment(course, studentId);

  await Payment.create({
    user: studentId,
    course: courseId,
    amount: course.price,
    paymentMethod: 'razorpay',
    orderId,
    transactionId: paymentId,     // pay_... id — unique che
    status: 'completed',
  });

  return res.status(200).json({
    enrolled: true,
    alreadyEnrolled,
    message: alreadyEnrolled ? 'Already enrolled!' : 'Enrolled successfully!',
  });
};
```

### Kem 3 layers? (Security thinking)

| Layer | Shun roke? |
|---|---|
| 1. Signature | Koi client par fake `orderId`/`paymentId` banavi ne mokle to signature match na thay → reject |
| 2. Order fetch + amount | Course price change thayu hoy / biju order moklyu hoy to amount mismatch → reject |
| 3. Idempotent enroll | Verify **be var** aave (retry) to duplicate student/payment nai banse |

> Signature **correct hoy tyare pan** order fetch karvu joiye — koi course price **₹100** hato tyare order banavyu ane pachhi price **₹500** karyu hoy to amount check e e order ne roki de.

---

## 10. Routes — isStudent Add Karyu

`Server/routes/course.router.js`:

```js
import { verifyToken, isTeacher, isStudent } from '../middleware/auth.middleware.js';

// Enrollment
courseRouter.post('/payment/verify', verifyToken, isStudent, verifyPayment);
courseRouter.post('/:courseId/enroll', verifyToken, isStudent, enrollCourse);
```

- `verifyToken` → JWT valid che ke nahi
- `isStudent` → user nu role **student** che ke nahi (teacher enroll na kari shake)
- `/payment/verify` route **`:courseId/enroll` ni pehla** lakhvu — kem ke express order ma match kare che.

---

## 11. Client — courseServices

`Client/src/services/courseServices.ts` — do nava methods:

```ts
enrollCourse: async (courseId: string) => {
  const res = await api.post(`/course/${courseId}/enroll`);
  return res.data;
},

verifyPayment: async (payload: {
  courseId: string; orderId: string; paymentId: string; signature: string;
}) => {
  const res = await api.post('/course/payment/verify', payload);
  return res.data;
},
```

Note: enroll/verify **POST** che — axios `api` instance ma auth token header automatically set thay che (interceptor).

---

## 12. useEnrollCourse Hook — Checkout Magic

`Client/src/features/course/useCourse.ts` — sab thi interesting part:

### 12.1 Checkout script load karo (dynamic)

```ts
const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if ((window as any).Razorpay) return resolve();   // already loaded → skip
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });
```

(`index.html` maa script tag pan add karyo che — double-safety: HTML maa + dynamic.)

### 12.2 Do mutations — order + verify

```ts
const createOrder = useMutation({
  mutationFn: (courseId: string) => courseServices.enrollCourse(courseId),
});
const verify = useMutation({
  mutationFn: (payload) => courseServices.verifyPayment(payload),
  onSuccess: () => {
    toast.success('Welcome to the Course!', { ... });
    queryClient.invalidateQueries({ queryKey: ['course'] });    // ViewCourse update
    queryClient.invalidateQueries({ queryKey: ['myCourses'] }); // dashboard
    queryClient.invalidateQueries({ queryKey: ['me'] });        // profile
  },
  onError: (error) => { toast.error('Enrollment Interrupted', { ... }); },
});
```

> `['course']` prefix invalidate karva thi `['course', slug]` (ViewCourse walu) bane invalidate thay che — TanStack Query prefix matching.

### 12.3 enroll() — free vs paid decision

```ts
const enroll = async (course: { _id: string; title: string }) => {
  try {
    const data = await createOrder.mutateAsync(course._id);

    // Free course → server turant enroll kari de che
    if (data.enrolled) {
      toast.success('Welcome to the Course!', { ... });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      // ...
      return;
    }

    // Paid course → Razorpay Checkout kholo
    await loadRazorpayScript();

    const rzp = new (window as any).Razorpay({
      key: data.keyId,
      amount: data.amount,          // paise ma — server mokle che
      currency: data.currency,
      order_id: data.orderId,
      name: 'The Courtyard Courses',
      description: course.title,
      handler: (response) => {
        verify.mutate({
          courseId: course._id,
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          toast.info('Payment Secluded', { description: 'No amount was charged...' });
        },
      },
      theme: { color: '#c9a86a' },
    });

    rzp.open();
  } catch (error) {
    toast.error('Enrollment Interrupted', { ... });
  }
};

return { enroll, isPending: createOrder.isPending || verify.isPending };
```

Key points:
- `data.enrolled` present = **free** (server already enrolled) → checkout skip.
- `data.keyId`, `data.amount`, `data.currency`, `data.orderId` **badhu server response ma thi** — client par `.env` key nathi, e security ma ek layer che.
- `handler` = payment success → `verify.mutate(...)` → server verify → enroll.
- `ondismiss` = user modal band kare → kahie chhe "charge nai thayu" (free user experience).
- `isPending` return karva thi button `disabled` thay che (double-click roko).

---

## 13. ViewCourse — Button Wiring

`Client/src/components/course/ViewCourse.tsx`:

```tsx
const { enroll, isPending: enrollPending } = useEnrollCourse();

const isTeacherOwner =
  typeof course?.creator === 'object' && !!course.creator?._id &&
  profile?.user?._id === course.creator._id;

const isEnrolled =
  !!profile?.user?._id && !!course?.students?.includes(profile.user._id);
```

Button (jo student che ane enrolled nathi tyare j dikhe):

```tsx
{!isTeacherOwner && !isEnrolled && (
  <div> {/* Enrollment Notice Board */}
    {profile?.user ? (
      <button
        type="button"
        onClick={() => enroll({ _id: course._id, title: course.title })}
        disabled={enrollPending}
        className="btnPrimary shrink-0 w-full md:w-auto disabled:pointer-events-none disabled:opacity-60"
      >
        {enrollPending ? 'Inscribing...' : course.price > 0 ? 'Enroll Now' : 'Enroll Free'}
      </button>
    ) : (
      <Link to="/login" ...>sign in</Link>  // login na hove to login ne mokle
    )}
  </div>
)}
```

3 conditions (logic tree):

| Condition | Kya thay |
|---|---|
| `isTeacherOwner` | Creator pota — enroll button **na dikhe** |
| `isEnrolled` | Enrolled che — button **na dikhe** (already leli) |
| `enrollPending` | In-flight — button **disabled** + "Inscribing..." |

---

## 14. Full Request Lifecycle (End-to-End)

### Free Course

```
[Student] "Enroll Free" click
   → enroll({ _id, title })
   → POST /course/:courseId/enroll
   → enrollCourse: price<=0 → completeEnrollment (course.students + user.courses + Enrollment)
                    → Payment.create(free, amount 0, orderId null, transactionId FREE-...)
   → { enrolled: true }
   → toast "Welcome to the Course!" + invalidate ['course'], ['myCourses'], ['me']
   → UI: button gayab (isEnrolled true)
```

### Paid Course (₹1499)

```
[Student] "Enroll Now" click
   → enroll({ _id, title })
   → POST /course/:courseId/enroll
   → enrollCourse: price>0 → razorpay.orders.create({ amount: 149900, currency: 'INR' })
   → { orderId: 'order_...', amount: 149900, currency: 'INR', keyId: 'rzp_test_...' }
   → loadRazorpayScript() → new Razorpay({ order_id, key: keyId }) → rzp.open()
   → [Razorpay modal] Student card info → Pay
   → handler({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
   → POST /course/payment/verify { courseId, orderId, paymentId, signature }
   → verifyPayment:
        1. validatePaymentVerification → OK
        2. orders.fetch → status 'paid' + amount 149900 match
        3. completeEnrollment + Payment.create(razorpay, amount 1499, orderId, transactionId=pay_id)
   → { enrolled: true, message: 'Enrolled successfully!' }
   → toast "Welcome to the Course!" + invalidate → UI update
```

---

## 15. Testing — Curl Thi Verify Karo

Server chalu che (`bun --hot app.js`) ane seed data che (password: `Courtyard123`):

```sh
# 1) Login → token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"emily.brooks@courtyard.dev","password":"Courtyard123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2) Free course → turant enrolled
curl -s -X POST http://localhost:3000/api/course/<FREE_COURSE_ID>/enroll \
  -H "Authorization: Bearer $TOKEN"
# → {"enrolled":true,"message":"Enrolled successfully!"}

# 3) Again → idempotent check
curl -s -X POST http://localhost:3000/api/course/<FREE_COURSE_ID>/enroll \
  -H "Authorization: Bearer $TOKEN"
# → {"message":"Already enrolled!"}

# 4) Paid course → Razorpay order
curl -s -X POST http://localhost:3000/api/course/<PAID_COURSE_ID>/enroll \
  -H "Authorization: Bearer $TOKEN"
# → {"orderId":"order_...","amount":149900,"currency":"INR","keyId":"rzp_test_..."}

# 5) Fake signature → reject (security check!)
curl -s -X POST http://localhost:3000/api/course/payment/verify \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"courseId":"<PAID_COURSE_ID>","orderId":"order_fake","paymentId":"pay_fake","signature":"fake"}'
# → {"message":"Payment verification failed!"}   [400]
```

> Real payment test browser ma j thay (Razorpay modal card details manges). Test mode maa **domestic test card** use karje (any future expiry / any CVV / naam koi pan):
>
> | Card | Type |
> |---|---|
> | `4111 1111 1111 1111` | Visa — **domestic** (official, pan US BIN che → account par "International Cards" OFF hoy to reject thay!) |
> | `5267 3181 8797 5449` | Mastercard — **domestic** |
> | `4718 6091 0820 4366` | Visa — **domestic** |
> | `4012 8888 8888 1881` | Visa — **international** |
> | `5555 5555 5555 4444` | Mastercard — **international** |
>
> **"International cards are not supported" aave to 2 option:**
> 1. Dashboard → Settings → Payments → **International Cards toggle ON** karo (pachhi badhi cards chalase).
> 2. Upvar na **domestic** cards maa thi ek use karo.
>
> **`4000 0000 0000 0002` na use karo** — e Stripe walu card che, Razorpay maa chalto j nathi.

---

## 16. Gotchas Cheat-Sheet

| Gotcha | Fix |
|---|---|
| `currency: INR` → ReferenceError | `currency: 'INR'` (string!) |
| Amount ₹1499 reject thay | `amount: course.price * 100` (paise) |
| Free enroll pachhi dashboard ma na dikhe | `User.findByIdAndUpdate(userId, { $addToSet: { courses } })` push karu |
| Payment record nathi banatu | Free + verify bane `Payment.create(...)` |
| `razorpay.order.create` TypeError | `razorpay.orders.create` (plural `orders`) |
| `razorpay.utils.validatePaymentVerification` undefined | `import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils'` |
| Razorpay package install pachhi server puranu code chalave | `pkill -f bun` pachi `bun --hot app.js` — clean restart |
| Client par key_secret | Kabhi nai! Khali key_id (`keyId`) moklo |
| Signature verify pan 500 aave | Check `process.env.RAZORPAY_KEY_SECRET` loaded che ke nahi (`.env` spelling) |
| Double enroll | Server: `students.includes` check + helper `alreadyEnrolled` |
| Verify retry → duplicate payment | `completeEnrollment` idempotent + `transactionId: paymentId` unique |
| Express route order | `/payment/verify` route `/:courseId/enroll` ni **pehla** lakho |
| Checkout modal na khule | `loadRazorpayScript()` — script load thai e sathe wait karo (`await`) |
| Button double-click | `isPending` → `disabled={enrollPending}` |

---

## 17. Practice Exercises

1. **Paise conversion likho** — ek function `toPaise(rs)` lakh: `toPaise(1499) === 149900`, `toPaise(0) === 0`. Edge cases: decimal (`100.5` → `10050`).

2. **Idempotency test karo** — free course par be var enroll karo (curl), verify: be var pan `studentCount` +1 j, ane `user.courses` maa duplicate nai.

3. **getEnrollInfo endpoint banao** — `GET /course/:courseId/enroll/status` → `{ isEnrolled, isTeacher, price }`. ViewCourse maa profile fetch na karta aathi use karo (aarju batave kem controller + hook + component kevi rite jode che).

4. **Manual capture scenario** — `razorpay.orders.fetch` par bharoso nai karta, `razorpay.payments.fetch(paymentId)` thi payment ni `status` (`captured`/`authorized`) check kari ne verify karo. (Razorpay ma capture_method manual hoy tyare order 'attempted' j rey che!)

5. **Real card test karo** — browser ma paid course par "Enroll Now" → Razorpay **domestic test card** `4111 1111 1111 1111` athva `5267 3181 8797 5449` (expiry future, CVV koi pan, naam koi pan) → Pay → mock page par OTP `1234` → payment → verify thay → `user.courses` + `course.students` + `Payment` record 3 jagya update thai e check karo (MongoDB Compass ma). (Note: `4111` US BIN che — account par "International Cards" OFF hoy to dashboard maa toggle ON karo athva `5267`/`4718` domestic card use karo.)

6. **Webhook banao (advance)** — Razorpay **webhook** (`payment.captured`) add karo: server-side payment confirm. Kyo? — Client browser band thai jay to `handler` kabhi na chale; webhook guaranteed delivery che. Notes: webhook secret verify (`validateWebhookSignature`), idempotent handle.

7. **Refund flow plan karo** — `Payment.transactionId` (pay_id) thi `razorpay.payments.refund()` call kaise thay e plan karo, user na `courses` maa thi remove + `studentCount--`.

---

> Sarsari: **Order pehla** (Razorpay paise ma order banave) → **checkout modal** (keyId server thi) → **payment success** → **verify** (signature + order fetch + amount — 3 layer) → **enroll** (course + user + enrollment + payment record — 4 jagya). Security ni lin: **client par kabhi vishwas nai, server par j verify**. Ane server restart na bhula — dependency add kari pachhi `bun --hot` par bharoso na karo!
