# API Reference — Veritas Academy

All API endpoints are exposed via **tRPC** at `/api/trpc/<router>.<procedure>`.

In development, use the tRPC React hooks (`trpc.<router>.<procedure>.useQuery()` / `.useMutation()`). The types are fully inferred — no need to consult this file for TypeScript usage. This reference is useful for understanding authorization requirements, inputs, and outputs.

---

## Authorization Levels

| Level | Description |
|---|---|
| Public | No authentication required |
| Protected | Must be logged in (valid session cookie) |
| Admin | Must be logged in with `role = 'admin'` |

---

## Auth Router — `auth.*`

### `auth.me`

Returns the currently authenticated user, or `null` if not logged in.

- **Auth:** Public
- **Input:** None
- **Returns:** `User | null`

```typescript
const user = trpc.auth.me.useQuery();
```

### `auth.logout`

Clears the session cookie.

- **Auth:** Public
- **Input:** None
- **Returns:** `{ success: true }`

```typescript
const logout = trpc.auth.logout.useMutation();
```

---

## Courses Router — `courses.*`

### `courses.list`

Returns all published courses.

- **Auth:** Public
- **Input:** None
- **Returns:** `Course[]`

### `courses.getById`

Returns a course with its full module list.

- **Auth:** Public
- **Input:** `{ id: number }`
- **Returns:** `Course & { modules: Module[] }`

### `courses.getModules`

Returns all modules for a course.

- **Auth:** Public
- **Input:** `{ courseId: number }`
- **Returns:** `Module[]`

---

## Modules Router — `modules.*`

### `modules.getById`

Returns a single module by ID.

- **Auth:** Public
- **Input:** `{ id: number }`
- **Returns:** `Module`

---

## Enrollments Router — `enrollments.*`

### `enrollments.enroll`

Enrolls the current user in a course. Grants `first_course` achievement and updates streak.

- **Auth:** Protected
- **Input:** `{ courseId: number }`
- **Returns:** `Enrollment`

### `enrollments.myEnrollments`

Returns all courses the current user is enrolled in.

- **Auth:** Protected
- **Input:** None
- **Returns:** `Enrollment[]`

### `enrollments.isEnrolled`

Checks whether the current user is enrolled in a specific course.

- **Auth:** Protected
- **Input:** `{ courseId: number }`
- **Returns:** `boolean`

### `enrollments.getProgress`

Returns the current user's module completion progress for a course.

- **Auth:** Protected
- **Input:** `{ courseId: number }`
- **Returns:** `ModuleProgress[]`

---

## Flashcards Router — `flashcards.*`

### `flashcards.getByModule`

Returns all flashcards for a module.

- **Auth:** Public
- **Input:** `{ moduleId: number }`
- **Returns:** `Flashcard[]`

### `flashcards.getProgress`

Returns the current user's progress on each flashcard in a module.

- **Auth:** Protected
- **Input:** `{ moduleId: number }`
- **Returns:** `FlashcardProgress[]`

### `flashcards.updateProgress`

Updates the spaced-repetition status of a flashcard for the current user. Awards XP (`mastered` = +10 XP, `learning` = +5 XP). Grants `first_flashcard` achievement on first review.

- **Auth:** Protected
- **Input:**
  ```typescript
  {
    flashcardId: number;
    status: 'new' | 'learning' | 'mastered';
  }
  ```
- **Returns:** `{ success: true }`

---

## Quizzes Router — `quizzes.*`

### `quizzes.getQuestions`

Returns quiz questions for a module. **Does not include `correctIndex`** (to prevent cheating).

- **Auth:** Public
- **Input:** `{ moduleId: number }`
- **Returns:**
  ```typescript
  Array<{
    id: number;
    question: string;
    options: string[];
    orderIndex: number;
  }>
  ```

### `quizzes.submit`

Submits quiz answers. Grades the attempt, saves the result, awards XP, marks module complete, and grants achievements (`first_quiz`, `perfect_quiz` if 100%).

- **Auth:** Protected
- **Input:**
  ```typescript
  {
    moduleId: number;
    answers: Array<{
      questionId: number;
      selectedIndex: number;
    }>;
  }
  ```
- **Returns:**
  ```typescript
  {
    score: number;
    totalQuestions: number;
    percentage: number;
    xpEarned: number;
    results: Array<{
      questionId: number;
      correct: boolean;
      correctIndex: number;
      explanation: string | null;
    }>;
  }
  ```

### `quizzes.myResults`

Returns all quiz results for the current user.

- **Auth:** Protected
- **Input:** None
- **Returns:** `QuizResult[]`

### `quizzes.resultsByModule`

Returns the current user's quiz results for a specific module.

- **Auth:** Protected
- **Input:** `{ moduleId: number }`
- **Returns:** `QuizResult[]`

---

## Gamification Router — `gamification.*`

### `gamification.xpInfo`

