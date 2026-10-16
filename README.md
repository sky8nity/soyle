# Soyle — AI Speech Therapy App

Soyle is an AI-powered speech therapy application designed for children with autism spectrum disorder (ASD). It combines computer vision-based articulation feedback, gamified exercises, and structured lessons to make speech therapy engaging, consistent, and measurable.

The name **Soyle** (Сөйле) means *"speak"* in Kazakh, reflecting the app's mission and language roots.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| TypeScript | 5.2 | Type safety |
| Vite | 5.0 | Build tool & dev server |
| Tailwind CSS | 3.3 | Utility-first styling |
| React Router | 6.20 | Client-side routing |

---

## Prerequisites

- Node.js **18+**
- npm **9+** (bundled with Node.js 18)

---

## Installation & Setup

```bash
# Clone the repository
git clone <repo-url>

# Enter project directory
cd soyle

# Install dependencies
npm install
```

---

## Running the App

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Building for Production

```bash
# Type-check and build
npm run build

# Preview the production build locally
npm run preview
```

Output is placed in the `dist/` directory.

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Dashboard | Welcome screen, today's exercises, weekly chart, category progress |
| `/exercises` | Exercises | Searchable, filterable grid of all exercises |
| `/exercises/:id` | Exercise Player | Camera view, step-by-step instructions, AI feedback, score |
| `/progress` | Progress | Stats, bar charts, category progress bars, recent sessions table |
| `/lessons` | Lessons | Therapist-created lesson cards, filterable by category |
| `/lessons/:id` | Lesson Detail | Embedded video player for a single lesson |
| `/profile` | Profile | User info, achievements, skill progress, settings toggles |

---

## Components

| Component | Location | Description |
|---|---|---|
| `Layout` | `components/Layout` | Wraps Navbar + Outlet for all routes |
| `Navbar` | `components/Navbar` | Sticky top nav with logo, links, streak counter, avatar |
| `ExerciseCard` | `components/ExerciseCard` | Clickable card showing exercise icon, title, badges |
| `LessonCard` | `components/LessonCard` | Color-topped card showing lesson title, therapist, duration |
| `ProgressBar` | `components/ProgressBar` | Labeled progress bar with configurable fill color |
| `Badge` | `components/Badge` | Difficulty pill: easy (green), medium (yellow), hard (red) |
| `VideoCapture` | `components/VideoCapture` | Live camera view with real-time MediaPipe lip/mouth landmark overlay |

---

## Mock Data

All data lives in `src/data/mockData.ts`. The exported objects are:

| Export | Type | Description |
|---|---|---|
| `exercises` | `Exercise[]` | 10 exercises across vowels, consonants, words, sentences |
| `lessons` | `Lesson[]` | 5 therapist-authored lessons |
| `recentSessions` | `Session[]` | 5 completed practice sessions with scores |
| `weeklyStats` | `WeeklyStat[]` | 7-day session count + average score data |
| `userProfile` | `UserProfile` | Child profile: name, age, level, streak, avatar |
| `categoryProgress` | `object[]` | Progress percentage per speech category |

---

## Project Structure

```
soyle/
├── index.html                    # Vite entry HTML
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config (strict, ES2020, bundler)
├── tsconfig.node.json            # TypeScript config for vite.config.ts
├── vite.config.ts                # Vite + React plugin setup
├── tailwind.config.js            # Tailwind content paths + custom colors
├── postcss.config.js             # PostCSS: tailwindcss + autoprefixer
└── src/
    ├── main.tsx                  # React DOM root mount
    ├── App.tsx                   # BrowserRouter + Route tree
    ├── index.css                 # Tailwind directives + base styles
    ├── types/
    │   └── index.ts              # Shared TypeScript interfaces & types
    ├── data/
    │   └── mockData.ts           # All mock data (exercises, lessons, sessions)
    ├── components/
    │   ├── Layout/index.tsx      # App shell with Navbar
    │   ├── Navbar/index.tsx      # Top navigation bar
    │   ├── ExerciseCard/index.tsx
    │   ├── LessonCard/index.tsx
    │   ├── ProgressBar/index.tsx
    │   ├── Badge/index.tsx
    │   └── VideoCapture/index.tsx
    └── pages/
        ├── Dashboard.tsx         # Home screen
        ├── Exercises.tsx         # Exercise browser
        ├── ExercisePlayer.tsx    # Active exercise session
        ├── Progress.tsx          # Analytics & history
        ├── Lessons.tsx           # Lesson library
        └── Profile.tsx           # User profile & settings
```

---

## Key Design Decisions

- **No external chart libraries** — all bar charts are built with CSS `div` elements whose heights are calculated proportionally from data, keeping the bundle small.
- **Real in-browser AI tracking** — `useFaceTracking` (`src/hooks/useFaceTracking.ts`) opens the camera via `getUserMedia` and runs MediaPipe's `FaceLandmarker` (`@mediapipe/tasks-vision`) fully client-side, no backend calls. It tracks mouth-opening and lip-stretch ratios in real time; true tongue-tip position can't be seen through the teeth/cheeks on any webcam, so scoring is honestly framed as mouth & jaw tracking, not tongue tracking.
- **Live session recording** — `ExercisePlayer` records the camera feed with `MediaRecorder` during each exercise and plays it back afterward so the child/parent/therapist can review the session.
- **Exercise scoring** — `ExercisePlayer` samples the live face metrics for the whole session and scores based on the fraction of time spent inside a per-category target range (heuristic, hand-tuned — not clinically calibrated), replacing the old random score.
- **Embedded video lessons** — `/lessons/:id` (`LessonDetail`) plays a lesson's `videoUrl` in a real `<video>` element; lessons without a `videoUrl` set yet show a "coming soon" state.
- **Tailwind-only styling** — no CSS modules or styled-components; all styles are utility classes for consistency and rapid iteration.
