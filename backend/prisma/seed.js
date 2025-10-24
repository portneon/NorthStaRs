// prisma/seed.js

const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- 1. CLEANUP ---
  // Delete data in reverse order of dependency
  console.log("Cleaning database...");
  await prisma.userAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.course.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleaned.");

  // --- 2. CREATE USERS ---
  console.log("Seeding users...");
  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      // !! In a real app, you must HASH this password
      password: "password123",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      password: "password123",
    },
  });
  console.log(`Created users: ${user1.username}, ${user2.username}`);

  // --- 3. CREATE BADGES ---
  console.log("Seeding badges...");
  const badge1 = await prisma.badge.create({
    data: {
      name: "Quiz Newbie",
      description: "You completed your first quiz!",
      iconUrl: "badge_newbie.png",
      xpReward: 50,
    },
  });
  console.log(`Created badge: ${badge1.name}`);

  // --- 4. CREATE COURSE, TOPICS, QUIZZES, QUESTIONS, OPTIONS ---
  console.log("Seeding course, topic, quiz, questions, and options...");
  const course1 = await prisma.course.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming.",
      topics: {
        create: {
          name: "Variables and Data Types",
          description: "Understanding var, let, const, and data types.",
          quizzes: {
            create: {
              title: "JS Variables Quiz",
              description: "Test your knowledge of JS variables.",
              difficulty: "Easy",
              createdById: user1.id, // Alice created this quiz
              questions: {
                create: [
                  // Question 1
                  {
                    text: "Which keyword declares a block-scoped variable?",
                    explanation:
                      "'let' and 'const' are block-scoped. 'var' is function-scoped.",
                    correctOptionId: "", // Placeholder, will update later
                    options: {
                      create: [
                        { text: "var" },
                        { text: "let" },
                        { text: "const" },
                        { text: "let and const" }, // Correct
                      ],
                    },
                  },
                  // Question 2
                  {
                    text: "What is the data type of `typeof 42`?",
                    explanation: "All numbers in JS are of type 'number'.",
                    correctOptionId: "", // Placeholder, will update later
                    options: {
                      create: [
                        { text: "number" }, // Correct
                        { text: "string" },
                        { text: "integer" },
                        { text: "boolean" },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    // We include all the nested data to use it in the next steps
    include: {
      topics: {
        include: {
          quizzes: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(`Created course: ${course1.title}`);

  // --- 5. UPDATE correctOptionId (The tricky part) ---
  // We must do this after creation because we don't know the
  // generated Option IDs during the nested create.
  console.log("Updating correctOptionIds for questions...");
  const quiz = course1.topics[0].quizzes[0];

  // Q1: "let and const"
  const q1 = quiz.questions[0];
  const q1CorrectOption = q1.options.find(
    (o) => o.text === "let and const"
  );

  if (q1CorrectOption) {
    await prisma.question.update({
      where: { id: q1.id },
      data: { correctOptionId: q1CorrectOption.id },
    });
  }

  // Q2: "number"
  const q2 = quiz.questions[1];
  const q2CorrectOption = q2.options.find((o) => o.text === "number");

  if (q2CorrectOption) {
    await prisma.question.update({
      where: { id: q2.id },
      data: { correctOptionId: q2CorrectOption.id },
    });
  }
  console.log("Correct option IDs updated.");

  // --- 6. SIMULATE A QUIZ ATTEMPT (by Bob) ---
  console.log("Simulating quiz attempt for Bob...");

  // Refetch quiz data to ensure we have the updated correctOptionIds
  const quizToAttempt = await prisma.quiz.findUnique({
    where: { id: quiz.id },
    include: { questions: true },
  });

  if (!quizToAttempt) {
    throw new Error("Quiz not found for attempt!");
  }

  // Bob's Answers
  const bobAnswerQ1 = q1CorrectOption; // Bob gets Q1 right
  const bobAnswerQ2 = q2.options.find((o) => o.text === "string"); // Bob gets Q2 wrong

  let score = 0;
  const userAnswersData = [];

  // Prep Q1 Answer
  if (bobAnswerQ1) {
    const isCorrect = bobAnswerQ1.id === q1.correctOptionId;
    if (isCorrect) score++;
    userAnswersData.push({
      questionId: q1.id,
      optionId: bobAnswerQ1.id,
      isCorrect: isCorrect,
    });
  }

  // Prep Q2 Answer
  if (bobAnswerQ2) {
    const isCorrect = bobAnswerQ2.id === q2.correctOptionId;
    if (isCorrect) score++;
    userAnswersData.push({
      questionId: q2.id,
      optionId: bobAnswerQ2.id,
      isCorrect: isCorrect,
    });
  }

  // Create the Attempt with nested UserAnswers
  await prisma.attempt.create({
    data: {
      userId: user2.id,
      quizId: quiz.id,
      finishedAt: new Date(),
      score: score,
      timeTakenSec: 180, // 3 minutes
      userAnswers: {
        createMany: {
          data: userAnswersData,
        },
      },
    },
  });
  console.log(`Created attempt for Bob. Score: ${score}`);

  // --- 7. UPDATE USER STATS & LEADERBOARD ---
  console.log("Updating user stats and leaderboard...");
  const xpFromQuiz = score * 10; // 10 XP per correct answer
  const xpFromBadge = badge1.xpReward;

  // Give Bob the "Quiz Newbie" badge
  await prisma.userBadge.create({
    data: {
      userId: user2.id,
      badgeId: badge1.id,
    },
  });

  // Update Bob's XP and Level
  const totalXpBob = xpFromQuiz + xpFromBadge;
  await prisma.user.update({
    where: { id: user2.id },
    data: {
      xp: totalXpBob,
      level: 2, // Just an example logic
      lastLogin: new Date(),
    },
  });

  // Create Leaderboard entries
  await prisma.leaderboard.create({
    data: {
      userId: user1.id,
      totalXP: 0,
      rank: 2,
    },
  });
  await prisma.leaderboard.create({
    data: {
      userId: user2.id,
      totalXP: totalXpBob,
      rank: 1,
    },
  });
  console.log("Leaderboard updated.");

  console.log("Seeding finished.");
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client connection
    await prisma.$disconnect();
  });