'use client';
import { useEffect, useState } from "react";
import { getLeaderboard } from "../utils/api";
import Top from "./components/Top";
import Ranking from "./components/Ranking";



export default function Leaderboard() {
   // calls the function

  const [leaderboard, setleaderboard] = useState([])
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await getLeaderboard();
        await setleaderboard(response);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    }

    fetchLeaderboard(); 
  }, []);

const data1= leaderboard.slice(0,3)


  return (
    <div className="bg-gray-950 w-full min-h-screen">
      <h1>Leaderboard</h1>
      <Top  data1 = {data1}/>
      <Ranking data = {leaderboard.slice(3)}/>

   

    </div>
  );
}
