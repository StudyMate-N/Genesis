import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Courses ─────────────────────────────────────────────────────
  courses: router({
    list: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const course = await db.getCourseById(input.id);
      const mods = await db.getCourseModules(input.id);
      return { ...course, modules: mods };
    }),
    getModules: publicProcedure.input(z.object({ courseId: z.number() })).query(async ({ input }) => {
      return db.getCourseModules(input.courseId);
    }),
  }),

  // ─── Modules ─────────────────────────────────────────────────────
  modules: router({
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getModuleById(input.id);
    }),
  }),

  // ─── Enrollments ─────────────────────────────────────────────────
  enrollments: router({
    enroll: protectedProcedure.input(z.object({ courseId: z.number() })).mutation(async ({ ctx, input }) => {
      const enrollment = await db.enrollUser(ctx.user.id, input.courseId);
      await db.grantAchievement(ctx.user.id, 'first_course');
      await db.updateStreak(ctx.user.id);
      return enrollment;
    }),
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserEnrollments(ctx.user.id);
    }),
    isEnrolled: protectedProcedure.input(z.object({ courseId: z.number() })).query(async ({ ctx, input }) => {
      return db.isUserEnrolled(ctx.user.id, input.courseId);
    }),
    getProgress: protectedProcedure.input(z.object({ courseId: z.number() })).query(async ({ ctx, input }) => {
      return db.getUserModuleProgress(ctx.user.id, input.courseId);
    }),
  }),

  // ─── Flashcards ──────────────────────────────────────────────────
  flashcards: router({
    getByModule: publicProcedure.input(z.object({ moduleId: z.number() })).query(async ({ input }) => {
      return db.getFlashcardsByModule(input.moduleId);
    }),
    getProgress: protectedProcedure.input(z.object({ moduleId: z.number() })).query(async ({ ctx, input }) => {
      return db.getUserFlashcardProgress(ctx.user.id, input.moduleId);
    }),
    updateProgress: protectedProcedure.input(z.object({
      flashcardId: z.number(),
      status: z.enum(['new', 'learning', 'mastered']),
    })).mutation(async ({ ctx, input }) => {
      await db.updateFlashcardProgress(ctx.user.id, input.flashcardId, input.status);
      if (input.status === 'mastered') {
        await db.addXp(ctx.user.id, 10, 'flashcard', input.flashcardId, 'Mastered a flashcard');
      } else if (input.status === 'learning') {
        await db.addXp(ctx.user.id, 5, 'flashcard', input.flashcardId, 'Reviewed a flashcard');
      }
      await db.grantAchievement(ctx.user.id, 'first_flashcard');
      await db.updateStreak(ctx.user.id);
      return { success: true };
    }),
  }),

  // ─── Quizzes ─────────────────────────────────────────────────────
  quizzes: router({
    getQuestions: publicProcedure.input(z.object({ moduleId: z.number() })).query(async ({ input }) => {
      const questions = await db.getQuizQuestionsByModule(input.moduleId);
      // Don't send correctIndex to client during quiz
      return questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        orderIndex: q.orderIndex,
      }));
    }),
    submit: protectedProcedure.input(z.object({
      moduleId: z.number(),
      answers: z.array(z.object({ questionId: z.number(), selectedIndex: z.number() })),
    })).mutation(async ({ ctx, input }) => {
      const questions = await db.getQuizQuestionsByModule(input.moduleId);
      let score = 0;
      const results = input.answers.map(a => {
        const q = questions.find(q => q.id === a.questionId);
        const correct = q ? q.correctIndex === a.selectedIndex : false;
        if (correct) score++;
        return {
          questionId: a.questionId,
          selectedIndex: a.selectedIndex,
          correctIndex: q?.correctIndex ?? 0,
          correct,
          explanation: q?.explanation ?? '',
        };
      });

      const totalQuestions = questions.length;
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      const xpEarned = Math.round((score / Math.max(totalQuestions, 1)) * 75);

      await db.saveQuizResult(ctx.user.id, input.moduleId, score, totalQuestions, xpEarned, results);
      await db.addXp(ctx.user.id, xpEarned, 'quiz', input.moduleId, `Quiz: ${score}/${totalQuestions}`);

      // Mark module complete
      const mod = await db.getModuleById(input.moduleId);
      if (mod) {
        await db.markModuleComplete(ctx.user.id, input.moduleId, mod.courseId, xpEarned);
      }

      // Achievements
      await db.grantAchievement(ctx.user.id, 'first_quiz');
      if (percentage === 100) {
        await db.grantAchievement(ctx.user.id, 'perfect_quiz');
      }
      await db.updateStreak(ctx.user.id);

      return { score, totalQuestions, percentage, xpEarned, results };
    }),
    myResults: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserQuizResults(ctx.user.id);
    }),
    resultsByModule: protectedProcedure.input(z.object({ moduleId: z.number() })).query(async ({ ctx, input }) => {
      return db.getQuizResultsByModule(ctx.user.id, input.moduleId);
    }),
  }),

  // ─── Gamification ────────────────────────────────────────────────
  gamification: router({
    xpInfo: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserXpInfo(ctx.user.id);
    }),
    streak: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStreak(ctx.user.id);
    }),
    achievements: protectedProcedure.query(async ({ ctx }) => {
      const earned = await db.getUserAchievements(ctx.user.id);
      const all = await db.getAllAchievements();
      return { earned, all };
    }),
    recentXp: protectedProcedure.query(async ({ ctx }) => {
      return db.getRecentXpTransactions(ctx.user.id);
    }),
    dashboardStats: protectedProcedure.query(async ({ ctx }) => {
      return db.getDashboardStats(ctx.user.id);
    }),
  }),

  // ─── Study Plans ─────────────────────────────────────────────────
  studyPlans: router({
    myPlans: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStudyPlans(ctx.user.id);
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getStudyPlanWithItems(input.id);
    }),
    create: protectedProcedure.input(z.object({
      courseId: z.number(),
      title: z.string(),
      startDate: z.number(), // unix timestamp ms
      endDate: z.number(),
      moduleIds: z.array(z.number()),
    })).mutation(async ({ ctx, input }) => {
      return db.createStudyPlan(
        ctx.user.id, input.courseId, input.title,
        new Date(input.startDate), new Date(input.endDate), input.moduleIds
      );
    }),
    toggleItem: protectedProcedure.input(z.object({
      itemId: z.number(),
      completed: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      await db.toggleStudyPlanItem(input.itemId, input.completed);
      await db.updateStreak(ctx.user.id);
      return { success: true };
    }),
  }),

  // ─── Module Progress ─────────────────────────────────────────────
  progress: router({
    complete: protectedProcedure.input(z.object({
      moduleId: z.number(),
      courseId: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const mod = await db.getModuleById(input.moduleId);
      const xpReward = mod?.xpReward ?? 50;
      await db.markModuleComplete(ctx.user.id, input.moduleId, input.courseId, xpReward);
      await db.addXp(ctx.user.id, xpReward, 'module', input.moduleId, `Completed module: ${mod?.title}`);
      await db.updateStreak(ctx.user.id);
      return { success: true, xpEarned: xpReward };
    }),
    getCourseProgress: protectedProcedure.input(z.object({ courseId: z.number() })).query(async ({ ctx, input }) => {
      return db.getUserModuleProgress(ctx.user.id, input.courseId);
    }),
  }),

  // ─── Admin ───────────────────────────────────────────────────────
  admin: router({
    users: router({
      list: adminProcedure.query(async () => db.getAllUsers()),
    }),
    courses: router({
      list: adminProcedure.query(async () => db.getAllCourses()),
      create: adminProcedure.input(z.object({
        code: z.string(), name: z.string(), description: z.string().optional(),
        category: z.string().optional(), difficulty: z.string().optional(), estimatedHours: z.number().optional(),
      })).mutation(async ({ input }) => db.createCourse(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), name: z.string().optional(), description: z.string().optional(),
        category: z.string().optional(), difficulty: z.string().optional(),
        estimatedHours: z.number().optional(), isPublished: z.boolean().optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCourse(id, data);
      }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteCourse(input.id);
        return { success: true };
      }),
    }),
    modules: router({
      list: adminProcedure.query(async () => db.getAllModules()),
      create: adminProcedure.input(z.object({
        courseId: z.number(), title: z.string(), description: z.string().optional(),
        type: z.string(), orderIndex: z.number().optional(), xpReward: z.number().optional(),
      })).mutation(async ({ input }) => db.createModule(input)),
      update: adminProcedure.input(z.object({
        id: z.number(), title: z.string().optional(), description: z.string().optional(),
        type: z.string().optional(), orderIndex: z.number().optional(), xpReward: z.number().optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateModule(id, data);
      }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await db.deleteModule(input.id);
        return { success: true };
      }),
    }),
    orders: router({
      list: adminProcedure.query(async () => db.getAllOrders()),
      update: adminProcedure.input(z.object({
        id: z.number(), status: z.string().optional(), notes: z.string().optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateOrder(id, data);
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
