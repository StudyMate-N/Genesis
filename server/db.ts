import { eq, and, desc, asc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, profiles, courses, modules, flashcards, flashcardProgress,
  quizQuestions, quizResults, enrollments, moduleProgress, studyPlans, studyPlanItems,
  streaks, achievements, userAchievements, xpTransactions, orders
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Courses ─────────────────────────────────────────────────────────
export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.isPublished, true)).orderBy(asc(courses.id));
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getCourseModules(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.orderIndex));
}

export async function getModuleById(moduleId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  return result[0] ?? null;
}

// ─── Enrollments ─────────────────────────────────────────────────────
export async function enrollUser(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(enrollments).values({ userId, courseId });
  const result = await db.select().from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result[0] ?? null;
}

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const enrolled = await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  if (enrolled.length === 0) return [];
  const courseIds = enrolled.map(e => e.courseId);
  const allCourses = await db.select().from(courses);
  return allCourses.filter(c => courseIds.includes(c.id)).map(c => {
    const enrollment = enrolled.find(e => e.courseId === c.id);
    return { ...c, enrolledAt: enrollment?.enrolledAt, completedAt: enrollment?.completedAt };
  });
}

export async function isUserEnrolled(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))).limit(1);
  return result.length > 0;
}

// ─── Flashcards ──────────────────────────────────────────────────────
export async function getFlashcardsByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(flashcards).where(eq(flashcards.moduleId, moduleId)).orderBy(asc(flashcards.orderIndex));
}

export async function getUserFlashcardProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  const cards = await getFlashcardsByModule(moduleId);
  const cardIds = cards.map(c => c.id);
  if (cardIds.length === 0) return [];
  const allProgress = await db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, userId));
  return cards.map(card => {
    const progress = allProgress.find(p => p.flashcardId === card.id);
    return {
      ...card,
      status: progress?.status ?? 'new',
      reviewCount: progress?.reviewCount ?? 0,
      lastReviewedAt: progress?.lastReviewedAt ?? null,
    };
  });
}

export async function updateFlashcardProgress(userId: number, flashcardId: number, status: 'new' | 'learning' | 'mastered') {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(flashcardProgress)
    .where(and(eq(flashcardProgress.userId, userId), eq(flashcardProgress.flashcardId, flashcardId))).limit(1);
  if (existing.length > 0) {
    await db.update(flashcardProgress)
      .set({ status, reviewCount: (existing[0].reviewCount ?? 0) + 1, lastReviewedAt: new Date() })
      .where(eq(flashcardProgress.id, existing[0].id));
  } else {
    await db.insert(flashcardProgress).values({
      userId, flashcardId, status, reviewCount: 1, lastReviewedAt: new Date(),
    });
  }
}

// ─── Quiz Questions ──────────────────────────────────────────────────
export async function getQuizQuestionsByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizQuestions).where(eq(quizQuestions.moduleId, moduleId)).orderBy(asc(quizQuestions.orderIndex));
}

export async function saveQuizResult(userId: number, moduleId: number, score: number, totalQuestions: number, xpEarned: number, answers: any) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(quizResults).values({ userId, moduleId, score, totalQuestions, xpEarned, answers: JSON.stringify(answers) });
  const result = await db.select().from(quizResults)
    .where(and(eq(quizResults.userId, userId), eq(quizResults.moduleId, moduleId)))
    .orderBy(desc(quizResults.completedAt)).limit(1);
  return result[0] ?? null;
}

export async function getUserQuizResults(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizResults).where(eq(quizResults.userId, userId)).orderBy(desc(quizResults.completedAt));
}

export async function getQuizResultsByModule(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizResults)
    .where(and(eq(quizResults.userId, userId), eq(quizResults.moduleId, moduleId)))
    .orderBy(desc(quizResults.completedAt));
}

