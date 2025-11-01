import React from "react";

function Ranking({ data }) {
  return (
    <div className="bg-[#111827] min-h-screen w-[95vw] mt-10 flex flex-col items-center mx-auto rounded-tl-[10vw] rounded-br-[10vw] shadow-[0_0_30px_rgba(255,183,77,0.4)] p-6">
      
      {/* Header */}
      <div className="w-full max-w-4xl grid grid-cols-4 text-center text-yellow-400 font-bold text-xl mb-6 border-b border-gray-700 pb-2">
        <p>Rank</p>
        <p>Username</p>
        <p>XP</p>
        <p>Level</p>
      </div>

      {/* Player Cards */}
      <div className="w-full max-w-4xl space-y-4">
        {data.map((player, index) => (
          <div
            key={player.id}
            className="grid grid-cols-4 items-center bg-gray-900 text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <p className="text-center font-semibold text-yellow-300">
              #{index + 4}
            </p>
            
            <div className="text-center">
              <p className="text-lg font-bold">{player.username}</p>
              <p className="text-sm text-gray-400">
                {player.lastLogin ? new Date(player.lastLogin).toLocaleDateString() : "No login data"}
              </p>
            </div>

            <p className="text-center">{player.xp}</p>
            <p className="text-center">{player.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ranking;
