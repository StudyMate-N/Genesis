# Veritas Academy — Codebase Explanation

## What Is This Project?

Veritas Academy is an **AI-powered adaptive learning platform** built as a full-stack TypeScript application. Students enroll in exam preparation courses, study through interactive flashcards, take quizzes, and track their progress through a gamified experience with XP, levels, streaks, and achievements. Administrators manage all content and users through a dedicated admin panel.

---

## Tech Stack Overview

| Layer        | Technology                                                       |
| ------------ | ---------------------------------------------------------------- |
| **Frontend** | React 19 + TypeScript, Vite, Wouter (routing), TailwindCSS      |
| **API**      | tRPC 11 (end-to-end type-safe RPC over HTTP)                     |
| **Backend**  | Node.js + Express                                                |
| **Database** | MySQL via Drizzle ORM                                            |
| **Auth**     | OAuth + JWT sessions (cookie-based)                              |
| **UI**       | shadcn/ui (Radix primitives), Framer Motion, Recharts            |
| **Storage**  | AWS S3 (images/files)                                            |
| **AI**       | LLM integration (chat tutor), image generation, voice transcription |
| **Build**    | Vite (frontend) + esbuild (backend)                              |
| **Testing**  | Vitest                                                           |

---

## Project Structure

```
Genesis/
├── client/                     # React frontend
│   ├── src/
│   │   ├── main.tsx            # App bootstrap: tRPC client, React Query, auth redirect
│   │   ├── App.tsx             # Top-level router and providers
│   │   ├── pages/              # One file per route (10 pages)
│   │   ├── components/         # Reusable components + shadcn/ui library
│   │   │   └── ui/             # 50+ Radix-based UI primitives
│   │   ├── _core/hooks/        # Custom hooks (useAuth, etc.)
│   │   ├── contexts/           # React contexts (Theme, Auth)
│   │   ├── lib/                # Utilities (tRPC client instance, helpers)
│   │   └── hooks/              # Additional custom hooks
│   └── index.html              # HTML shell
│
├── server/                     # Node.js backend
│   ├── _core/
│   │   ├── index.ts            # Express server entry point
│   │   ├── trpc.ts             # tRPC initialization + procedure definitions
│   │   ├── context.ts          # Request context (auth extraction)
│   │   ├── oauth.ts            # OAuth callback handling
│   │   ├── cookies.ts          # Session cookie config
│   │   ├── env.ts              # Environment variable access
│   │   ├── sdk.ts              # External SDK integration
│   │   ├── llm.ts              # AI/LLM service
│   │   ├── imageGeneration.ts  # Image generation service
│   │   ├── voiceTranscription.ts # Speech-to-text
│   │   ├── map.ts              # Google Maps integration
│   │   ├── vite.ts             # Dev-mode Vite middleware
│   │   └── systemRouter.ts     # Health check endpoints
│   ├── routers.ts              # All tRPC route definitions (the API surface)
│   ├── db.ts                   # All database queries (Drizzle ORM)
│   └── storage.ts              # S3 file operations
│
├── shared/                     # Code shared between client & server
│   ├── const.ts                # Constants (cookie name, error messages)
│   ├── types.ts                # Shared TypeScript types
│   └── _core/errors.ts         # Error definitions
│
├── drizzle/                    # Database layer
│   ├── schema.ts               # Full data model (17 tables)
│   └── migrations/             # SQL migration files
│
├── package.json                # Scripts, dependencies
├── tsconfig.json               # TypeScript config (strict mode, path aliases)
├── vite.config.ts              # Vite build config with path aliases
├── vitest.config.ts            # Test runner config
└── drizzle.config.ts           # Drizzle ORM / migration config
```

---

## How the Application Starts

### Development (`pnpm dev`)

1. `tsx watch server/_core/index.ts` starts the Express server with hot-reload.
2. The server calls `setupVite(app, server)` which creates a Vite dev server as middleware — this handles React HMR and serves the frontend on the same port.
3. tRPC API is mounted at `/api/trpc`.
4. OAuth routes are registered at `/api/oauth/callback`.
5. The server finds an available port starting from 3000.

