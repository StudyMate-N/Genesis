import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float, boolean, json } from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  totalXp: int("totalXp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Profiles ────────────────────────────────────────────────────────
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  school: varchar("school", { length: 256 }),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Courses ─────────────────────────────────────────────────────────
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  category: varchar("category", { length: 128 }),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  estimatedHours: int("estimatedHours").default(10),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Modules ─────────────────────────────────────────────────────────
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["study_guide", "flashcard_set", "quiz"]).notNull(),
  content: json("content"),
  orderIndex: int("orderIndex").default(0).notNull(),
  xpReward: int("xpReward").default(50).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Flashcards ──────────────────────────────────────────────────────
export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Flashcard Progress ──────────────────────────────────────────────
export const flashcardProgress = mysqlTable("flashcard_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  flashcardId: int("flashcardId").notNull(),
  status: mysqlEnum("status", ["new", "learning", "mastered"]).default("new").notNull(),
  reviewCount: int("reviewCount").default(0).notNull(),
  lastReviewedAt: timestamp("lastReviewedAt"),
  nextReviewAt: timestamp("nextReviewAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Quiz Questions ──────────────────────────────────────────────────
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // JSON array of strings
  correctIndex: int("correctIndex").notNull(),
  explanation: text("explanation"),
  orderIndex: int("orderIndex").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Quiz Results ────────────────────────────────────────────────────
export const quizResults = mysqlTable("quiz_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  answers: json("answers"), // JSON array of user answers
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

// ─── Enrollments ─────────────────────────────────────────────────────
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

// ─── Module Progress ─────────────────────────────────────────────────
export const moduleProgress = mysqlTable("module_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  courseId: int("courseId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Study Plans ─────────────────────────────────────────────────────
export const studyPlans = mysqlTable("study_plans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["active", "completed", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Study Plan Items ────────────────────────────────────────────────
export const studyPlanItems = mysqlTable("study_plan_items", {
  id: int("id").autoincrement().primaryKey(),
  studyPlanId: int("studyPlanId").notNull(),
  moduleId: int("moduleId").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  completed: boolean("completed").default(false).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
});

// ─── Streaks ─────────────────────────────────────────────────────────
export const streaks = mysqlTable("streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Achievements ────────────────────────────────────────────────────
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  xpReward: int("xpReward").default(100).notNull(),
  category: varchar("category", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── User Achievements ───────────────────────────────────────────────
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

// ─── XP Transactions ────────────────────────────────────────────────
export const xpTransactions = mysqlTable("xp_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  source: varchar("source", { length: 64 }).notNull(), // quiz, flashcard, module, achievement, streak
  sourceId: int("sourceId"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Orders ──────────────────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  studentName: varchar("studentName", { length: 256 }).notNull(),
  studentEmail: varchar("studentEmail", { length: 320 }).notNull(),
  courseName: varchar("courseName", { length: 256 }),
  plan: mysqlEnum("plan", ["free", "pro", "premium"]).default("free").notNull(),
  amount: float("amount").default(0),
  status: mysqlEnum("status", ["pending", "paid", "active", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
