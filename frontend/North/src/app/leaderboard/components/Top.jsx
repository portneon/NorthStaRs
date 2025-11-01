import React from "react";
import "./page.css";

function Top({ data1 = [] }) {
  // If data1 is empty or not yet loaded, show nothing or a loader
  if (!Array.isArray(data1) || data1.length < 3) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading top players...
      </div>
    );
  }

  // Destructure safely
  const [first, second, third] = data1;

  return (
    <div className="top-container">
      {/* Main container for top 3 players */}
      <div className="newclass w-full flex justify-evenly items-center">
        {/* 🥈 Second Place */}
        <div className="flex flex-col items-center text-white">
          <img
            src="https://picsum.photos/seed/2/200/300"
            alt={second.username || "User"}
            className="h-[120px] w-[100px] rounded-full border-4 border-gray-400 shadow-md"
          />
          <p className="text-lg font-semibold mt-2">{second.username || "—"}</p>
          <p className="text-sm text-gray-300">XP: {second.xp ?? 0}</p>
          <p className="text-xs text-gray-500">
            Last Login:{" "}
            {second.lastLogin
              ? new Date(second.lastLogin).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {/* 🥇 First Place */}
        <div className="flex flex-col items-center text-yellow-300 transform -translate-y-6">
          <img
            src="https://picsum.photos/seed/1/200/300"
            alt={first.username || "User"}
            className="h-[150px] w-[130px] rounded-full border-4 border-yellow-400 shadow-lg"
          />
          <p className="text-lg font-bold mt-3">{first.username || "—"}</p>
          <p className="text-sm text-yellow-200">XP: {first.xp ?? 0}</p>
          <p className="text-xs text-gray-400">
            Last Login:{" "}
            {first.lastLogin
              ? new Date(first.lastLogin).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {/* 🥉 Third Place */}
        <div className="flex flex-col items-center text-white">
          <img
            src="https://picsum.photos/seed/3/200/300"
            alt={third.username || "User"}
            className="h-[120px] w-[100px] rounded-full border-4 border-orange-400 shadow-md"
          />
          <p className="text-lg font-semibold mt-2">{third.username || "—"}</p>
          <p className="text-sm text-gray-300">XP: {third.xp ?? 0}</p>
          <p className="text-xs text-gray-500">
            Last Login:{" "}
            {third.lastLogin
              ? new Date(third.lastLogin).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Card below */}
      <div className="hello-card text-black text-center p-4 rounded-xl shadow-xl flex flex-col items-center">
        <img
          src="https://picsum.photos/seed/1/200/300"
          alt={first.username || "User"}
          className="h-[150px] w-[130px] rounded-full  shadow-lg "
        />
        <h1 className="text-2xl font-bold">{second.username}</h1>
        <h1>{second.xp} XP</h1>
        <h2>{new Date(second.lastLogin).toLocaleDateString()}</h2>
        <h3>{second.level}</h3>
      </div>
    </div>
  );
}

export default Top;
