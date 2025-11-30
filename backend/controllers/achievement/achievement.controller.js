const prisma = require('../../prisma/prisma');

// Sync achievements based on current user stats
const syncAchievements = async (userId) => {
  try {
    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, streakCount: true }
    });

    if (!user) return;

    // Get quiz/problem counts
    const quizCount = await prisma.attempt.count({
      where: { userId, completed: true }
    });

    const problemCount = await prisma.problemProgress.count({
      where: { userId, completed: true }
    });

    const totalCompleted = quizCount + problemCount;

    // Get all achievements
    const achievements = await prisma.achievement.findMany();

    for (const achievement of achievements) {
      let shouldUnlock = false;

      switch (achievement.triggerType) {
        case 'QUIZ_COMPLETED': // Also covers problems now
          if (achievement.name === 'First Steps' && totalCompleted >= 1) shouldUnlock = true;
          if (achievement.name === 'Quiz Novice' && totalCompleted >= 5) shouldUnlock = true;
          if (achievement.name === 'Quiz Master' && totalCompleted >= 25) shouldUnlock = true;
          break;

        case 'STREAK_UPDATED':
          if (achievement.name === 'Week of Learning' && user.streakCount >= 7) shouldUnlock = true;
          break;

        case 'LEVEL_UP':
          if (achievement.name === 'Rising Star' && user.level >= 5) shouldUnlock = true;
          break;
      }

      if (shouldUnlock) {
        await exports.unlockAchievement(userId, achievement.name);
      }
    }
  } catch (error) {
    console.error('Error syncing achievements:', error);
  }
};

// Get all achievements for a user
exports.getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    // Sync achievements first to ensure they are up to date
    await syncAchievements(userId);

    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: {
        unlockedAt: 'desc'
      }
    });

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

// Check and unlock achievements based on user actions
exports.checkAchievements = async (userId, actionType, actionData) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        triggerType: actionType
      }
    });

    const unlocked = [];

    for (const achievement of achievements) {
      let shouldUnlock = false;

      // Check achievement conditions based on action type
      switch (actionType) {
        case 'QUIZ_COMPLETED':
          // Re-fetch counts to be safe
          const quizCount = await prisma.attempt.count({ where: { userId, completed: true } });
          const problemCount = await prisma.problemProgress.count({ where: { userId, completed: true } });
          const totalCompleted = quizCount + problemCount;

          if (achievement.name === 'First Steps' && totalCompleted >= 1) shouldUnlock = true;
          else if (achievement.name === 'Quiz Novice' && totalCompleted >= 5) shouldUnlock = true;
          else if (achievement.name === 'Quiz Master' && totalCompleted >= 25) shouldUnlock = true;
          else if (achievement.name === 'Perfect Score' && actionData.score === 100) shouldUnlock = true;
          break;

        case 'STREAK_UPDATED':
          if (actionData.streakCount >= 7) {
            shouldUnlock = true;
          }
          break;

        case 'LEVEL_UP':
          if (actionData.level >= 5) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = await exports.unlockAchievement(userId, achievement.name);
        if (unlockedAchievement) {
          unlocked.push(unlockedAchievement);
        }
      }
    }

    return unlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

// Initialize default achievements (run once)
exports.initializeDefaultAchievements = async () => {
  const defaultAchievements = [
    {
      name: 'First Steps',
      description: 'Complete your first quiz',
      icon: 'trophy',
      xpReward: 50,
      triggerType: 'QUIZ_COMPLETED'
    },
    {
      name: 'Quiz Novice',
      description: 'Complete 5 quizzes',
      icon: 'award',
      xpReward: 100,
      triggerType: 'QUIZ_COMPLETED'
    },
    {
      name: 'Quiz Master',
      description: 'Complete 25 quizzes',
      icon: 'crown',
      xpReward: 250,
      triggerType: 'QUIZ_COMPLETED'
    },
    {
      name: 'Perfect Score',
      description: 'Score 100% on a quiz',
      icon: 'star',
      xpReward: 200,
      triggerType: 'QUIZ_COMPLETED'
    },
    {
      name: 'Week of Learning',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      xpReward: 150,
      triggerType: 'STREAK_UPDATED'
    },
    {
      name: 'Rising Star',
      description: 'Reach level 5',
      icon: 'zap',
      xpReward: 200,
      triggerType: 'LEVEL_UP'
    }
  ];

  try {
    for (const achievement of defaultAchievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement
      });
    }
    console.log('Default achievements initialized');
  } catch (error) {
    console.error('Error initializing achievements:', error);
  }
};
