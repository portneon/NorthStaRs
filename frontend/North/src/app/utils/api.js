

export async function getLeaderboard() {
    const res = await fetch('http://localhost:3000/leaderboard', {
      cache: 'no-store', 
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
  
    return res.json();
  }
  


  