const { PrismaClient } = require("@prisma/client");
require('dotenv').config();
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding ...");

    // --- 1. CLEAN DATABASE ---
    console.log("Cleaning database...");
    // Coding Problem Tables
    await prisma.problemProgress.deleteMany({});
    await prisma.codeSubmission.deleteMany({});
    await prisma.testCase.deleteMany({});
    await prisma.codeProblem.deleteMany({});

    // Quiz & User Tables
    await prisma.attempt.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.userAchievement.deleteMany(); // Was userBadge
    await prisma.leaderboard.deleteMany();
    // await prisma.reward.deleteMany(); // Removed
    await prisma.quiz.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.course.deleteMany();
    await prisma.achievement.deleteMany(); // Was badge
    await prisma.user.deleteMany();
    console.log("Database cleaned.");

    // --- 2. CREATE USERS ---
    console.log("Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user1 = await prisma.user.create({
        data: {
            username: "alice",
            email: "alice@example.com",
            password: hashedPassword,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: "bob",
            email: "bob@example.com",
            password: hashedPassword,
        },
    });
    console.log(`Created users: ${user1.username}, ${user2.username}`);

    // --- 3. CREATE ACHIEVEMENTS (Was Badges) ---
    console.log("Seeding achievements...");
    const badge1 = await prisma.achievement.create({
        data: {
            name: "Quiz Newbie",
            code: "QUIZ_NEWBIE",
            description: "You completed your first quiz!",
            type: "BADGE",
            xpReward: 50,
        },
    });

    const badge2 = await prisma.achievement.create({
        data: {
            name: "Quiz Master",
            code: "QUIZ_MASTER",
            description: "Completed 10 quizzes - you're a quiz master!",
            type: "BADGE",
            xpReward: 200,
        },
    });

    const badge3 = await prisma.achievement.create({
        data: {
            name: "Speed Demon",
            code: "SPEED_DEMON",
            description: "Completed a quiz in under 2 minutes",
            type: "BADGE",
            xpReward: 100,
        },
    });

    const badge4 = await prisma.achievement.create({
        data: {
            name: "Perfect Score",
            code: "PERFECT_SCORE",
            description: "Got 100% on a quiz",
            type: "BADGE",
            xpReward: 150,
        },
    });
    console.log(`Created achievements: ${badge1.name}, ${badge2.name}, ${badge3.name}, ${badge4.name}`);

    // --- 4. SEED COURSES, TOPICS, QUIZZES ---
    console.log("Seeding course, topic, quiz, questions, and options...");

    const course1 = await prisma.course.create({
        data: {
            title: "JavaScript Fundamentals",
            description: "Learn the basics of JavaScript programming.",
            topics: {
                create: [
                    // Topic 1: Variables (from prisma/seed.js)
                    {
                        name: "Variables and Data Types",
                        description: "Understanding var, let, const, and data types.",
                        quizzes: {
                            create: {
                                title: "JS Variables Quiz",
                                description: "Test your knowledge of JS variables.",
                                difficulty: "Easy",
                                questions: {
                                    create: [
                                        {
                                            text: "Which keyword declares a block-scoped variable?",
                                            explanation: "'let' and 'const' are block-scoped. 'var' is function-scoped.",
                                            options: {
                                                create: [
                                                    { text: "var" },
                                                    { text: "let" },
                                                    { text: "const" },
                                                    { text: "let and const" }, // Correct
                                                ],
                                            },
                                        },
                                        {
                                            text: "What is the data type of `typeof 42`?",
                                            explanation: "All numbers in JS are of type 'number'.",
                                            options: {
                                                create: [
                                                    { text: "number" }, // Correct
                                                    { text: "string" },
                                                    { text: "integer" },
                                                    { text: "boolean" },
                                                ],
                                            },
                                        },
                                        {
                                            text: "Which method adds an element to the end of an array?",
                                            explanation: "push() adds elements to the end of an array.",
                                            options: {
                                                create: [
                                                    { text: "push()" }, // Correct
                                                    { text: "pop()" },
                                                    { text: "shift()" },
                                                    { text: "unshift()" },
                                                ],
                                            },
                                        },
                                        {
                                            text: "What does === check for?",
                                            explanation: "=== checks for both value and type equality.",
                                            options: {
                                                create: [
                                                    { text: "Value equality only" },
                                                    { text: "Type equality only" },
                                                    { text: "Both value and type equality" }, // Correct
                                                    { text: "Reference equality" },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    // Topic 2: Basics (from seed-quizzes.js - Quiz 1)
                    {
                        name: "JavaScript Basics",
                        description: "Basic JavaScript concepts and syntax",
                        quizzes: {
                            create: {
                                title: "JavaScript Basics",
                                description: "Test your knowledge of JavaScript fundamentals",
                                difficulty: "easy",
                                questions: {
                                    create: [
                                        {
                                            text: 'What is the correct way to declare a variable in JavaScript?',
                                            options: {
                                                create: [
                                                    { text: 'var myVar = 5;' },
                                                    { text: 'variable myVar = 5;' },
                                                    { text: 'v myVar = 5;' },
                                                    { text: 'declare myVar = 5;' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'Which of the following is NOT a JavaScript data type?',
                                            options: {
                                                create: [
                                                    { text: 'String' },
                                                    { text: 'Boolean' },
                                                    { text: 'Float' },
                                                    { text: 'Number' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What does "===" operator do in JavaScript?',
                                            options: {
                                                create: [
                                                    { text: 'Assigns a value' },
                                                    { text: 'Compares value and type' },
                                                    { text: 'Compares only value' },
                                                    { text: 'Checks if not equal' }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    // Topic 3: Advanced (from seed-quizzes.js - Quiz 2)
                    {
                        name: "Advanced Concepts",
                        description: "Advanced JavaScript topics",
                        quizzes: {
                            create: {
                                title: "Advanced JavaScript Concepts",
                                description: "Challenge yourself with advanced JavaScript topics",
                                difficulty: "hard",
                                questions: {
                                    create: [
                                        {
                                            text: 'What is a closure in JavaScript?',
                                            options: {
                                                create: [
                                                    { text: 'A function that has access to variables in its outer scope' },
                                                    { text: 'A way to close a program' },
                                                    { text: 'A type of loop' },
                                                    { text: 'A method to hide variables' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What does the "this" keyword refer to in JavaScript?',
                                            options: {
                                                create: [
                                                    { text: 'The current function' },
                                                    { text: 'The global object' },
                                                    { text: 'The object that is executing the current function' },
                                                    { text: 'The parent function' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What is the purpose of Promise in JavaScript?',
                                            options: {
                                                create: [
                                                    { text: 'To handle synchronous operations' },
                                                    { text: 'To handle asynchronous operations' },
                                                    { text: 'To create loops' },
                                                    { text: 'To define variables' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What is event bubbling?',
                                            options: {
                                                create: [
                                                    { text: 'Events propagate from child to parent elements' },
                                                    { text: 'Events propagate from parent to child elements' },
                                                    { text: 'Events are cancelled' },
                                                    { text: 'Events are duplicated' }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    // Topic 4: ES6 (from seed-quizzes.js - Quiz 3)
                    {
                        name: "ES6 Features",
                        description: "Modern JavaScript features",
                        quizzes: {
                            create: {
                                title: "ES6 Features",
                                description: "Modern JavaScript features introduced in ES6",
                                difficulty: "medium",
                                questions: {
                                    create: [
                                        {
                                            text: 'What is the difference between let and const?',
                                            options: {
                                                create: [
                                                    { text: 'let is block-scoped, const is function-scoped' },
                                                    { text: 'const cannot be reassigned, let can be' },
                                                    { text: 'There is no difference' },
                                                    { text: 'let is faster than const' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What is arrow function syntax?',
                                            options: {
                                                create: [
                                                    { text: '() => {}' },
                                                    { text: 'function() {}' },
                                                    { text: '-> {}' },
                                                    { text: 'func => {}' }
                                                ]
                                            }
                                        },
                                        {
                                            text: 'What does the spread operator (...) do?',
                                            options: {
                                                create: [
                                                    { text: 'Multiplies numbers' },
                                                    { text: 'Expands an iterable into individual elements' },
                                                    { text: 'Creates a range' },
                                                    { text: 'Divides arrays' }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
            },
        },
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

    // --- 5. UPDATE correctOptionId ---
    console.log("Updating correctOptionIds for questions...");

    // Helper function to update correct option
    const setCorrectOption = async (question, correctText) => {
        if (!question) return;
        const correctOption = question.options.find(o => o.text === correctText);
        if (correctOption) {
            await prisma.question.update({
                where: { id: question.id },
                data: { correctOptionId: correctOption.id },
            });
        }
    };

    const topics = course1.topics;

    // Topic 1: Variables
    const topic1 = topics.find(t => t.name === "Variables and Data Types");
    if (topic1 && topic1.quizzes.length > 0) {
        const quiz1 = topic1.quizzes[0];
        await setCorrectOption(quiz1.questions.find(q => q.text.includes("block-scoped")), "let and const");
        await setCorrectOption(quiz1.questions.find(q => q.text.includes("typeof 42")), "number");
        await setCorrectOption(quiz1.questions.find(q => q.text.includes("adds an element")), "push()");
        await setCorrectOption(quiz1.questions.find(q => q.text.includes("=== check for")), "Both value and type equality");
    }

    // Topic 2: Basics
    const topic2 = topics.find(t => t.name === "JavaScript Basics");
    if (topic2 && topic2.quizzes.length > 0) {
        const quiz2 = topic2.quizzes[0];
        await setCorrectOption(quiz2.questions.find(q => q.text.includes("declare a variable")), 'var myVar = 5;');
        await setCorrectOption(quiz2.questions.find(q => q.text.includes("NOT a JavaScript data type")), 'Float');
        await setCorrectOption(quiz2.questions.find(q => q.text.includes("=== operator")), 'Compares value and type');
    }

    // Topic 3: Advanced
    const topic3 = topics.find(t => t.name === "Advanced Concepts");
    if (topic3 && topic3.quizzes.length > 0) {
        const quiz3 = topic3.quizzes[0];
        await setCorrectOption(quiz3.questions.find(q => q.text.includes("closure")), 'A function that has access to variables in its outer scope');
        await setCorrectOption(quiz3.questions.find(q => q.text.includes("this")), 'The object that is executing the current function');
        await setCorrectOption(quiz3.questions.find(q => q.text.includes("Promise")), 'To handle asynchronous operations');
        await setCorrectOption(quiz3.questions.find(q => q.text.includes("bubbling")), 'Events propagate from child to parent elements');
    }

    // Topic 4: ES6
    const topic4 = topics.find(t => t.name === "ES6 Features");
    if (topic4 && topic4.quizzes.length > 0) {
        const quiz4 = topic4.quizzes[0];
        await setCorrectOption(quiz4.questions.find(q => q.text.includes("let and const")), 'const cannot be reassigned, let can be');
        await setCorrectOption(quiz4.questions.find(q => q.text.includes("arrow function")), '() => {}');
        await setCorrectOption(quiz4.questions.find(q => q.text.includes("spread operator")), 'Expands an iterable into individual elements');
    }

    console.log("Correct option IDs updated.");

    // --- 6. SEED CODING PROBLEMS ---
    console.log('Seeding coding problems...');
    const problems = [
        {
            title: 'Sum of Two Numbers',
            description: 'Write a function that takes two numbers and returns their sum.',
            difficulty: 'Easy',
            language: 'javascript',
            starterCode: JSON.stringify({
                javascript: `function sum(a, b) {
  // Your code here
  return a + b;
}

// Input handling
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(',').map(Number);
if (input.length >= 2) {
  console.log(sum(input[0], input[1]));
}`,
                python: `import sys

def sum(a, b):
    # Your code here
    return a + b

# Input handling
if __name__ == "__main__":
    input_str = sys.stdin.read().strip()
    if input_str:
        parts = list(map(int, input_str.split(',')))
        if len(parts) >= 2:
            print(sum(parts[0], parts[1]))`
            }),
            xpReward: 50,
            testCases: {
                create: [
                    { input: '1, 2', expected: '3', isHidden: false },
                    { input: '5, 10', expected: '15', isHidden: true },
                ]
            }
        },
        {
            title: 'Reverse String',
            description: 'Write a function that reverses a given string.',
            difficulty: 'Easy',
            language: 'javascript',
            starterCode: JSON.stringify({
                javascript: `function reverseString(str) {
  // Your code here
  return str.split('').reverse().join('');
}

// Input handling
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
// Remove quotes if present
const cleanInput = input.replace(/^"|"$/g, '');
console.log('"' + reverseString(cleanInput) + '"');`,
                python: `import sys

def reverse_string(s):
    # Your code here
    return s[::-1]

# Input handling
if __name__ == "__main__":
    input_str = sys.stdin.read().strip()
    # Remove quotes if present
    clean_input = input_str.strip('"')
    print(f'"{reverse_string(clean_input)}"')`
            }),
            xpReward: 50,
            testCases: {
                create: [
                    { input: '"hello"', expected: '"olleh"', isHidden: false },
                    { input: '"world"', expected: '"dlrow"', isHidden: true },
                ]
            }
        },
        {
            title: 'Palindrome Check',
            description: 'Check if a given string is a palindrome.',
            difficulty: 'Medium',
            language: 'javascript',
            starterCode: JSON.stringify({
                javascript: `function isPalindrome(str) {
  // Your code here
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}

// Input handling
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const cleanInput = input.replace(/^"|"$/g, '');
console.log(isPalindrome(cleanInput));`,
                python: `import sys

def is_palindrome(s):
    # Your code here
    return s == s[::-1]

# Input handling
if __name__ == "__main__":
    input_str = sys.stdin.read().strip()
    clean_input = input_str.strip('"')
    print(str(is_palindrome(clean_input)).lower())`
            }),
            xpReward: 150,
            testCases: {
                create: [
                    { input: '"racecar"', expected: 'true', isHidden: false },
                    { input: '"hello"', expected: 'false', isHidden: true },
                ]
            }
        },
        {
            title: 'Fibonacci Sequence',
            description: 'Return the nth number in the Fibonacci sequence.',
            difficulty: 'Medium',
            language: 'javascript',
            starterCode: JSON.stringify({
                javascript: `function fibonacci(n) {
  // Your code here
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Input handling
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(fibonacci(Number(input)));`,
                python: `import sys

def fibonacci(n):
    # Your code here
    if n <= 1: return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Input handling
if __name__ == "__main__":
    input_str = sys.stdin.read().strip()
    if input_str:
        print(fibonacci(int(input_str)))`
            }),
            xpReward: 150,
            testCases: {
                create: [
                    { input: '5', expected: '5', isHidden: false },
                    { input: '10', expected: '55', isHidden: true },
                ]
            }
        },
        {
            title: 'Two Sum',
            description: 'Find indices of the two numbers such that they add up to a specific target.',
            difficulty: 'Hard',
            language: 'javascript',
            starterCode: JSON.stringify({
                javascript: `function twoSum(nums, target) {
  // Your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Input handling
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
// Expected input format: [2,7,11,15], 9
const parts = input.match(/\\[(.*?)\\],\\s*(\\d+)/);
if (parts) {
  const nums = JSON.parse('[' + parts[1] + ']');
  const target = Number(parts[2]);
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
}`,
                python: `import sys
import json

def two_sum(nums, target):
    # Your code here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Input handling
if __name__ == "__main__":
    input_str = sys.stdin.read().strip()
    # Expected input format: [2,7,11,15], 9
    try:
        # Split by last comma
        last_comma = input_str.rfind(',')
        if last_comma != -1:
            nums_str = input_str[:last_comma].strip()
            target_str = input_str[last_comma+1:].strip()
            nums = json.loads(nums_str)
            target = int(target_str)
            print(json.dumps(two_sum(nums, target)))
    except Exception as e:
        print("[]")`
            }),
            xpReward: 500,
            testCases: {
                create: [
                    { input: '[2,7,11,15], 9', expected: '[0,1]', isHidden: false },
                    { input: '[3,2,4], 6', expected: '[1,2]', isHidden: true },
                ]
            }
        }
    ];

    for (const problem of problems) {
        await prisma.codeProblem.create({
            data: problem
        });
    }
    console.log('Coding problems seeded.');

    // --- 7. SIMULATE A QUIZ ATTEMPT (by Bob) ---
    console.log("Simulating quiz attempt for Bob...");

    // Refetch quiz data to ensure we have the updated correctOptionIds
    const quizToAttempt = await prisma.quiz.findFirst({
        where: { title: "JS Variables Quiz" },
        include: { questions: { include: { options: true } } },
    });

    if (quizToAttempt) {
        // Bob's Answers for Quiz 1
        const q1 = quizToAttempt.questions[0];
        const q2 = quizToAttempt.questions[1];

        // Find options
        const bobAnswerQ1 = q1.options.find(o => o.text === "let and const"); // Correct
        const bobAnswerQ2 = q2.options.find(o => o.text === "string"); // Wrong

        let score = 0;
        const userAnswersData = [];

        if (bobAnswerQ1) {
            const isCorrect = bobAnswerQ1.id === q1.correctOptionId;
            if (isCorrect) score++;
        }

        if (bobAnswerQ2) {
            const isCorrect = bobAnswerQ2.id === q2.correctOptionId;
            if (isCorrect) score++;
        }

        await prisma.attempt.create({
            data: {
                userId: user2.id,
                quizId: quizToAttempt.id,
                finishedAt: new Date(),
                score: score,
                timeTakenSec: 180,
            },
        });
        console.log(`Created attempt for Bob. Score: ${score}`);

        // --- 8. UPDATE USER STATS & LEADERBOARD ---
        console.log("Updating user stats and leaderboard...");
        const xpFromQuiz = score * 10;
        const xpFromBadge = badge1.xpReward;

        // Give Bob the "Quiz Newbie" badge
        await prisma.userAchievement.create({
            data: {
                userId: user2.id,
                achievementId: badge1.id,
            },
        });

        // Update Bob's XP and Level
        const totalXpBob = xpFromQuiz + xpFromBadge;
        await prisma.user.update({
            where: { id: user2.id },
            data: {
                xp: totalXpBob,
                level: 2,
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
    }

    console.log("✅ Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
