const { db } = require('../lib/db');
const bcrypt = require('bcryptjs');

const prisma = db;

async function main() {
  console.log('🌱 Starting database seed...');

  if (prisma._mock) {
    console.log('⚠️ Using mock database for seeding. Data will not persist.');
  }

  // Clear existing data
  console.log('Clearing existing data...');
  if (!prisma._mock) {
    await prisma.quizResult.deleteMany({});
    await prisma.studyPlan.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
  } else {
    // Mock clear
    prisma._orders.length = 0;
  }

  // Create sample user
  console.log('Creating sample user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'student@veritas.academy',
      password: hashedPassword,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          school: 'Veritas Academy',
          bio: 'Dedicated student preparing for exams'
        }
      }
    },
    include: { profile: true }
  });
  console.log(`✓ Created user: ${user.email}`);

  // Create sample courses
  console.log('Creating sample courses...');
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        code: 'MATH101',
        name: 'Calculus I: Foundations',
        description: 'Master the fundamentals of differential and integral calculus with real-world applications.'
      }
    }),
    prisma.course.create({
      data: {
        code: 'PHYS201',
        name: 'Physics II: Electromagnetism',
        description: 'Explore electric fields, magnetic forces, and electromagnetic waves in depth.'
      }
    }),
    prisma.course.create({
      data: {
        code: 'CHEM150',
        name: 'Chemistry: Organic Synthesis',
        description: 'Learn organic chemistry mechanisms and synthesis strategies for complex molecules.'
      }
    })
  ]);
  console.log(`✓ Created ${courses.length} courses`);

  // Create modules for each course
  console.log('Creating modules for courses...');
  for (let courseIdx = 0; courseIdx < courses.length; courseIdx++) {
    const course = courses[courseIdx];
    const moduleTypes = ['flashcard', 'quiz', 'study_guide'];
    
    for (let i = 0; i < 6; i++) {
      const moduleType = moduleTypes[i % moduleTypes.length];
      await prisma.module.create({
        data: {
          courseId: course.id,
          title: `${course.name} - Module ${i + 1}`,
          content: generateModuleContent(course.name, i + 1, moduleType),
          type: moduleType,
          order: i
        }
      });
    }
  }
  console.log('✓ Created modules for all courses');

  // Create a study plan
  console.log('Creating study plan...');
  const modules = await prisma.module.findMany({
    where: { courseId: courses[0].id }
  });

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId: user.id,
      courseId: courses[0].id,
      title: `Personalized Study Plan: ${courses[0].name}`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      status: 'active',
      modules: {
        connect: modules.map(m => ({ id: m.id }))
      }
    }
  });
  console.log(`✓ Created study plan: ${studyPlan.title}`);

  // Create sample quiz results
  console.log('Creating sample quiz results...');
  const quizModules = await prisma.module.findMany({
    where: { type: 'quiz' },
    take: 2
  });

  for (const module of quizModules) {
    await prisma.quizResult.create({
      data: {
        userId: user.id,
        moduleId: module.id,
        score: Math.floor(Math.random() * 20) + 15, // 15-35 out of 40
        total: 40,
        answers: JSON.stringify({
          q1: 'A',
          q2: 'C',
          q3: 'B',
          q4: 'A'
        })
      }
    });
  }
  console.log('✓ Created sample quiz results');

  console.log('\n✅ Database seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`  • Users: 1 (${user.email})`);
  console.log(`  • Courses: ${courses.length}`);
  console.log(`  • Modules: ${courses.length * 6}`);
  console.log(`  • Study Plans: 1`);
  console.log(`  • Quiz Results: ${quizModules.length}`);
}

function generateModuleContent(courseName, moduleNum, type) {
  const contents = {
    flashcard: `Flashcard set for ${courseName} Module ${moduleNum}. Contains key terms, definitions, and concepts essential for mastering this topic. Practice regularly to reinforce learning.`,
    quiz: `Quiz for ${courseName} Module ${moduleNum}. Test your understanding with 40 multiple-choice questions covering all major concepts from this module. Time limit: 60 minutes.`,
    study_guide: `Comprehensive study guide for ${courseName} Module ${moduleNum}. Includes detailed explanations, worked examples, practice problems, and tips for exam success.`
  };
  return contents[type] || contents.study_guide;
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    if (typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
  });
