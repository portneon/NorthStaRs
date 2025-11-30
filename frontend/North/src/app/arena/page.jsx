'use client';
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function ArenaPage() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const user = getCurrentUser();
            const userId = user ? user.id : '';

            // Using fetch instead of axios to ensure it works in preview if axios fails
            const response = await fetch(`${API_BASE_URL}/code/problems?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setProblems(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch problems:', err);
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    const levels = {
        beginner: problems.filter(p => p.difficulty === 'beginner'),
        intermediate: problems.filter(p => p.difficulty === 'intermediate'),
        advanced: problems.filter(p => p.difficulty === 'advanced'),
    };

    const levelConfig = {
        beginner: {
            id: 'LVL_01',
            name: 'INITIATE',
            desc: 'FUNDAMENTAL LOGIC GATES',
            clearance: 'UNRESTRICTED',
        },
        intermediate: {
            id: 'LVL_02',
            name: 'OPERATIVE',
            desc: 'ADVANCED ALGORITHMIC WARFARE',
            clearance: 'RESTRICTED',
        },
        advanced: {
            id: 'LVL_03',
            name: 'VANGUARD',
            desc: 'ELITE SYSTEM ARCHITECTURE',
            clearance: 'CLASSIFIED',
        },
    };

    return (
        <div className="min-h-screen bg-[#080808] text-[#F2F2F2] font-mono selection:bg-[#CCFF00] selection:text-black flex flex-col">

            <div className="border-b border-[#333333] grid grid-cols-12 bg-[#080808] sticky top-0 z-50">
                <div className="col-span-12 md:col-span-4 lg:col-span-3 p-6 border-r border-[#333333] flex flex-col justify-between">
                    <span className="text-[#CCFF00] text-[10px] tracking-[0.3em] uppercase">
                        /// SECTOR_04: ARENA
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mt-2 leading-[0.85]">
                        Battle<br />Ground
                    </h1>
                </div>

                <div className="col-span-12 md:col-span-8 lg:col-span-9 p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0a0a0a]">
                    <div className="max-w-xl">
                        <p className="text-xs text-[#555555] leading-relaxed mb-2">
                            [MISSION BRIEFING]
                        </p>
                        <p className="text-sm text-[#B8B8B8] leading-relaxed uppercase">
                            Engage in tactical coding challenges. Select your clearance level to access classified protocols. Efficiency is mandatory.
                        </p>
                    </div>
                    <a
                        href="/"
                        className="px-6 py-3 border border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] text-xs font-bold uppercase tracking-widest transition-all group flex items-center gap-3 bg-[#080808]"
                    >
                        <span className="text-[#CCFF00] group-hover:-translate-x-1 transition-transform">←</span>
                        RTB_BASE
                    </a>
                </div>
            </div>

            {/* --- MAIN CONTENT yaha hai  */}
            <div className="flex-1 max-w-[1920px] mx-auto w-full grid grid-cols-12">

                {loading && (
                    <div className="col-span-12 p-24 text-center">
                        <div className="inline-block w-4 h-4 bg-[#CCFF00] animate-spin mb-4"></div>
                        <div className="text-[#CCFF00] text-xs tracking-[0.2em] animate-pulse">
                            DECRYPTING_BATTLE_DATA...
                        </div>
                    </div>
                )}

                {!loading && (
                    <>
                        {Object.entries(levels).map(([difficulty, problemsList], index) => {
                            const config = levelConfig[difficulty] || { id: 'UNK', name: 'UNKNOWN', desc: 'DATA_CORRUPTED', clearance: 'NONE' };
                            const isLocked = problemsList.length === 0;
                            const isSelected = selectedLevel === difficulty;

                            return (
                                <div
                                    key={difficulty}
                                    className={`
                                        col-span-12 lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#333333] 
                                        relative group transition-all duration-300 flex flex-col
                                        ${isSelected ? 'bg-[#0a0a0a]' : 'bg-[#080808] hover:bg-[#0c0c0c]'}
                                        ${isLocked ? 'opacity-50 grayscale pointer-events-none' : 'cursor-pointer'}
                                    `}
                                    onClick={() => !isLocked && setSelectedLevel(isSelected ? null : difficulty)}
                                >
                                    {/* Active Marker */}
                                    {isSelected && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00]"></div>
                                    )}

                                    {/* Level Header */}
                                    <div className="p-8 md:p-12 border-b border-[#333333] flex-1 relative overflow-hidden">
                                        {/* Background Grid for Level Card */}
                                        {isSelected && (
                                            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(#CCFF00_1px,transparent_1px),linear-gradient(90deg,#CCFF00_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                                        )}

                                        <div className="flex justify-between items-start mb-12 relative z-10">
                                            <span className={`text-[10px] uppercase tracking-[0.2em] border px-2 py-1 ${isSelected ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-[#333333] text-[#555555]'}`}>
                                                {config.id}
                                            </span>
                                            <span className="text-[10px] text-[#555555] uppercase">
                                                {problemsList.length} PROTOCOLS
                                            </span>
                                        </div>

                                        <h2 className={`relative z-10 text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 ${isSelected ? 'text-white' : 'text-[#888] group-hover:text-white'}`}>
                                            {config.name}
                                        </h2>

                                        <p className="relative z-10 text-xs text-[#555555] uppercase tracking-wide mb-8 group-hover:text-[#888] transition-colors">
                                            {config.desc}
                                        </p>

                                        <div className="space-y-1 relative z-10">
                                            <div className="flex justify-between text-[10px] uppercase text-[#333333]">
                                                <span>Clearance</span>
                                                <span>{config.clearance}</span>
                                            </div>
                                            <div className="w-full h-[2px] bg-[#1a1a1a]">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isLocked ? 'w-0 bg-[#333333]' : `bg-[#CCFF00] ${isSelected ? 'w-full' : 'w-1/3 group-hover:w-2/3'}`}`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isSelected ? 'max-h-[800px]' : 'max-h-0'}`}>
                                        <div className="bg-[#050505] relative">
                                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#555_1px,transparent_1px),linear-gradient(90deg,#555_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                                            <div className="p-4 border-b border-[#333333] relative z-10 bg-[#050505]/80 backdrop-blur-sm">
                                                <span className="text-[#CCFF00] text-[10px] tracking-widest uppercase flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse"></div>
                                                    /// AVAILABLE_MISSIONS
                                                </span>
                                            </div>

                                            {problemsList.map((problem, idx) => (
                                                <a
                                                    key={problem.id}
                                                    href={`/code-editor?problemId=${problem.id}`}
                                                    className="block group/mission border-b border-[#333333] last:border-0 hover:bg-[#0F0F0F] transition-all relative z-10"
                                                >
                                                    <div className="flex items-center p-5 gap-5">
                                                        <div className={`flex flex-col items-center justify-center w-8 h-8 border transition-colors bg-[#080808] ${problem.isSolved ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-[#333333] group-hover/mission:border-[#CCFF00] text-[#555555] group-hover/mission:text-[#CCFF00]'}`}>
                                                            {problem.isSolved ? (
                                                                <span className="text-xs">✓</span>
                                                            ) : (
                                                                <span className="font-mono text-[10px]">
                                                                    {(idx + 1).toString().padStart(2, '0')}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className={`text-sm font-bold uppercase tracking-wide transition-colors ${problem.isSolved ? 'text-[#CCFF00] line-through decoration-[#CCFF00]/50' : 'text-white group-hover/mission:text-[#CCFF00]'}`}>
                                                                    {problem.title}
                                                                </h3>
                                                                {problem.isSolved && (
                                                                    <span className="text-[9px] bg-[#CCFF00]/10 text-[#CCFF00] px-1 border border-[#CCFF00]/30">
                                                                        COMPLETED
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`text-[9px] uppercase tracking-widest ${difficulty === 'beginner' ? 'text-emerald-500/70' :
                                                                difficulty === 'intermediate' ? 'text-yellow-500/70' : 'text-red-500/70'
                                                                }`}>
                                                                // {difficulty}
                                                            </span>
                                                        </div>

                                                        <span className="text-[#333333] group-hover/mission:text-[#CCFF00] text-xs transition-transform group-hover/mission:translate-x-1 font-bold">
                                                            [EXEC]
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interaction Prompt */}
                                    {!isSelected && !isLocked && (
                                        <div className="p-4 text-center border-t border-[#333333] bg-[#0a0a0a]">
                                            <span className="text-[10px] uppercase tracking-widest text-[#555555] group-hover:text-[#CCFF00] transition-colors">
                                                [CLICK TO EXPAND SECTOR]
                                            </span>
                                        </div>
                                    )}

                                    {isLocked && (
                                        <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-[2px] flex items-center justify-center border border-[#333333]">
                                            <div className="border border-[#333333] bg-[#0a0a0a] px-6 py-4 text-center">
                                                <span className="block text-2xl mb-2 text-[#333333]">🔒</span>
                                                <span className="text-[10px] uppercase tracking-widest text-[#555555]">
                                                    ACCESS_DENIED
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>


            <div className="border-t border-[#333333] bg-[#080808] p-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#333333]">
                <span>Sys_Ver: 4.9.2</span>
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#CCFF00] animate-pulse"></span>
                    Connected to Neural_Net
                </span>
            </div>
        </div>
    );
}