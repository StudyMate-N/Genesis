# Architecture — Veritas Academy

This document describes the technical architecture of the Veritas Academy platform.

---

## Overview

Veritas Academy is a **full-stack TypeScript monorepo** consisting of:

- A **React SPA** (client) served by Vite in development, or as static files in production
- An **Express HTTP server** (server) that serves both the API and the frontend
- A **shared** package for types and constants used by both client and server
- A **MySQL database** accessed via Drizzle ORM

All API communication between client and server goes through **tRPC**, giving end-to-end type safety with no API schema files needed.

---

## Request Lifecycle

```
Browser
  │
  ├─ Static assets / SPA HTML  ──► Express → Vite (dev) / static files (prod)
  │
  └─ API calls (tRPC)
       │
       ▼
  POST /api/trpc/<router>.<procedure>
       │
       ▼
  tRPC middleware
       │
       ├─ Context creation (createContext)
       │     └─ Validates JWT session cookie → attaches user to ctx
       │
       ├─ Procedure middleware
       │     ├─ publicProcedure    — no auth required
       │     ├─ protectedProcedure — requires ctx.user (throws 401 if missing)
       │     └─ adminProcedure     — requires ctx.user.role === 'admin'
       │
       └─ Resolver → db.ts → MySQL (Drizzle)
```

---

## Directory Anatomy

### `server/`

```
server/
├── _core/
│   ├── index.ts          # Entry point — creates Express app, starts HTTP server
│   ├── context.ts        # tRPC context factory (reads JWT cookie → user)
│   ├── trpc.ts           # tRPC instance, middleware, procedure builders
│   ├── oauth.ts          # OAuth callback: exchanges code → creates session cookie
│   ├── cookies.ts        # Session cookie config (httpOnly, sameSite, maxAge)
│   ├── sdk.ts            # Platform SDK wrapper (OAuth, JWT creation)
│   ├── vite.ts           # Vite dev middleware integration
│   ├── llm.ts            # LLM call helpers (for future AI features)
│   ├── systemRouter.ts   # Health check / system tRPC router
│   └── ...
├── db.ts                 # ALL database query functions (Drizzle)
├── routers.ts            # tRPC appRouter (all application procedures)
├── storage.ts            # S3 / file storage helpers
└── veritas.test.ts       # Integration test suite
```

### `client/src/`

```
client/src/
├── _core/
│   ├── hooks/
│   │   └── useAuth.ts    # Auth hook (returns user, isAuthenticated, isAdmin)
│   └── trpc.ts           # tRPC client setup + QueryClientProvider
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── AIChatBox.tsx     # AI chat widget (placeholder for Phase 3)
│   ├── AuthGuard.tsx     # Redirect unauthenticated users
│   ├── DashboardLayout.tsx  # Sidebar + nav layout for dashboard pages
│   └── ErrorBoundary.tsx
├── contexts/
│   └── ThemeContext.tsx   # Light/dark theme context
├── hooks/                # Custom hooks
├── lib/
│   └── utils.ts          # cn() classname utility
├── pages/                # Full route-level page components
├── App.tsx               # Router configuration (wouter)
├── main.tsx              # React root mount + tRPC provider setup
└── index.css             # Tailwind directives + global CSS vars
```

### `shared/`

```
shared/
├── _core/                # Platform-specific shared utilities
├── const.ts              # COOKIE_NAME, ONE_YEAR_MS, etc.
└── types.ts              # Types shared between client and server
```

### `drizzle/`

```
drizzle/
├── schema.ts             # Single source of truth for all DB tables
├── relations.ts          # Drizzle relation definitions
├── migrations/           # Applied migration state
└── *.sql                 # Generated migration SQL files
```

---

## Authentication

Authentication uses **OAuth** (platform SDK) with **JWT session cookies**.

### Flow

1. User clicks "Sign In" → redirected to OAuth provider via `getLoginUrl()`
2. OAuth provider redirects to `/api/oauth/callback?code=...&state=...`
3. Server exchanges code for token, fetches user info, upserts user in DB
4. Server creates a signed JWT session token via `sdk.createSessionToken()`
5. JWT is set as an **httpOnly session cookie** (`COOKIE_NAME`)
6. On every subsequent request, `createContext()` reads and verifies the cookie → attaches `user` to tRPC context

