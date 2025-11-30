'use client';
import React from 'react';

export default function IntroPage() {
    return (
        <div className="min-h-screen bg-[#080808] text-[#F2F2F2] font-mono selection:bg-[#CCFF00] selection:text-black flex flex-col overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <div className="grid grid-cols-12 border-b border-[#333333] min-h-[85vh]">

                {/* Left: Main Content */}
                <div className="col-span-12 lg:col-span-8 p-8 md:p-16 lg:p-24 border-r border-[#333333] flex flex-col justify-center relative overflow-hidden">
                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-2 bg-[#CCFF00] animate-pulse"></div>
                            <span className="text-[#CCFF00] text-xs tracking-[0.2em] uppercase">
                                System_Ready // V.1.0.0
                            </span>
                        </div>

                        <h1 className="font-sans font-black text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter mb-8 text-white">
                            ESCAPE<br />
                            TUTORIAL<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#CCFF00] to-transparent opacity-80">
                                HELL
                            </span>
                        </h1>

                        <p className="text-[#888888] text-sm md:text-base max-w-xl leading-relaxed mb-12 border-l border-[#333333] pl-6">
                            Stop watching videos. Start shipping logic.
                            We turned Data Structures & Algorithms into a high-stakes strategy game.
                            Write code, control the grid, and watch your skills actually deploy.
                            <br /><br />
                            <span className="text-[#555555] text-xs">/// INITIALIZING_NEURAL_UPLINK...</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <a
                                href="/auth/signup"
                                className="group relative px-8 py-4 bg-[#CCFF00] text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors block text-center sm:inline-block"
                            >
                                <span className="relative z-10">Start_Career_Mode</span>
                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-0"></div>
                            </a>

                            <a
                                href="/auth/login"
                                className="group px-8 py-4 border border-[#333333] text-[#888888] font-bold text-sm tracking-widest uppercase hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Continue_Run</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right: Visuals / Stats */}
                <div className="col-span-12 lg:col-span-4 bg-[#0a0a0a] flex flex-col">

                    {/* Stat Block 1 */}
                    <div className="flex-1 border-b border-[#333333] p-12 flex flex-col justify-center relative group">
                        <div className="absolute top-4 right-4 text-[10px] text-[#555555]">ACTIVE_CODERS</div>
                        <div className="text-5xl font-bold text-white mb-2 group-hover:text-[#CCFF00] transition-colors">
                            14,209
                        </div>
                        <div className="text-xs text-[#555555] tracking-widest uppercase">
                            Currently Solving
                        </div>
                    </div>

                    {/* Stat Block 2 */}
                    <div className="flex-1 border-b border-[#333333] p-12 flex flex-col justify-center relative group">
                        <div className="absolute top-4 right-4 text-[10px] text-[#555555]">BUGS_SQUASHED</div>
                        <div className="text-5xl font-bold text-white mb-2 group-hover:text-[#CCFF00] transition-colors">
                            8.4M+
                        </div>
                        <div className="text-xs text-[#555555] tracking-widest uppercase flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></span>
                            Live_Metrics
                        </div>
                    </div>

                    {/* Decorative Grid */}
                    <div className="h-32 bg-[#080808] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#CCFF00_1px,transparent_1px),linear-gradient(90deg,#CCFF00_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        <div className="absolute bottom-0 left-0 p-4 font-mono text-[10px] text-[#333333]">
                            /// GAME_ENGINE_ACTIVE
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#333333]">

                {/* Feature 01 */}
                <div className="group p-12 border-b md:border-b-0 md:border-r border-[#333333] hover:bg-[#0a0a0a] transition-colors relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    <div className="w-12 h-12 border border-[#333333] flex items-center justify-center mb-8 group-hover:border-[#CCFF00] transition-colors bg-[#080808]">
                        <span className="text-[#555555] text-sm group-hover:text-[#CCFF00]">01</span>
                    </div>

                    <h3 className="font-sans font-bold text-2xl text-white mb-4 uppercase">
                        Visual Logic
                    </h3>
                    <p className="text-[#888888] text-xs leading-relaxed">
                        Stop staring at console logs. Visualize your code execution. Control bots, solve mazes, and see exactly where your logic breaks.
                    </p>
                </div>

                {/* Feature 02 */}
                <div className="group p-12 border-b md:border-b-0 md:border-r border-[#333333] hover:bg-[#0a0a0a] transition-colors relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>

                    <div className="w-12 h-12 border border-[#333333] flex items-center justify-center mb-8 group-hover:border-[#CCFF00] transition-colors bg-[#080808]">
                        <span className="text-[#555555] text-sm group-hover:text-[#CCFF00]">02</span>
                    </div>

                    <h3 className="font-sans font-bold text-2xl text-white mb-4 uppercase">
                        Proof of Work
                    </h3>
                    <p className="text-[#888888] text-xs leading-relaxed">
                        Your rank isn't just a number. It's a verified record of complex problems you've solved. Perfect for your portfolio.
                    </p>
                </div>

                {/* Feature 03 */}
                <div className="group p-12 hover:bg-[#0a0a0a] transition-colors relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>

                    <div className="w-12 h-12 border border-[#333333] flex items-center justify-center mb-8 group-hover:border-[#CCFF00] transition-colors bg-[#080808]">
                        <span className="text-[#555555] text-sm group-hover:text-[#CCFF00]">03</span>
                    </div>

                    <h3 className="font-sans font-bold text-2xl text-white mb-4 uppercase">
                        Actually Fun
                    </h3>
                    <p className="text-[#888888] text-xs leading-relaxed">
                        Unlock artifacts, maintain streaks, and beat boss levels. Learning feels less like homework and more like a raid.
                    </p>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="p-6 flex justify-between items-center text-[10px] text-[#333333] uppercase tracking-widest">
                <div>© 2024 NEXUS_GRID // GAMIFIED_LEARNING</div>
                <div className="hidden md:block">SERVER_STATUS: OPTIMAL</div>
            </footer>
        </div>
    );
}