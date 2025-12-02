'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import QuizCard from '@/components/QuizCard';
import NavWrapper from '@/Navwrapper';

export default function QuizPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:3005/quiz');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Ensure data is an array
            setQuizzes(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            setQuizzes([]); // Set to empty array on error
            setLoading(false);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase()) ||
            quiz.description?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || quiz.difficulty?.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto relative">
                {/* Decorative Corner */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-lime-400"></div>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <span className="font-mono text-lime-400 text-xs tracking-widest mb-2 block">{'/// KNOWLEDGE_ARENA'}</span>
                        <h1 className="font-sans font-bold text-5xl md:text-6xl uppercase leading-[0.9] tracking-tighter mb-4">
                            Knowledge Arena
                        </h1>
                        <p className="font-mono text-xs text-zinc-500 max-w-lg">Test your skills and earn XP through interactive quizzes</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-lime-400 transition-colors text-sm font-mono"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-lime-400 transition-colors text-sm font-mono"
                        >
                            <option value="all" className="bg-zinc-900">All Levels</option>
                            <option value="easy" className="bg-zinc-900">Easy</option>
                            <option value="medium" className="bg-zinc-900">Medium</option>
                            <option value="hard" className="bg-zinc-900">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Quiz Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                )}

                {!loading && filteredQuizzes.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-mono text-zinc-500">No quizzes found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
