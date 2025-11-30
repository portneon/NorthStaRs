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
    const modules = await prisma.module.findMany({
      include: {
        problems: true,
        progress: {
          where: { userId, completed: true }
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
      isActive: module.progress.length < module.problems.length // Active if not 100% complete
    }));

    res.json({ success: true, modules: formattedModules });
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

    res.json({
      totalHours: '42.5', // Placeholder for now, could be calculated from sessions
      activeModules: activeModulesCount.length,
      globalRank: user.leaderboard?.rank || 0,
      streak: user.streakCount || 0,
      xpGoal: 87 // Placeholder or calculated based on level
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