Returns the current user's XP and level information.

- **Auth:** Protected
- **Input:** None
- **Returns:**
  ```typescript
  {
    totalXp: number;
    level: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    progressPercent: number;
  }
  ```

### `gamification.streak`

Returns the current user's streak data.

- **Auth:** Protected
- **Input:** None
- **Returns:**
  ```typescript
  {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date | null;
  }
  ```

### `gamification.achievements`

Returns all achievements (system-wide) and which ones the current user has earned.

- **Auth:** Protected
- **Input:** None
- **Returns:**
  ```typescript
  {
    all: Achievement[];
    earned: UserAchievement[];
  }
  ```

### `gamification.recentXp`

Returns the most recent XP transactions for the current user.

- **Auth:** Protected
- **Input:** None
- **Returns:** `XpTransaction[]`

### `gamification.dashboardStats`

Returns aggregated stats for the student dashboard (enrollments, completions, streak, XP, recent activity).

- **Auth:** Protected
- **Input:** None
- **Returns:** Dashboard stats object

---

## Study Plans Router — `studyPlans.*`

### `studyPlans.myPlans`

Returns all study plans for the current user.

- **Auth:** Protected
- **Input:** None
- **Returns:** `StudyPlan[]`

### `studyPlans.getById`

Returns a study plan with all its scheduled items.

- **Auth:** Protected
- **Input:** `{ id: number }`
- **Returns:** `StudyPlan & { items: StudyPlanItem[] }`

### `studyPlans.create`

Creates a new study plan for the current user.

- **Auth:** Protected
- **Input:**
  ```typescript
  {
    courseId: number;
    title: string;
    startDate: number;   // Unix timestamp (ms)
    endDate: number;     // Unix timestamp (ms)
    moduleIds: number[];
  }
  ```
- **Returns:** `StudyPlan`

### `studyPlans.toggleItem`

Marks a study plan item as complete or incomplete. Updates streak.

- **Auth:** Protected
- **Input:**
  ```typescript
  {
    itemId: number;
    completed: boolean;
  }
  ```
- **Returns:** `{ success: true }`

---

## Progress Router — `progress.*`

### `progress.complete`

Marks a module as completed for the current user. Awards the module's XP reward and updates streak.

- **Auth:** Protected
- **Input:**
  ```typescript
  {
    moduleId: number;
    courseId: number;
  }
  ```
- **Returns:** `{ success: true; xpEarned: number }`

### `progress.getCourseProgress`

Returns the current user's progress across all modules in a course.

- **Auth:** Protected
- **Input:** `{ courseId: number }`
- **Returns:** `ModuleProgress[]`

---

## Admin Router — `admin.*`

All admin routes require `role = 'admin'`.

### `admin.users.list`

Returns all users.

- **Auth:** Admin
- **Returns:** `User[]`

### `admin.courses.list`

Returns all courses.

- **Auth:** Admin
- **Returns:** `Course[]`

### `admin.courses.create`

Creates a new course.

- **Auth:** Admin
- **Input:**
  ```typescript
  {
    code: string;
    name: string;
    description?: string;
    category?: string;
    difficulty?: string;
    estimatedHours?: number;
  }
  ```

### `admin.courses.update`

Updates a course.

- **Auth:** Admin
- **Input:** `{ id: number; name?: string; description?: string; category?: string; difficulty?: string; estimatedHours?: number; isPublished?: boolean }`

### `admin.courses.delete`

Deletes a course.

- **Auth:** Admin
- **Input:** `{ id: number }`

### `admin.modules.list`

Returns all modules.

- **Auth:** Admin
- **Returns:** `Module[]`

### `admin.modules.create`

Creates a new module.

- **Auth:** Admin
- **Input:**
  ```typescript
  {
    courseId: number;
    title: string;
    description?: string;
    type: 'study_guide' | 'flashcard_set' | 'quiz';
    orderIndex?: number;
    xpReward?: number;
  }
  ```

### `admin.modules.update`

Updates a module.

- **Auth:** Admin
- **Input:** `{ id: number; title?: string; description?: string; type?: string; orderIndex?: number; xpReward?: number }`

### `admin.modules.delete`

Deletes a module.

- **Auth:** Admin
- **Input:** `{ id: number }`

### `admin.orders.list`

Returns all orders.

- **Auth:** Admin
- **Returns:** `Order[]`

### `admin.orders.update`

Updates an order status or notes.

- **Auth:** Admin
- **Input:** `{ id: number; status?: string; notes?: string }`

---

## System Router — `system.*`

Internal health/system routes. See `server/_core/systemRouter.ts`.

---

## OAuth Endpoint (REST, not tRPC)

### `GET /api/oauth/callback`

Handles the OAuth provider redirect. Not called directly by the frontend.

- **Query params:** `code`, `state`
- **Action:** Exchanges code for token, upserts user, creates session cookie, redirects to `/`
