"use client";  // important for using hooks in App Router

import { useRouter } from "next/navigation";
export default function Example() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/leaderboard");
  };

  return <button onClick={handleClick}>Go to Leaderboard</button>;
}