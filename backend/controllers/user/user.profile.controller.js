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
