/**
 * Database client with graceful fallback.
 * If DATABASE_URL isn't set, returns a mock client that logs operations.
 */

let db;

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('YOUR-PASSWORD')) {
  // Real database
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis;
  db = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
} else {
  // Mock database for development without Supabase
  console.log('[DB] No DATABASE_URL configured — using in-memory mock');
  
  const orders = [];
  
  db = {
    order: {
      findMany: async (opts) => {
        let result = [...orders];
        if (opts?.where?.studentEmail) result = result.filter(o => o.studentEmail === opts.where.studentEmail);
        if (opts?.orderBy?.createdAt === 'desc') result.reverse();
        return result;
      },
      findUnique: async ({ where }) => {
        return orders.find(o => o.id === where.id) || null;
      },
      create: async ({ data }) => {
        const order = { id: 'ord_' + Math.random().toString(36).slice(2, 10), ...data, createdAt: new Date(), updatedAt: new Date() };
        orders.push(order);
        console.log(`[DB] Order created: ${order.id}`);
        return order;
      },
      update: async ({ where, data }) => {
        const idx = orders.findIndex(o => o.id === where.id);
        if (idx === -1) return null;
        orders[idx] = { ...orders[idx], ...data, updatedAt: new Date() };
        console.log(`[DB] Order updated: ${where.id}`);
        return orders[idx];
      },
    },
    user: {
      create: async ({ data }) => {
        console.log(`[DB] Mock User created: ${data.email}`);
        return { id: 'user_1', ...data };
      },
      deleteMany: async () => ({ count: 0 }),
    },
    profile: {
      deleteMany: async () => ({ count: 0 }),
    },
    course: {
      create: async ({ data }) => {
        console.log(`[DB] Mock Course created: ${data.name}`);
        return { id: 'course_' + Math.random().toString(36).slice(2, 5), ...data };
      },
      findMany: async () => [],
      deleteMany: async () => ({ count: 0 }),
    },
    module: {
      create: async ({ data }) => {
        console.log(`[DB] Mock Module created: ${data.title}`);
        return { id: 'mod_' + Math.random().toString(36).slice(2, 5), ...data };
      },
      findMany: async () => [],
      deleteMany: async () => ({ count: 0 }),
    },
    studyPlan: {
      create: async ({ data }) => {
        console.log(`[DB] Mock StudyPlan created: ${data.title}`);
        return { id: 'plan_1', ...data };
      },
      deleteMany: async () => ({ count: 0 }),
    },
    quizResult: {
      create: async ({ data }) => {
        console.log(`[DB] Mock QuizResult created`);
        return { id: 'res_1', ...data };
      },
      deleteMany: async () => ({ count: 0 }),
    },
    _mock: true,
    _orders: orders,
  };
}

module.exports = { db };
