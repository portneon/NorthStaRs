import { getLeaderboard } from "../utils/api";

export default async function Leaderboard() {
  const leaderboard = await getLeaderboard(); // calls the function

  return (
    <div>
      <h1>Leaderboard</h1>
      {leaderboard.map((ele) => (
        <p key={ele.id}>{ele.userId}</p>
      ))}
    </div>
  );
}