// ─── Module Progress ─────────────────────────────────────────────────
export async function markModuleComplete(userId: number, moduleId: number, courseId: number, xpEarned: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(moduleProgress)
    .where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleId, moduleId))).limit(1);
  if (existing.length > 0 && existing[0].completed) return existing[0];
  if (existing.length > 0) {
    await db.update(moduleProgress)
      .set({ completed: true, xpEarned, completedAt: new Date() })
      .where(eq(moduleProgress.id, existing[0].id));
  } else {
    await db.insert(moduleProgress).values({ userId, moduleId, courseId, completed: true, xpEarned, completedAt: new Date() });
  }
  return { completed: true, xpEarned };
}

export async function getUserModuleProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(moduleProgress)
    .where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.courseId, courseId)));
}

// ─── Gamification: XP ────────────────────────────────────────────────
export async function addXp(userId: number, amount: number, source: string, sourceId?: number, description?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(xpTransactions).values({ userId, amount, source, sourceId: sourceId ?? null, description: description ?? null });
  await db.update(users).set({
    totalXp: sql`totalXp + ${amount}`,
    level: sql`GREATEST(1, FLOOR((totalXp + ${amount}) / 500) + 1)`,
  }).where(eq(users.id, userId));
}

export async function getUserXpInfo(userId: number) {
  const db = await getDb();
  if (!db) return { totalXp: 0, level: 1, xpToNextLevel: 500 };
  const user = await db.select({ totalXp: users.totalXp, level: users.level }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) return { totalXp: 0, level: 1, xpToNextLevel: 500 };
  const totalXp = user[0].totalXp ?? 0;
  const level = Math.max(1, Math.floor(totalXp / 500) + 1);
  const xpForCurrentLevel = (level - 1) * 500;
  const xpToNextLevel = level * 500;
  const xpProgress = totalXp - xpForCurrentLevel;
  return { totalXp, level, xpToNextLevel: 500, xpProgress, xpForCurrentLevel };
}

export async function getRecentXpTransactions(userId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(xpTransactions).where(eq(xpTransactions.userId, userId)).orderBy(desc(xpTransactions.createdAt)).limit(limit);
}

// ─── Gamification: Streaks ───────────────────────────────────────────
export async function getUserStreak(userId: number) {
  const db = await getDb();
  if (!db) return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  const result = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
  if (!result[0]) return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  return result[0];
}

export async function updateStreak(userId: number) {
  const db = await getDb();
  if (!db) return;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const existing = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);

  if (!existing[0]) {
    await db.insert(streaks).values({ userId, currentStreak: 1, longestStreak: 1, lastActivityDate: today });
    return;
  }

  const lastActivity = existing[0].lastActivityDate;
  if (!lastActivity) {
    await db.update(streaks).set({ currentStreak: 1, longestStreak: Math.max(1, existing[0].longestStreak), lastActivityDate: today }).where(eq(streaks.id, existing[0].id));
    return;
  }

  const lastDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return; // Already logged today
  if (diffDays === 1) {
    const newStreak = existing[0].currentStreak + 1;
    await db.update(streaks).set({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, existing[0].longestStreak),
      lastActivityDate: today,
    }).where(eq(streaks.id, existing[0].id));
  } else {
    await db.update(streaks).set({ currentStreak: 1, lastActivityDate: today }).where(eq(streaks.id, existing[0].id));
  }
}

// ─── Gamification: Achievements ──────────────────────────────────────
export async function getAllAchievements() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(achievements);
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const userAch = await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  if (userAch.length === 0) return [];
  const allAch = await db.select().from(achievements);
  return userAch.map(ua => {
    const ach = allAch.find(a => a.id === ua.achievementId);
    return { ...ach, earnedAt: ua.earnedAt };
  }).filter(Boolean);
}

export async function grantAchievement(userId: number, achievementCode: string) {
  const db = await getDb();
  if (!db) return null;
  const ach = await db.select().from(achievements).where(eq(achievements.code, achievementCode)).limit(1);
  if (!ach[0]) return null;
  const existing = await db.select().from(userAchievements)
    .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, ach[0].id))).limit(1);
  if (existing.length > 0) return null; // Already earned
  await db.insert(userAchievements).values({ userId, achievementId: ach[0].id });
  if (ach[0].xpReward > 0) {
    await addXp(userId, ach[0].xpReward, 'achievement', ach[0].id, `Achievement: ${ach[0].name}`);
  }
  return ach[0];
}

