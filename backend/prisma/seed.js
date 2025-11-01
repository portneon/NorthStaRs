import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 🧹 Clean up existing data
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.course.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Existing data cleared.");

  // 🧍‍♂️ Create Users
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = [];

  for (let i = 1; i <= 15; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        xp: Math.floor(Math.random() * 1000), // random XP up to 1000
        level: Math.ceil(Math.random() * 10), // random level 1–10
        streakCount: Math.floor(Math.random() * 30), // random streak up to 30
        lastLogin: new Date(),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users.`);

  // 🏅 Create Badges
  console.log("🏅 Creating badges...");
  const badges = await prisma.badge.createMany({
    data: [
      { name: "Newbie", description: "Awarded for joining the platform" },
      { name: "Achiever", description: "Awarded for completing your first quiz" },
      { name: "Champion", description: "Awarded for reaching 500 XP" },
      { name: "Master", description: "Awarded for reaching 1000 XP" },
    ],
  });
  console.log("✅ Badges created.");

  // 📘 Create Course
  console.log("📘 Creating course...");
  const course = await prisma.course.create({
    data: {
      title: "JavaScript Essentials",
      description: "Learn the basics of JavaScript programming",
      level: "Beginner",
      duration: "4 weeks",
    },
  });
  console.log(`✅ Course created: ${course.title}`);

  // 🧩 Create Quiz
  console.log("🧩 Creating quiz...");
  const quiz = await prisma.quiz.create({
    data: {
      title: "JavaScript Basics Quiz",
      courseId: course.id,
      questions: {
        create: [
          {
            questionText: "What is the output of 2 + '2' in JavaScript?",
            options: ["22", "4", "NaN", "Error"],
            correctAnswer: "22",
          },
          {
            questionText: "Which keyword is used to declare a constant in JS?",
            options: ["var", "let", "const", "define"],
            correctAnswer: "const",
          },
          {
            questionText: "What is the result of typeof null?",
            options: ["null", "undefined", "object", "number"],
            correctAnswer: "object",
          },
          {
            questionText: "Which method converts JSON to an object?",
            options: [
              "JSON.parse()",
              "JSON.stringify()",
              "JSON.convert()",
              "JSON.toObject()",
            ],
            correctAnswer: "JSON.parse()",
          },
          {
            questionText: "What does NaN stand for?",
            options: [
              "Not a Number",
              "Negative and Null",
              "New Assigned Number",
              "None Above Null",
            ],
            correctAnswer: "Not a Number",
          },
        ],
      },
    },
  });
  console.log(`✅ Quiz created: ${quiz.title}`);

  // 🧮 Create Random Quiz Attempts for all 15 users
  console.log("🧠 Creating quiz attempts...");
  for (const user of users) {
    const correctAnswers = Math.floor(Math.random() * 6); // 0–5
    const score = correctAnswers * 20;
    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        completedAt: new Date(),
      },
    });
  }
  console.log("✅ Quiz attempts created for all users.");

  // 🏆 Create Leaderboard
  console.log("🏆 Creating leaderboard...");
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  for (let i = 0; i < sortedUsers.length; i++) {
    await prisma.leaderboard.create({
      data: {
        userId: sortedUsers[i].id,
        totalXP: sortedUsers[i].xp,
        rank: i + 1,
      },
    });
  }
  console.log("✅ Leaderboard created.");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
