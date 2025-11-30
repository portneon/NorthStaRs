'use client';
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ModuleCard from '@/components/ModuleCard';
import { getUserStats, getLeaderboard, getCurrentUser, getUserModules } from '@/app/utils/api';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalHours: '0.0',
    activeModules: '00',
    globalRank: '#---',
    streak: 0,
    xpGoal: 0,
    username: 'Architect',
    level: 1
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current logged-in user
        const currentUser = getCurrentUser();

        if (currentUser && currentUser.id) {
          // Fetch user stats
          const userStats = await getUserStats(currentUser.id);

          // Fetch leaderboard to get user's rank
          const leaderboardData = await getLeaderboard();
          const userRank = leaderboardData.findIndex(u => u.id === currentUser.id) + 1;

          // Fetch user's active modules
          const userModules = await getUserModules(currentUser.id);

          setStats({
            totalHours: userStats.totalHours || 0,
            activeModules: String(userStats.activeModules || 0).padStart(2, '0'),
            globalRank: userRank > 0 ? `#${userRank}` : '#---',
            streak: userStats.streak || 0,
            xpGoal: userStats.xpGoal || 0,
            username: currentUser.username || 'Architect',
            level: currentUser.level || 1
          });
          setModules(userModules);
        } else {
          // Default stats for non-logged-in users
          setStats({
            totalHours: '42.5',
            activeModules: '03',
            globalRank: '#---',
            streak: 14,
            xpGoal: 87,
          });
          setModules([
            { title: "Advanced Algorithms", subTitle: "Module_04", progress: 75 },
            { title: "System Design", subTitle: "Module_02", progress: 30 },
            { title: "React Patterns", subTitle: "Module_09", progress: 12 },
            { title: "Data Structures", subTitle: "Module_01", progress: 100 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Keep default stats on error
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto border-x border-zinc-800">
      <Hero
        streak={stats.streak}
        xpGoal={stats.xpGoal}
        username={stats.username}
        level={stats.level}
      />
      <div className="grid grid-cols-12 border-b border-zinc-800">
        <Stats
          label="TOTAL_HOURS"
          value={loading ? '...' : stats.totalHours}
          trend="+12% vs last week"
          positive={true}
        />
        <Stats
          label="MODULES_ACTIVE"
          value={loading ? '...' : stats.activeModules}
          trend="Optimal Load"
          positive={true}
        />
        <Stats
          label="GLOBAL_RANK"
          value={loading ? '...' : stats.globalRank}
          trend="-4 Positions"
          positive={false}
        />
        <Stats
          label="SYSTEM_STATUS"
          value="ONLINE"
          trend="Latency 12ms"
          positive={true}
        />
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-12 p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Active Curriculum</span>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-lime-400 rounded-full animate-ping"></div>
            <span className="font-mono text-xs text-lime-400">
              {loading ? 'LOADING...' : 'LIVE'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="col-span-12 p-8 text-center font-mono text-zinc-500">
            LOADING_MODULES...
          </div>
        ) : modules.length > 0 ? (
          modules.map((module, idx) => (
            <ModuleCard
              key={module.id || idx}
              span={idx === 0 ? "col-span-12 md:col-span-8 lg:col-span-6" :
                idx === 1 ? "col-span-12 md:col-span-4 lg:col-span-3" :
                  "col-span-12 md:col-span-6 lg:col-span-3"}
              title={module.title}
              sub={module.subTitle}
              progress={module.progress}
            />
          ))
        ) : (
          <div className="col-span-12 p-8 text-center font-mono text-zinc-500">
            NO_ACTIVE_MODULES
          </div>
        )}
        <div className="col-span-12 md:col-span-6 lg:col-span-9 bg-zinc-950 border-r border-b border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-zinc-900 transition-colors cursor-pointer">
          <div>
            <h3 className="font-sans font-bold text-xl md:text-2xl text-white uppercase mb-2">Daily Challenge: <span className="text-lime-400">Binary Inversion</span></h3>
            <p className="font-mono text-xs text-zinc-500 max-w-md">Complete the daily challenge to maintain your streak and earn a 2x XP multiplier.</p>
          </div>
          <div className="w-12 h-12 border border-lime-400 flex items-center justify-center rounded-none group-hover:bg-lime-400 group-hover:text-black transition-all shrink-0">
            <span className="font-bold text-xl">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}