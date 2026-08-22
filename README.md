<p align="center">
  <img src="https://raw.githubusercontent.com/omaku2006/the-courtyard-courses/main/.github/assets/hero.svg"
       alt="The Courtyard Courses — a Victorian academy e-learning platform with ornate lampposts and four curated themes"
       width="100%" />
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React_19-1f1e1c?style=flat-square&logo=react&logoColor=c9a86a" alt="React 19"></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-1f1e1c?style=flat-square&logo=vite&logoColor=c9a86a" alt="Vite"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-1f1e1c?style=flat-square&logo=typescript&logoColor=c9a86a" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_v4-1f1e1c?style=flat-square&logo=tailwindcss&logoColor=c9a86a" alt="Tailwind v4"></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express_5-1f1e1c?style=flat-square&logo=express&logoColor=c9a86a" alt="Express 5"></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-1f1e1c?style=flat-square&logo=mongodb&logoColor=c9a86a" alt="MongoDB"></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1f1e1c?style=flat-square&logo=bun&logoColor=c9a86a" alt="Bun"></a>
</p>

## What is this?

**The Courtyard Courses** is a full-stack e-learning platform dressed as a Victorian academy.
Teachers publish courses with chaptered video lessons; students enroll — free or through
Razorpay checkout — and work toward daily reading targets. Between lectures they gather in
course-gated communities, plan their study schedule, and watch their progress charted in a
personal analytics hall.

Everything runs on a hand-tuned design system: Cormorant serif typography, gilded borders,
lamplit courtyards — and **four curated themes** you can switch between from any page.

## Features

| | |
|---|---|
| **Courses** | Chapters & YouTube-hosted lessons, wishlist, reviews, free or paid enrollment via Razorpay |
| **Communities** | Create & join gatherings, public or gated by course ownership, per-community messaging permissions |
| **Schedule** | Set daily chapter targets per enrolled course and see today's plan at a glance |
| **Analysis** | Student progress charts and teacher course statistics dashboards |
| **Theming** | Four hand-tuned palettes — Light, Parchment, Lamplight, Midnight |
| **Roles** | JWT auth with distinct teacher / student experiences |
| **Motion** | Scroll-reveal choreography, animated gates, lamplight glows |

## Themes

Switch anytime from the palette button in the navbar or dashboard sidebar.

| Light | Parchment | Lamplight | Midnight |
|---|---|---|---|
| `#f5eddf` · `#c9a86a` | `#efefdf` · `#8b6b46` | `#1f1e1c` · `#8c7b63` | `#1c232b` · `#a9927d` |

## Tech Stack

| Layer | Tools |
|---|---|
| **Client** | React 19, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, TanStack Query, Motion, Phosphor Icons, react-hook-form, Sonner |
| **Server** | Express 5, Mongoose 9, JSON Web Tokens, bcrypt, Cloudinary, Razorpay, Multer |
| **Runtime** | Bun (server & scripts) |

## Run It Locally

> Requires [Bun](https://bun.sh) and a MongoDB instance.

```bash
git clone https://github.com/omaku2006/the-courtyard-courses.git
cd the-courtyard-courses
```

**1 — Server** (serves on `http://localhost:3000`)

```bash
cd Server
bun install
cp .env.example .env   # then fill in the values
bun run dev
```

**2 — Client** (runs on `http://localhost:5173`, proxies `/api` to port 3000)

```bash
cd Client
bun install
bun dev
```

## Project Structure

```
the-courtyard-courses/
├── Client/            # React SPA — pages, components, features, services
│   └── src/
│       ├── components/
│       ├── features/     # redux slices + query hooks per domain
│       ├── pages/
│       └── services/     # axios API layer
└── Server/            # Express API — controllers, models, routes, middleware
```

---

<p align="center">
  <a href="https://github.com/oil-oil/beautify-github-readme"><img src="https://raw.githubusercontent.com/oil-oil/beautify-github-readme/main/assets/readme/made-with-beautify.svg" width="300" alt="README made with beautify-github-readme"></a>
</p>
