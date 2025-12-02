const prisma = require('../../prisma/prisma');

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        attempts: {
          include: {
            quiz: true
          },
          orderBy: {
            startedAt: 'desc'
          },
          take: 10
        },
        leaderboard: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // calculate stats
    const totalQuizzes = await prisma.attempt.count({
      where: { userId }
    });

    const avgScore = await prisma.attempt.aggregate({
      where: { userId },
      _avg: { score: true }
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streakCount: user.streakCount,
        lastLogin: user.lastLogin
      },
      stats: {
        totalQuizzes,
        averageScore: avgScore._avg.score || 0,
        rank: user.leaderboard?.rank || null
      },
      badges: user.badges.map(ub => ub.badge),
      recentAttempts: user.attempts
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserModules = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all modules
    const allModules = await prisma.module.findMany({
      include: {
        problems: true,
        progress: {
          where: { userId, completed: true }
        }
      }
    });

    // Deduplicate modules by title (assuming title is unique for content)
    const uniqueModulesMap = new Map();
    allModules.forEach(m => {
      if (!uniqueModulesMap.has(m.title)) {
        uniqueModulesMap.set(m.title, m);
      }
    });
    const modules = Array.from(uniqueModulesMap.values());

    // Get incomplete quiz attempts
    const incompleteAttempts = await prisma.attempt.findMany({
      where: {
        userId,
        isCompleted: false
      },
      include: {
        quiz: {
          include: {
            questions: true
          }
        }
      }
    });

    const formattedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      subTitle: module.subTitle,
      totalProblems: module.problems.length,
      completedProblems: module.progress.length,
      progress: module.problems.length > 0
        ? Math.round((module.progress.length / module.problems.length) * 100)
        : 0,
      isActive: module.progress.length < module.problems.length, // Active if not 100% complete
      type: 'module',
      problems: module.problems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        type: p.problemType
      }))
    }));

    const formattedAttempts = incompleteAttempts.map(attempt => ({
      id: attempt.quiz.id,
      title: attempt.quiz.title,
      subTitle: `Quiz • ${attempt.quiz.difficulty}`,
      totalProblems: attempt.quiz.questions.length,
      completedProblems: 0,
      progress: 0,
      isActive: true,
      type: 'quiz'
    }));

    // Combine and return
    res.json({ success: true, modules: [...formattedModules, ...formattedAttempts] });
  } catch (error) {
    console.error('Error fetching user modules:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        leaderboard: true,
        progress: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate active modules (modules with at least one completed problem)
    const activeModulesCount = await prisma.problemProgress.groupBy({
      by: ['moduleId'],
      where: {
        userId,
        completed: true,
        moduleId: { not: null }
      }
    });

    // Calculate total hours
    const attemptsTime = await prisma.attempt.aggregate({
      where: { userId },
      _sum: { timeTakenSec: true }
    });

    const submissionsTime = await prisma.codeSubmission.aggregate({
      where: { userId },
      _sum: { executionTime: true }
    });

    // executionTime is usually in ms, timeTakenSec is in seconds
    const totalSeconds = (attemptsTime._sum.timeTakenSec || 0) + ((submissionsTime._sum.executionTime || 0) / 1000);
    const totalHours = (totalSeconds / 3600).toFixed(1);

    const xpGoal = (user.level + 1) * 1000; // Example: Level 1 -> 2000 XP goal

    res.json({
      totalHours: totalHours,
      activeModules: activeModulesCount.length,
      globalRank: user.leaderboard?.rank || 0,
      streak: user.streakCount || 0,
      xpGoal: xpGoal
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
