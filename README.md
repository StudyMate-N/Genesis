# Veritas Academy

> **"Unlocking Your True Potential"**

Veritas Academy is a world-class, gamified exam preparation platform built for serious students. It combines adaptive learning, interactive flashcards, AI-powered quizzes, and a deep gamification system to make exam prep engaging and effective.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Brand Identity](#brand-identity)

---

## Features

### Phase 1 MVP (Complete)

| Feature | Status |
|---|---|
| Landing page with Veritas branding | ✅ |
| OAuth authentication (JWT session cookies) | ✅ |
| Student dashboard with XP, streaks, levels | ✅ |
| Interactive flashcards with flip animation & spaced repetition | ✅ |
| Interactive quizzes with timer, scoring, XP rewards | ✅ |
| Course catalog with enrollment | ✅ |
| Study plan viewer with progress tracking | ✅ |
| Achievements & badges system | ✅ |
| Quiz results history | ✅ |
| Admin panel (CRUD for courses, modules, users, orders) | ✅ |
| Full gamification backend (XP, levels, streaks, achievements) | ✅ |

### Phase 2 — AI Personalization (Planned)

- Adaptive learning engine
- Smart AI-powered study plan generator
- Performance analytics dashboard
- Leaderboards

### Phase 3 — Advanced AI (Planned)

- Magic Notes (upload materials → AI generates flashcards & quizzes)
- Veritas AI Tutor chatbot
- AI-driven mock exams
- Mind map creator

### Phase 4 — Monetization (Planned)

- Payment integration (Paystack + Flutterwave)
- Subscription tiers: Free, Pro, Premium
- Collaborative study spaces
- Community forums

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS v4 |
| Routing | Wouter |
| UI Components | Radix UI + shadcn/ui |
| State & Data Fetching | TanStack Query + tRPC |
| Backend | Node.js, Express |
| API Layer | tRPC v11 |
| Database ORM | Drizzle ORM |
| Database | MySQL (production) |
| Auth | OAuth via SDK + JWT session cookies (jose) |
| Testing | Vitest |
| Package Manager | pnpm |

---

## Project Structure

```
Genesis/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── _core/           # Core hooks (useAuth, tRPC client)
│   │   ├── components/      # Shared UI components
│   │   │   └── ui/          # shadcn/ui primitives
│   │   ├── contexts/        # React contexts (ThemeContext)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Route-level page components
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Dashboard.tsx        # Student dashboard
│   │   │   ├── Courses.tsx          # Course catalog
│   │   │   ├── CourseDetail.tsx     # Course + module listing
│   │   │   ├── FlashcardsPage.tsx   # Interactive flashcards
│   │   │   ├── QuizPage.tsx         # Quiz experience
│   │   │   ├── QuizResultsPage.tsx  # Quiz history
│   │   │   ├── StudyPlanPage.tsx    # Study plans
│   │   │   ├── AchievementsPage.tsx # Badges & achievements
│   │   │   └── AdminPanel.tsx       # Admin CRUD panel
│   │   ├── App.tsx          # Root app + router
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   └── index.html
├── server/                  # Express backend
│   ├── _core/
│   │   ├── index.ts         # Server entry point
│   │   ├── oauth.ts         # OAuth callback handler
│   │   ├── context.ts       # tRPC context (auth, req, res)
│   │   ├── trpc.ts          # tRPC instance + middleware
│   │   ├── cookies.ts       # Session cookie helpers
│   │   ├── llm.ts           # LLM integration helpers
│   │   └── systemRouter.ts  # System/health routes
│   ├── db.ts                # All database queries (Drizzle)
│   ├── routers.ts           # tRPC appRouter (all procedures)
│   ├── storage.ts           # File/S3 storage helpers
│   ├── veritas.test.ts      # Integration tests
│   └── auth.logout.test.ts  # Auth unit tests
├── shared/                  # Code shared between client & server
│   ├── _core/               # Shared core utilities
│   ├── const.ts             # Shared constants (cookie name, etc.)
│   └── types.ts             # Shared TypeScript types
├── drizzle/                 # Database
│   ├── schema.ts            # Database schema (all tables)
│   ├── relations.ts         # Drizzle relations
│   ├── migrations/          # Migration files
│   └── *.sql                # Generated SQL migrations
├── drizzle.config.ts        # Drizzle Kit config
├── vite.config.ts           # Vite config (aliases, plugins)
├── vitest.config.ts         # Test config
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MySQL database

### 1. Clone the repository

```bash
git clone https://github.com/StudyMate-N/Genesis.git
cd Genesis
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

### 4. Push the database schema

```bash
pnpm db:push
```

This generates and applies all Drizzle migrations to your MySQL database.

### 5. Start the development server

```bash
pnpm dev
```

The app runs on `http://localhost:3000` by default. The server auto-discovers an available port if 3000 is busy.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | MySQL connection string (`mysql://user:pass@host:3306/dbname`) | Yes |
| `PORT` | Server port (default: `3000`) | No |
| `NODE_ENV` | `development` or `production` | No |

Create a `.env` file in the project root:

```env
DATABASE_URL=mysql://root:password@localhost:3306/veritas_academy
PORT=3000
NODE_ENV=development
```

> **Note:** `.env` is git-ignored. Never commit secrets.

---

## Database

### Schema Overview

| Table | Description |
|---|---|
| `users` | Registered users (openId, name, email, role, totalXp, level) |
| `profiles` | Extended profile info (firstName, lastName, school, avatarUrl, bio) |
| `courses` | Course catalog (code, name, description, difficulty, estimatedHours) |
| `modules` | Course modules (study_guide, flashcard_set, quiz types) |
| `flashcards` | Flashcard front/back content per module |
| `flashcard_progress` | Per-user flashcard status (new, learning, mastered) |
| `quiz_questions` | Questions with options, correctIndex, explanation |
| `quiz_results` | User quiz attempt history (score, xpEarned, answers) |
| `enrollments` | User-course enrollment records |
| `module_progress` | Per-user module completion tracking |
| `study_plans` | Personalized study plans with date range |
| `study_plan_items` | Individual scheduled modules within a plan |
| `streaks` | Daily study streak tracking per user |
| `achievements` | Achievement definitions (code, name, icon, xpReward) |
| `user_achievements` | Which achievements each user has earned |
| `xp_transactions` | Full XP audit log (source, amount, description) |
| `orders` | Payment/subscription order records |

### Running Migrations

```bash
# Generate + apply migrations
pnpm db:push
```

### Roles

| Role | Access |
|---|---|
| `user` | Student — all learning features |
| `admin` | Admin panel + all student features |

To promote a user to admin, update the `role` column in the `users` table directly.

---

## Running Tests

```bash
pnpm test
```

Tests use Vitest and include:
- Auth router unit tests (`server/auth.logout.test.ts`)
- Full integration tests for all major tRPC procedures (`server/veritas.test.ts`)

Tests run against mock contexts (no real database required).

---

## Deployment

### Build for production

```bash
pnpm build
```

This produces:
- `dist/public/` — compiled React frontend (served as static files)
- `dist/index.js` — compiled Express server

### Start the production server

```bash
pnpm start
```

### Recommended: Deploy to Railway or Render

1. Connect your GitHub repository
2. Set `DATABASE_URL` to your production MySQL connection string
3. Set `NODE_ENV=production`
4. Set build command: `pnpm install && pnpm build && pnpm db:push`
5. Set start command: `pnpm start`

### Alternative: Deploy to Vercel

> Note: Vercel works best for Next.js. For this Express-based stack, Railway, Render, or Fly.io are preferred. If Vercel is required, configure it as a serverless function with a custom `vercel.json`.

---

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full phase plan.

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Core MVP — auth, courses, flashcards, quizzes, gamification | ✅ Complete |
| Phase 2 | AI personalization, adaptive learning, analytics | Planned |
| Phase 3 | Magic Notes, AI Tutor, mock exams, mind maps | Planned |
| Phase 4 | Payments (Paystack/Flutterwave), subscriptions, community | Planned |
| Phase 5 | Production launch, monitoring, scale | Planned |

---

## Brand Identity

| Element | Value |
|---|---|
| Name | Veritas Academy |
| Tagline | "Unlocking Your True Potential" |
| Navy Blue | `#001F3F` |
| Gold | `#FFD700` |
| Light Gray | `#F0F0F0` |
| White | `#FFFFFF` |
| Tone | Prestigious, modern, industry-changing |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, branching strategy, and code standards.

---

## License

MIT — See LICENSE for details.
