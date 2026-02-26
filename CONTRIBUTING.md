# Contributing to Veritas Academy

Thank you for contributing to Veritas Academy. This guide covers the development workflow, coding standards, and branching strategy.

---

## Development Workflow

### Branching Strategy

We use feature branches with pull requests for all changes.

```
main                        ← Production-ready code
└── feature/<feature-name>  ← Feature development
└── fix/<bug-name>          ← Bug fixes
└── chore/<task>            ← Maintenance tasks
```

**Steps:**

1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with clear, atomic commits.

3. Push and open a Pull Request against `main`.

4. Ensure all tests pass and TypeScript has no errors before requesting review.

### Commit Messages

Use the imperative mood and keep the first line under 72 characters:

```
Add adaptive learning engine for quiz recommendations
Fix streak not resetting when user skips a day
Update flashcard progress to use spaced repetition intervals
```

---

## Local Setup

See [README.md](README.md) for full setup instructions.

Quick reference:

```bash
pnpm install
cp .env.example .env   # Set DATABASE_URL
pnpm db:push           # Apply schema to database
pnpm dev               # Start dev server at localhost:3000
pnpm test              # Run all tests
pnpm check             # TypeScript type-check (zero errors required)
```

---

## Code Standards

### TypeScript

- **Zero TypeScript errors** required. Run `pnpm check` before committing.
- Prefer explicit types over `any`. Use `unknown` for truly unknown values.
- Use Zod for runtime input validation on all tRPC procedures.

### React / Frontend

- Pages live in `client/src/pages/`
- Shared components in `client/src/components/`
- UI primitives (shadcn/ui) in `client/src/components/ui/` — do not modify these
- Use TanStack Query (`trpc.*.useQuery`, `trpc.*.useMutation`) for all data fetching
- Never call backend APIs directly with `fetch` — always use tRPC hooks

### tRPC / Backend

- All procedures live in `server/routers.ts`
- Database queries live in `server/db.ts` — keep routers thin
- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated-user endpoints
- Use `adminProcedure` for admin-only endpoints

### Database

- Schema defined in `drizzle/schema.ts`
- After schema changes: `pnpm db:push` to regenerate and apply migrations
- Never edit generated migration `.sql` files manually

### Styling

- Tailwind CSS v4 for all styling
- Follow the brand color system:
  - Primary / Navy: `#001F3F`
  - Accent / Gold: `#FFD700`
  - Background: `#F0F0F0`
  - White: `#FFFFFF`
- Mobile-first responsive design

---

## Testing

Tests use **Vitest** and run without a real database (mock contexts).

```bash
pnpm test          # Run all tests once
pnpm test --watch  # Watch mode
```

**What to test:**
- All tRPC procedures for auth, authorization (protected vs public vs admin)
- Business logic in `db.ts` that is non-trivial
- Edge cases: unauthenticated access, invalid inputs, missing records

**Test files:**
- `server/veritas.test.ts` — integration tests for all routers
- `server/auth.logout.test.ts` — auth-specific unit tests

---

## Adding a New Feature

### 1. Database changes (if needed)

Add tables/columns to `drizzle/schema.ts`, then run:

```bash
pnpm db:push
```

### 2. Backend: Add database queries

Add query functions to `server/db.ts`.

### 3. Backend: Add tRPC procedures

Add procedures to the appropriate router in `server/routers.ts`:

```typescript
// Example: adding a new procedure
newFeature: router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getNewFeatureData(ctx.user.id);
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.createNewFeature(ctx.user.id, input.name);
    }),
}),
```

### 4. Frontend: Add the page/component

Create the page in `client/src/pages/` and wire it in `client/src/App.tsx`:

```typescript
import NewFeaturePage from "./pages/NewFeaturePage";

// In the Router:
<Route path="/new-feature" component={NewFeaturePage} />
```

### 5. Frontend: Call the API

Use tRPC hooks:

```typescript
const { data } = trpc.newFeature.list.useQuery();
const createMutation = trpc.newFeature.create.useMutation();
```

### 6. Add tests

Add tests to `server/veritas.test.ts` covering the new procedures.

---

## Project Team Roles

| Role | Responsibility |
|---|---|
| Chief Architect & Tech Lead | Architecture decisions, code reviews, technical direction |
| Frontend Architect | UI/UX, gamified interface, mobile-first design |
| Backend & Database Architect | APIs, database design, auth, infrastructure |
| AI & ML Engineer | Adaptive learning, content generation, AI tutor |
| QA & DevOps | Testing, CI/CD, deployment, monitoring |

---

## Questions?

Open an issue on GitHub or reach out to the team.