// ─── Study Plans ─────────────────────────────────────────────────────
export async function getUserStudyPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(studyPlans).where(eq(studyPlans.userId, userId)).orderBy(desc(studyPlans.createdAt));
}

export async function getStudyPlanWithItems(planId: number) {
  const db = await getDb();
  if (!db) return null;
  const plan = await db.select().from(studyPlans).where(eq(studyPlans.id, planId)).limit(1);
  if (!plan[0]) return null;
  const items = await db.select().from(studyPlanItems).where(eq(studyPlanItems.studyPlanId, planId)).orderBy(asc(studyPlanItems.orderIndex));
  return { ...plan[0], items };
}

export async function createStudyPlan(userId: number, courseId: number, title: string, startDate: Date, endDate: Date, moduleIds: number[]) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(studyPlans).values({ userId, courseId, title, startDate, endDate });
  const plans = await db.select().from(studyPlans)
    .where(and(eq(studyPlans.userId, userId), eq(studyPlans.courseId, courseId)))
    .orderBy(desc(studyPlans.createdAt)).limit(1);
  const plan = plans[0];
  if (!plan) return null;
  for (let i = 0; i < moduleIds.length; i++) {
    await db.insert(studyPlanItems).values({ studyPlanId: plan.id, moduleId: moduleIds[i], orderIndex: i });
  }
  return getStudyPlanWithItems(plan.id);
}

export async function toggleStudyPlanItem(itemId: number, completed: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(studyPlanItems).set({ completed }).where(eq(studyPlanItems.id, itemId));
}

// ─── Admin: Users ────────────────────────────────────────────────────
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Admin: Courses CRUD ─────────────────────────────────────────────
export async function createCourse(data: { code: string; name: string; description?: string; category?: string; difficulty?: string; estimatedHours?: number }) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(courses).values(data as any);
  const result = await db.select().from(courses).where(eq(courses.code, data.code)).limit(1);
  return result[0] ?? null;
}

export async function updateCourse(id: number, data: Partial<{ name: string; description: string; category: string; difficulty: string; estimatedHours: number; isPublished: boolean }>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(courses).set(data as any).where(eq(courses.id, id));
  return getCourseById(id);
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(modules).where(eq(modules.courseId, id));
  await db.delete(courses).where(eq(courses.id, id));
}

// ─── Admin: Modules CRUD ────────────────────────────────────────────
export async function getAllModules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modules).orderBy(asc(modules.courseId), asc(modules.orderIndex));
}

export async function createModule(data: { courseId: number; title: string; description?: string; type: string; orderIndex?: number; xpReward?: number }) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(modules).values(data as any);
  const result = await db.select().from(modules)
    .where(and(eq(modules.courseId, data.courseId), eq(modules.title, data.title)))
    .orderBy(desc(modules.createdAt)).limit(1);
  return result[0] ?? null;
}

export async function updateModule(id: number, data: Partial<{ title: string; description: string; type: string; orderIndex: number; xpReward: number }>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(modules).set(data as any).where(eq(modules.id, id));
  return getModuleById(id);
}

export async function deleteModule(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(flashcards).where(eq(flashcards.moduleId, id));
  await db.delete(quizQuestions).where(eq(quizQuestions.moduleId, id));
  await db.delete(modules).where(eq(modules.id, id));
}

// ─── Admin: Orders ───────────────────────────────────────────────────
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrder(id: number, data: Partial<{ status: string; notes: string }>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(orders).set(data as any).where(eq(orders.id, id));
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0] ?? null;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────
export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return { enrolledCourses: 0, completedModules: 0, quizzesTaken: 0, flashcardsReviewed: 0 };

  const enrolled = await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  const completed = await db.select().from(moduleProgress).where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.completed, true)));
  const quizzes = await db.select().from(quizResults).where(eq(quizResults.userId, userId));
  const flashcardsRev = await db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, userId));

  return {
    enrolledCourses: enrolled.length,
    completedModules: completed.length,
    quizzesTaken: quizzes.length,
    flashcardsReviewed: flashcardsRev.length,
  };
}
