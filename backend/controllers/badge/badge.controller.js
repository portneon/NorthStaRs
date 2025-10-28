const prisma = require('../../prisma/prisma');

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await prisma.badge.findMany();
    res.json(badges);
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });
    
    res.json(userBadges.map(ub => ub.badge));
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkAndAwardBadges = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        attempts: true,
        badges: {
          include: {
            badge: true
          }
        }
      }
    });
    
    if (!user) return;
    
    const userBadgeIds = user.badges.map(ub => ub.badgeId);
    const totalAttempts = user.attempts.length;
    const totalXP = user.xp;
    
    // Quiz Newbie badge - first quiz completed
    if (totalAttempts >= 1 && !userBadgeIds.includes('quiz-newbie')) {
      const badge = await prisma.badge.findFirst({
        where: { name: 'Quiz Newbie' }
      });
      
      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id
          }
        });
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: badge.xpReward }
          }
        });
      }
    }
    
    // Quiz Master badge - 10 quizzes completed
    if (totalAttempts >= 10 && !userBadgeIds.includes('quiz-master')) {
      const badge = await prisma.badge.findFirst({
        where: { name: 'Quiz Master' }
      });
      
      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id
          }
        });
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: badge.xpReward }
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Badge check error:', error);
  }
};
