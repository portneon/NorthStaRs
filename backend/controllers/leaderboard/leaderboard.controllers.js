const prisma = require('../../prisma/prisma')


async function getleaderboard(req, res) {
    
    try {
        const data = await prisma.user.findMany({
            select: {
              id: true,
              username: true,
              xp: true,
              level: true,
                streakCount: true,
            lastLogin: true,
            },
            orderBy: {
              xp: 'desc' 
            }
          });
        
        return res.status(200).json(data)
        
    }
    catch (err) {
        return res.status(404).json(`Failed to load leaderboard , ${err}`)
    }
    
    
}
 
module.exports = {
    getleaderboard
}