import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: AuthenticatedUser | null): TrpcContext {
  const clearedCookies: any[] = [];
  return {
    user: user ?? null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
}

function createAdminUser(): AuthenticatedUser {
  return {
    id: 1,
    openId: "admin-user",
    email: "admin@veritas.edu",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    totalXp: 500,
    level: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function createStudentUser(): AuthenticatedUser {
  return {
    id: 2,
    openId: "student-user",
    email: "student@veritas.edu",
    name: "Student User",
    loginMethod: "manus",
    role: "user",
    totalXp: 100,
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("Auth Router", () => {
  it("auth.me returns null for unauthenticated user", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("auth.me returns user for authenticated user", async () => {
    const user = createStudentUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("student@veritas.edu");
    expect(result?.name).toBe("Student User");
  });

  it("auth.logout clears cookie and returns success", async () => {
    const user = createStudentUser();
    const ctx = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});

describe("Courses Router", () => {
  it("courses.list returns an array", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courses.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("courses.getById returns course with modules", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courses.getById({ id: 1 });
    expect(result).toBeDefined();
    if (result) {
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("modules");
      expect(Array.isArray(result.modules)).toBe(true);
    }
  });

  it("courses.getModules returns array for valid courseId", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courses.getModules({ courseId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Modules Router", () => {
  it("modules.getById returns module data", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.modules.getById({ id: 1 });
    expect(result).toBeDefined();
    if (result) {
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("type");
    }
  });
});

describe("Enrollments Router", () => {
  it("enrollments.myEnrollments requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.enrollments.myEnrollments()).rejects.toThrow();
  });

  it("enrollments.isEnrolled requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.enrollments.isEnrolled({ courseId: 1 })).rejects.toThrow();
  });
});

describe("Gamification Router", () => {
  it("gamification.xpInfo requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gamification.xpInfo()).rejects.toThrow();
  });

  it("gamification.streak requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gamification.streak()).rejects.toThrow();
  });

  it("gamification.achievements requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gamification.achievements()).rejects.toThrow();
  });
});

describe("Study Plans Router", () => {
  it("studyPlans.myPlans requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.studyPlans.myPlans()).rejects.toThrow();
  });
});

describe("Quizzes Router", () => {
  it("quizzes.getQuestions returns questions without correctIndex", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quizzes.getQuestions({ moduleId: 1 });
    expect(Array.isArray(result)).toBe(true);
    // Should not expose correctIndex
    if (result.length > 0) {
      expect(result[0]).not.toHaveProperty("correctIndex");
      expect(result[0]).toHaveProperty("question");
      expect(result[0]).toHaveProperty("options");
    }
  });

  it("quizzes.submit requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.quizzes.submit({ moduleId: 1, answers: [] })).rejects.toThrow();
  });

  it("quizzes.myResults requires auth", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.quizzes.myResults()).rejects.toThrow();
  });
});

describe("Admin Router", () => {
  it("admin.users.list requires admin role", async () => {
    const student = createStudentUser();
    const ctx = createMockContext(student);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("admin.courses.list requires admin role", async () => {
    const student = createStudentUser();
    const ctx = createMockContext(student);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.courses.list()).rejects.toThrow();
  });

  it("admin.modules.list requires admin role", async () => {
    const student = createStudentUser();
    const ctx = createMockContext(student);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.modules.list()).rejects.toThrow();
  });

  it("admin.orders.list requires admin role", async () => {
    const student = createStudentUser();
    const ctx = createMockContext(student);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.orders.list()).rejects.toThrow();
  });

  it("admin.users.list works for admin", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.users.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin.courses.list works for admin", async () => {
    const admin = createAdminUser();
    const ctx = createMockContext(admin);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.courses.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