### Production (`pnpm build && pnpm start`)

1. **Frontend**: Vite builds the React app into `dist/public/`.
2. **Backend**: esbuild bundles `server/_core/index.ts` into `dist/index.js` (ESM).
3. `node dist/index.js` serves static files from `dist/public/` and the tRPC API.

---

## Frontend Architecture

### Entry Point (`client/src/main.tsx`)

Sets up the React app with three layers:
- **tRPC Provider** — wraps the app with a configured tRPC client that uses `httpBatchLink` to batch API calls to `/api/trpc`
- **React Query Provider** — manages server state caching, with global error handlers that redirect to login on `UNAUTHORIZED` errors
- **App component** — renders the router

### Routing (`client/src/App.tsx`)

Uses [Wouter](https://github.com/molefrog/wouter) (a lightweight router). All routes:

| Route                    | Page              | Description                        |
| ------------------------ | ----------------- | ---------------------------------- |
| `/`                      | Home              | Landing page with hero, features, pricing |
| `/dashboard`             | Dashboard         | Student hub: stats, streak, study plan |
| `/courses`               | Courses           | Browse all published courses       |
| `/courses/:id`           | CourseDetail       | Course info + module list          |
| `/flashcards/:moduleId`  | FlashcardsPage    | Interactive flip-card study        |
| `/quiz/:moduleId`        | QuizPage          | Timed multiple-choice quiz         |
| `/study-plans`           | StudyPlanPage     | View/create personalized schedules |
| `/achievements`          | AchievementsPage  | Badge gallery                      |
| `/quiz-results`          | QuizResultsPage   | Quiz history and scores            |
| `/admin`                 | AdminPanel        | Content & user management (admin only) |

### Providers

The app wraps all routes in:
- `ErrorBoundary` — catches React rendering errors
- `ThemeProvider` — light/dark theme support
- `TooltipProvider` — Radix tooltip context
- `Toaster` — toast notifications via Sonner

### Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

---

## Backend Architecture

### Server Setup (`server/_core/index.ts`)

A standard Express server with:
- JSON body parsing (50MB limit for file uploads)
- OAuth routes registered via `registerOAuthRoutes(app)`
- tRPC middleware at `/api/trpc`
- Port auto-detection (tries port 3000, falls back to next available)

### Authentication Flow

1. **OAuth**: Users authenticate via an external OAuth provider. The callback at `/api/oauth/callback` exchanges the auth code for a JWT.
2. **JWT Session**: A signed JWT is stored in a cookie named `app_session_id`.
3. **Request Context** (`server/_core/context.ts`): Every tRPC request extracts the user from the cookie via `sdk.authenticateRequest()`. If auth fails, `user` is `null`.
4. **Procedure Guards** (`server/_core/trpc.ts`):
   - `publicProcedure` — no auth required, `ctx.user` may be null
   - `protectedProcedure` — requires a logged-in user, throws `UNAUTHORIZED` otherwise
   - `adminProcedure` — requires `user.role === 'admin'`, throws `FORBIDDEN` otherwise

### tRPC API Surface (`server/routers.ts`)

All API endpoints are defined in a single router file. The router is organized into namespaces:

```
auth.me              — Get current user (or null)
auth.logout          — Clear session cookie

courses.list         — All published courses
courses.getById      — Course + its modules
courses.getModules   — Modules for a course

modules.getById      — Single module details

enrollments.enroll          — Enroll in a course (+ grants "first_course" achievement)
enrollments.myEnrollments   — User's enrolled courses
enrollments.isEnrolled      — Check enrollment status
enrollments.getProgress     — Module progress for a course

flashcards.getByModule      — Flashcards for a module
flashcards.getProgress      — User's flashcard mastery status
flashcards.updateProgress   — Mark card as new/learning/mastered (+ XP)

quizzes.getQuestions    — Questions (correctIndex stripped for security)
quizzes.submit          — Grade answers, award XP, grant achievements
quizzes.myResults       — All quiz results
quizzes.resultsByModule — Results for a specific module

gamification.xpInfo          — Total XP, level, progress to next level
gamification.streak          — Current/longest streak
gamification.achievements    — All + user-earned achievements
gamification.recentXp        — Recent XP transactions
gamification.dashboardStats  — Aggregate stats (enrolled, completed, etc.)

studyPlans.myPlans      — User's study plans
studyPlans.getById      — Plan with items
studyPlans.create       — Create a new study plan
studyPlans.toggleItem   — Mark item complete/incomplete

progress.complete           — Mark module complete (+ XP)
progress.getCourseProgress  — Module progress for a course

admin.users.list           — All users
admin.courses.list/create/update/delete
admin.modules.list/create/update/delete
admin.orders.list/update
```

### Database Layer (`server/db.ts`)

All database operations use Drizzle ORM with MySQL. The `getDb()` function lazily initializes a connection from `DATABASE_URL`. Key patterns:
- **Lazy connection**: Database connects on first use, gracefully handles missing config
- **Upsert pattern**: `upsertUser()` uses `onDuplicateKeyUpdate` for idempotent user creation
- **XP system**: `addXp()` atomically updates both the `xp_transactions` log and the user's `totalXp`/`level` in a single query using `sql` template literals
- **Streak calculation**: `updateStreak()` compares calendar days to determine if a streak continues, resets, or is already logged for today
- **Achievement grants**: `grantAchievement()` is idempotent — checks for existing awards before inserting

---

## Database Schema (`drizzle/schema.ts`)

17 MySQL tables modeled with Drizzle ORM:

### Core Entities
- **users** — Account data: `openId` (OAuth identifier), `name`, `email`, `role` (user/admin), `totalXp`, `level`
- **profiles** — Extended info: `firstName`, `lastName`, `school`, `avatarUrl`, `bio`
- **courses** — Learning content: `code` (unique), `name`, `description`, `difficulty` (beginner/intermediate/advanced), `estimatedHours`, `isPublished`
- **modules** — Course subdivisions: `courseId`, `title`, `type` (study_guide/flashcard_set/quiz), `content` (JSON), `xpReward`

### Learning Content
- **flashcards** — Q&A pairs: `moduleId`, `front`, `back`, `orderIndex`
- **quizQuestions** — Multiple choice: `moduleId`, `question`, `options` (JSON array), `correctIndex`, `explanation`

### User Progress
- **enrollments** — Course registration: `userId`, `courseId`, `enrolledAt`, `completedAt`
- **moduleProgress** — Per-module completion: `userId`, `moduleId`, `courseId`, `completed`, `xpEarned`
- **flashcardProgress** — Spaced repetition: `userId`, `flashcardId`, `status` (new/learning/mastered), `reviewCount`
- **quizResults** — Quiz attempts: `userId`, `moduleId`, `score`, `totalQuestions`, `xpEarned`, `answers` (JSON)

### Gamification
- **streaks** — Activity tracking: `userId`, `currentStreak`, `longestStreak`, `lastActivityDate`
- **achievements** — Badge definitions: `code`, `name`, `icon`, `xpReward`, `category`
- **userAchievements** — Earned badges: `userId`, `achievementId`, `earnedAt`
- **xpTransactions** — XP audit log: `userId`, `amount`, `source` (quiz/flashcard/module/achievement/streak), `description`

### Study Planning
- **studyPlans** — Schedule: `userId`, `courseId`, `title`, `startDate`, `endDate`, `status` (active/completed/archived)
- **studyPlanItems** — Individual items: `studyPlanId`, `moduleId`, `scheduledDate`, `completed`

### Commerce
- **orders** — Subscriptions: `studentName`, `studentEmail`, `courseName`, `plan` (free/pro/premium), `amount`, `status`

---

## Gamification System

The gamification engine is one of the most interconnected parts of the codebase. Here's how it works:

### XP (Experience Points)
- Earned from: quizzes (up to 75 XP based on score), flashcards (5 XP for learning, 10 XP for mastered), module completion (configurable `xpReward`, default 50), and achievements
- Stored: Both as individual transactions in `xp_transactions` (for history/audit) and as a running total in `users.totalXp`
- **Level formula**: `FLOOR(totalXp / 500) + 1` — every 500 XP advances one level

### Streaks
- Updated on every learning activity (flashcard review, quiz submission, enrollment, study plan item)
- Logic: If `lastActivityDate` is yesterday → increment streak. If today → skip. Otherwise → reset to 1.
- Tracks both `currentStreak` and all-time `longestStreak`

### Achievements
- Defined in the `achievements` table with a unique `code`
- Granted idempotently (won't double-award)
- Currently triggered by: first course enrollment (`first_course`), first flashcard review (`first_flashcard`), first quiz (`first_quiz`), perfect quiz score (`perfect_quiz`)
- Each achievement can award bonus XP

---

## Key Data Flows

### Student Takes a Quiz

1. **Frontend** (`QuizPage`) fetches questions via `quizzes.getQuestions` — the server strips `correctIndex` to prevent cheating
2. Student answers questions with a per-question timer
3. On submit, `quizzes.submit` is called with all answers
4. **Server** scores answers against the stored `correctIndex`, calculates XP (proportional to score)
5. Results are saved to `quiz_results`, XP is added via `addXp()`, module is marked complete
6. Achievements are checked (`first_quiz`, `perfect_quiz`), streak is updated
7. Response includes per-question feedback with explanations

### Student Studies Flashcards

1. **Frontend** (`FlashcardsPage`) loads cards via `flashcards.getByModule` and progress via `flashcards.getProgress`
2. Cards display with a flip animation (front → back)
3. Student marks each card as learning/mastered via `flashcards.updateProgress`
4. **Server** upserts progress, awards XP (5 for learning, 10 for mastered), checks achievements, updates streak

### Authentication

1. User clicks login → redirected to OAuth provider
2. Provider redirects back to `/api/oauth/callback` with auth code
3. Server exchanges code for user info, upserts user in DB, signs a JWT
4. JWT stored in `app_session_id` cookie (HTTP-only, secure)
5. Every subsequent tRPC call extracts user from cookie via `createContext()`
6. Frontend's global error handler detects `UNAUTHORIZED` responses and redirects to login

---

## Development Commands

```bash
pnpm dev          # Start dev server (Express + Vite HMR on same port)
pnpm build        # Build frontend (Vite → dist/public) + backend (esbuild → dist/index.js)
pnpm start        # Run production server
pnpm check        # TypeScript type checking (no emit)
pnpm format       # Format code with Prettier
pnpm test         # Run tests with Vitest
pnpm db:push      # Generate and apply database migrations
```

---

## Configuration Files

| File              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `tsconfig.json`   | TypeScript strict mode, path aliases (`@/`, `@shared/`), bundler module resolution |
| `vite.config.ts`  | React plugin, TailwindCSS, path aliases, debug log collector |
| `vitest.config.ts`| Test runner configuration                                  |
| `drizzle.config.ts`| Database connection and migration output directory        |
| `.prettierrc`     | Code formatting rules                                      |

---

## Architectural Decisions

1. **tRPC over REST**: Provides end-to-end type safety — changing a server procedure's input/output schema immediately surfaces TypeScript errors on the client. No API contracts to maintain manually.

2. **Single-port dev server**: Vite runs as Express middleware in development, avoiding CORS issues and simplifying the setup. In production, the built static files are served by the same Express instance.

3. **Drizzle ORM**: Chosen for its lightweight, SQL-close approach. Queries read almost like raw SQL but with full TypeScript inference. No heavyweight migrations or entity decorators.

4. **shadcn/ui pattern**: UI components live in the project (`components/ui/`) rather than being imported from a package. This gives full control over styling and behavior while maintaining a consistent design system built on Radix primitives.

5. **Cookie-based JWT auth**: Simpler than token-in-header patterns for a web app — cookies are sent automatically, work with SSR, and can be HTTP-only for security.

6. **Shared code directory**: The `shared/` folder contains constants and types used by both client and server, ensuring consistency without duplication.
