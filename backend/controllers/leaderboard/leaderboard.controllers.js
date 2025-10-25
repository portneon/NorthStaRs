const prisma = require('../../prisma/prisma')


async function getleaderboard(req, res) {
    
    try {
        const data = await prisma.leaderboard.findMany()        
        // console.log(data)
        data.sort((a, b) => b.totalXP -  a.totalXP)
        
        return res.status(200).json(data)
        
    }
    catch (err) {
        return res.status(404).json(`Failed to load leaderboard , ${err}`)
    }
    
    
}
 
module.exports = {
    getleaderboard
}