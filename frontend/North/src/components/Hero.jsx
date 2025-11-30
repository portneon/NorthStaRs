'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

function Hero({ streak = 0, xpGoal = 0, username = '', level = 1 }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-12 border-b border-zinc-800">
            {/* Intro Page / Main Text Area */}
            <div className="col-span-12 lg:col-span-8 p-6 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950 flex flex-col justify-center min-h-[40vh] md:min-h-[50vh]">
                <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-lime-400 text-[10px] md:text-xs tracking-widest">/// NEXUS_GRID_SYSTEM</span>
                    <span className="font-mono text-zinc-500 text-[10px] md:text-xs tracking-widest">|</span>
                    <span className="font-mono text-zinc-500 text-[10px] md:text-xs tracking-widest">LVL_{String(level).padStart(2, '0')}</span>
                </div>

                <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[0.9] tracking-tighter uppercase mb-8 break-words hyphens-auto">
                    Welcome back,<br className="hidden md:block" /> {username}
                </h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push('/arena')}
                        className="bg-lime-400 text-black px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm font-bold uppercase hover:bg-white transition-colors w-full sm:w-auto text-center"
                    >
                        Resume_Protocol
                    </button>
                    <button
                        onClick={() => router.push('/leaderboard')}
                        className="border border-zinc-700 text-zinc-400 px-6 py-3 md:px-8 md:py-4 font-mono text-xs md:text-sm uppercase hover:border-lime-400 hover:text-lime-400 transition-colors w-full sm:w-auto text-center"
                    >
                        View_Rankings
                    </button>
                </div>
            </div>


            <div className="col-span-12 lg:col-span-4 bg-zinc-900 p-8 flex flex-col justify-between relative overflow-hidden group min-h-[250px] md:min-h-auto border-b border-zinc-800 lg:border-b-0">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(0,0,0,0)_25%,rgba(132,204,22,0.2)_25%,rgba(132,204,22,0.2)_50%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_75%,rgba(132,204,22,0.2)_75%,rgba(132,204,22,0.2)_100%)] bg-[size:40px_40px] animate-[pulse_4s_ease-in-out_infinite]"></div>

                <div className="relative z-10 mt-2">
                    <span className="font-mono text-zinc-500 text-xs block mb-2">CURRENT_STREAK</span>
                    <div className="text-6xl md:text-7xl font-mono text-white font-bold tracking-tighter">
                        {streak}<span className="text-lime-400 text-2xl ml-1">DAYS</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-2 mb-2">
                    <div className="flex justify-between font-mono text-xs text-zinc-400">
                        <span>XP_GOAL</span>
                        <span>{xpGoal}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1">
                        <div className="bg-lime-400 h-1 shadow-[0_0_10px_rgba(132,204,22,0.5)]" style={{ width: `${xpGoal}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Hero;


