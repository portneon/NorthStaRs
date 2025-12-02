"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/app/utils/api";

function NavBar() {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            return getCurrentUser();
        }
        return null;
    });
    const router = useRouter();
    const pathname = (usePathname() || "").toLowerCase();

    const isActive = (key) => {
        if (key === 'home') return pathname === '/' || pathname.includes('home');
        return pathname.includes(key);
    };

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        // Listen for storage events to update state across tabs/windows
        const handleStorageChange = () => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleStorageChange); // Listen for custom event

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setUser(null);
        setShowLogoutConfirm(false);
        router.push('/auth/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <nav className="border-b border-zinc-800 bg-zinc-950 py-4 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4 md:gap-0">
                <Link href="/" className="flex items-center gap-2 w-full md:w-auto">
                    <div className="w-3 h-3 bg-lime-400"></div>
                    <span className="font-mono text-sm tracking-widest text-zinc-100 uppercase">Nexus_Grid</span>
                </Link>

                <div className="flex gap-6 md:gap-8 font-mono text-xs text-zinc-500 uppercase tracking-wider w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center">
                    <Link href="/" className={`hover:text-lime-400 transition-colors whitespace-nowrap ${isActive('home') ? 'text-lime-400' : ''}`}>
                        Home
                    </Link>
                    <Link href="/leaderboard" className={`hover:text-lime-400 transition-colors whitespace-nowrap ${isActive('leaderboard') ? 'text-lime-400' : ''}`}>
                        Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <span className="text-lime-400 whitespace-nowrap">
                                [{user.username || 'OPERATIVE'}]
                            </span>
                            <button
                                onClick={handleLogoutClick}
                                className="text-zinc-500 hover:text-red-500 transition-colors whitespace-nowrap"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <span className="text-zinc-700 cursor-not-allowed whitespace-nowrap">Profile [LOCKED]</span>
                    )}

                    {/* Auth buttons - Only show if NOT logged in */}
                    {!user && (
                        <div className="flex gap-3 ml-4">
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:border-lime-400 hover:text-lime-400 transition-colors whitespace-nowrap"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-4 py-2 bg-lime-400 text-black hover:bg-white transition-colors whitespace-nowrap font-bold"
                            >
                                Sign_Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Gamified Logout Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        {/* Top Warning Bar */}
                        <div className="h-1 w-full bg-red-500 animate-pulse"></div>

                        <div className="p-8 text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center animate-pulse">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                            </div>

                            <h3 className="font-mono text-xl text-white mb-2 tracking-widest uppercase text-red-500">
                                Terminate Session?
                            </h3>

                            <p className="font-mono text-zinc-500 text-xs mb-8 leading-relaxed">
                                WARNING: DISCONNECTING FROM THE NEURAL GRID WILL PAUSE YOUR SYNC CYCLE. UNSAVED LOCAL DATA MAY BE LOST.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmLogout}
                                    className="w-full py-3 bg-red-500/10 border border-red-500 text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
                                >
                                    Confirm_Disconnect
                                </button>
                                <button
                                    onClick={cancelLogout}
                                    className="w-full py-3 border border-zinc-800 text-zinc-400 font-mono text-xs uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
                                >
                                    Abort_Sequence
                                </button>
                            </div>
                        </div>

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></div>
                    </div>
                </div>
            )}
        </>
    )
};

export default NavBar;