### Procedure Authorization Levels

| Procedure | Requirement |
|---|---|
| `publicProcedure` | None — open to all |
| `protectedProcedure` | Valid session cookie → `ctx.user` must be non-null |
| `adminProcedure` | `ctx.user.role === 'admin'` |

---

## Database Layer

All database access is centralized in `server/db.ts`. Routers call these functions — they do not use Drizzle directly.

### Key Query Groups

| Group | Functions |
|---|---|
| Users | `upsertUser`, `getAllUsers`, `getUserById` |
| Courses | `getAllCourses`, `getCourseById`, `createCourse`, `updateCourse`, `deleteCourse` |
| Modules | `getCourseModules`, `getModuleById`, `getAllModules`, `createModule`, `updateModule`, `deleteModule` |
| Enrollments | `enrollUser`, `getUserEnrollments`, `isUserEnrolled` |
| Flashcards | `getFlashcardsByModule`, `getUserFlashcardProgress`, `updateFlashcardProgress` |
| Quizzes | `getQuizQuestionsByModule`, `saveQuizResult`, `getUserQuizResults`, `getQuizResultsByModule` |
| Gamification | `addXp`, `getUserXpInfo`, `getUserStreak`, `updateStreak`, `grantAchievement`, `getUserAchievements`, `getAllAchievements`, `getDashboardStats` |
| Study Plans | `getUserStudyPlans`, `createStudyPlan`, `getStudyPlanWithItems`, `toggleStudyPlanItem` |
| Progress | `markModuleComplete`, `getUserModuleProgress` |
| Orders | `getAllOrders`, `updateOrder` |

### XP System

XP is tracked via two mechanisms:
1. `users.totalXp` — running total (updated on every XP grant)
2. `xp_transactions` — full audit log of every XP event

XP Sources:
| Action | XP |
|---|---|
| Mastered flashcard | +10 |
| Reviewed flashcard | +5 |
| Quiz completion | Scaled by score % (max ~100) |
| Module completion | Module's `xpReward` (default 50) |
| Achievement unlocked | Achievement's `xpReward` (default 100) |

### Level Calculation

Levels are calculated client-side from `totalXp` using a threshold formula. The level boundary increases with each level (e.g. 0→100 = level 1, 100→250 = level 2, etc.).

---

## Gamification System

| Feature | Implementation |
|---|---|
| XP | `xpTransactions` table + `users.totalXp` |
| Levels | Derived from `totalXp` using threshold curve |
| Streaks | `streaks` table — updated on any learning activity via `updateStreak()` |
| Achievements | `achievements` (definitions) + `userAchievements` (earned) — granted via `grantAchievement()` |

### Achievement Triggers

| Achievement Code | Trigger |
|---|---|
| `first_course` | First course enrollment |
| `first_flashcard` | First flashcard reviewed |
| `first_quiz` | First quiz submitted |
| `perfect_quiz` | Quiz score of 100% |

---

## Frontend State Management

- **Server state** (API data): TanStack Query via tRPC hooks
- **Auth state**: `useAuth()` hook backed by `trpc.auth.me.useQuery()`
- **Theme state**: React Context (`ThemeContext`)
- **No global client state** (Redux, Zustand, etc.) — data stays server-authoritative

---

## Development vs Production Mode

| Aspect | Development | Production |
|---|---|---|
| Frontend serving | Vite dev server (HMR, JSX transform) | Express serves `dist/public/` |
| API | Same Express tRPC routes | Same Express tRPC routes |
| Build | `pnpm dev` | `pnpm build && pnpm start` |

Vite is configured to proxy all non-asset requests to Express, so the dev experience is seamless.

---

## Key Design Decisions

### Why tRPC?

End-to-end type safety between client and server without generating API clients or OpenAPI schemas. Procedures are just TypeScript functions — the client gets full autocomplete for inputs and outputs.

### Why Drizzle ORM?

Lightweight, type-safe, and SQL-first. Schema is defined in TypeScript and migrations are generated automatically. No magic — you write queries that feel like SQL.

### Why Wouter?

Tiny (~2KB) client-side router for React. No server-side routing needed since this is an SPA served by Express.

### Why MySQL?

Production-grade relational database with strong support for the data model (relational XP, achievements, enrollments). Drizzle supports MySQL natively.
