"use client";
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ModuleCard from '@/components/ModuleCard';
import IntroPage from '@/components/IntroPage';
import { getUserStats, getLeaderboard, getCurrentUser, getUserModules, getUserAchievements, getProblems } from '@/app/utils/api';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dailyProblem, setDailyProblem] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const currentUser = getCurrentUser();

        if (currentUser && currentUser.id) {
          setIsAuthenticated(true);

          try {
            // Fetch problems to find a daily challenge
            const problems = await getProblems().catch(e => []);
            // Try to find "Binary Inversion" or pick the first one
            const daily = problems.find(p => p.title === 'Binary Inversion') || problems[0];
            setDailyProblem(daily);

            const [userStats, leaderboardData, userModules, userAchievements] = await Promise.all([
              getUserStats(currentUser.id).catch(e => ({})),
              getLeaderboard().catch(e => []),
              getUserModules(currentUser.id).catch(e => []),
              getUserAchievements(currentUser.id).catch(e => [])
            ]);

            const userRank = Array.isArray(leaderboardData)
              ? leaderboardData.findIndex(u => u.id === currentUser.id) + 1
              : 0;

            setStats({
              totalHours: userStats.totalHours || '0.0',
              activeModules: String(userStats.activeModules || 0).padStart(2, '0'),
              globalRank: userRank > 0 ? `#${userRank}` : '#---',
              streak: userStats.streak || 0,
              xpGoal: userStats.xpGoal || 0,
              username: currentUser.username || 'Architect',
              level: currentUser.level || 1
            });
            setModules(userModules || []);
            setAchievements(userAchievements || []);
          } catch (dataError) {
            console.error('Error fetching user dashboard data:', dataError);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      checkAuthAndFetchData();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-lime-400 rounded-full animate-spin"></div>
          <span className="font-mono text-xs text-lime-400 tracking-widest animate-pulse">INITIALIZING...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <IntroPage />;
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto border-x border-zinc-800 bg-zinc-950">
      <Hero
        streak={stats.streak}
        xpGoal={stats.xpGoal}
        username={stats.username}
        level={stats.level}
      />
      <div className="grid grid-cols-12 border-b border-zinc-800">
        <Stats
          label="TOTAL_HOURS"
          value={stats.totalHours}
          trend="+12% vs last week"
          positive={true}
        />
        <Stats
          label="MODULES_ACTIVE"
          value={stats.activeModules}
          trend="Optimal Load"
          positive={true}
        />
        <Stats
          label="GLOBAL_RANK"
          value={stats.globalRank}
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

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="border-b border-zinc-800 bg-[#0a0a0a] p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 bg-[#CCFF00]"></span>
            <h2 className="text-sm font-mono text-[#555555] uppercase tracking-widest">
              Unlocked_Achievements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ua) => (
              <div key={ua.id} className="border border-[#333333] bg-[#080808] p-4 flex items-center gap-4 hover:border-[#CCFF00] transition-colors group">
                <div className="w-10 h-10 border border-[#333333] flex items-center justify-center bg-[#0a0a0a] group-hover:bg-[#CCFF00]/10 transition-colors text-xl">
                  {getIcon(ua.achievement.icon)}
                </div>
                <div>
                  <h3 className="text-white text-xs font-bold uppercase tracking-wide group-hover:text-[#CCFF00] transition-colors">
                    {ua.achievement.name}
                  </h3>
                  <p className="text-[#555555] text-[10px] font-mono mt-1">
                    {new Date(ua.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-12">
        <div className="col-span-12 p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Active Curriculum</span>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-lime-400 rounded-full animate-ping"></div>
            <span className="font-mono text-xs text-lime-400">
              LIVE
            </span>
          </div>
        </div>

        {modules.length > 0 ? (
          modules.map((module, idx) => (
            <ModuleCard
              key={module.id || idx}
              span={idx === 0 ? "col-span-12 md:col-span-8 lg:col-span-6" :
                idx === 1 ? "col-span-12 md:col-span-4 lg:col-span-3 bg-zinc-950 " :
                  "col-span-12 md:col-span-6 lg:col-span-3"}
              title={module.title}
              sub={module.subTitle}
              progress={module.progress}
              onClick={() => {
                if (module.type === 'quiz') {
                  router.push(`/quiz/${module.id}`);
                } else {
                  router.push(`/module/${module.id}`);
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-12 p-8 text-center font-mono text-zinc-500 bg-zinc-950">
            NO_ACTIVE_MODULES
          </div>
        )}

        {/* Daily Challenge Section */}
        <div
          onClick={() => dailyProblem && router.push(`/code-editor?problemId=${dailyProblem.id}`)}
          className="col-span-12 md:col-span-6 lg:col-span-9 bg-zinc-950 border-r border-b border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <div>
            <h3 className="font-sans font-bold text-xl md:text-2xl text-white uppercase mb-2">
              Daily Challenge: <span className="text-lime-400">{dailyProblem ? dailyProblem.title : 'LOADING...'}</span>
            </h3>
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

// Helper to map icon names to emojis or SVGs (duplicated for now, ideally in a utils file)
const getIcon = (iconName) => {
  const icons = {
    trophy: '🏆',
    award: '🎖️',
    crown: '👑',
    star: '⭐',
    flame: '🔥',
    zap: '⚡',
    code: '💻',
    bug: '🐛',
    rocket: '🚀'
  };
  return icons[iconName] || '🏆';
};