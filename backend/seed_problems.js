const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding coding problems...');

    // Clear existing data to avoid duplicates and FK constraints
    await prisma.problemProgress.deleteMany({});
    await prisma.codeSubmission.deleteMany({});
    await prisma.testCase.deleteMany({});
    await prisma.codeProblem.deleteMany({});

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

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
