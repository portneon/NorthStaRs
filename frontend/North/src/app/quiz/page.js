'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, AlertCircle, BookOpen, Trophy } from 'lucide-react';
import QuizCard from '@/components/QuizCard';
import NavWrapper from '@/Navwrapper';

// Type definitions for better type safety
/**
 * @typedef {Object} Option
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {Option[]} options
 * @property {string} [correctOptionId]
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {'easy' | 'medium' | 'hard'} difficulty
 * @property {Question[]} questions
 * @property {string} [topicId]
 * @property {Object} topic
 * @property {string} topic.name
 * @property {boolean} [isDaily]
 */

// Mock quiz data (matching seed-quizzes.js structure)
const mockQuizzes = [
    {
        id: 'seed-quiz-1',
        title: 'JavaScript Basics',
        description: 'Test your knowledge of JavaScript fundamentals',
        difficulty: 'easy',
        topicId: 'js-fundamentals',
        topic: { name: 'JavaScript Fundamentals' },
        questions: [
            {
                id: 'q1',
                text: 'What is the correct way to declare a variable in JavaScript?',
                options: [
                    { id: 'opt1', text: 'var myVar = 5;' },
                    { id: 'opt2', text: 'variable myVar = 5;' },
                    { id: 'opt3', text: 'v myVar = 5;' },
                    { id: 'opt4', text: 'declare myVar = 5;' }
                ],
                correctOptionId: 'opt1'
            },
            {
                id: 'q2',
                text: 'Which of the following is NOT a JavaScript data type?',
                options: [
                    { id: 'opt1', text: 'String' },
                    { id: 'opt2', text: 'Boolean' },
                    { id: 'opt3', text: 'Float' },
                    { id: 'opt4', text: 'Number' }
                ],
                correctOptionId: 'opt3'
            },
            {
                id: 'q3',
                text: 'What does "===" operator do in JavaScript?',
                options: [
                    { id: 'opt1', text: 'Assigns a value' },
                    { id: 'opt2', text: 'Compares value and type' },
                    { id: 'opt3', text: 'Compares only value' },
                    { id: 'opt4', text: 'Checks if not equal' }
                ],
                correctOptionId: 'opt2'
            }
        ],
        isDaily: false
    },
    {
        id: 'seed-quiz-2',
        title: 'Advanced JavaScript Concepts',
        description: 'Challenge yourself with advanced JavaScript topics',
        difficulty: 'hard',
        topicId: 'js-fundamentals',
        topic: { name: 'JavaScript Fundamentals' },
        questions: [
            {
                id: 'q1',
                text: 'What is a closure in JavaScript?',
                options: [
                    { id: 'opt1', text: 'A function that has access to variables in its outer scope' },
                    { id: 'opt2', text: 'A way to close a program' },
                    { id: 'opt3', text: 'A type of loop' },
                    { id: 'opt4', text: 'A method to hide variables' }
                ],
                correctOptionId: 'opt1'
            },
            {
                id: 'q2',
                text: 'What does the "this" keyword refer to in JavaScript?',
                options: [
                    { id: 'opt1', text: 'The current function' },
                    { id: 'opt2', text: 'The global object' },
                    { id: 'opt3', text: 'The object that is executing the current function' },
                    { id: 'opt4', text: 'The parent function' }
                ],
                correctOptionId: 'opt3'
            },
            {
                id: 'q3',
                text: 'What is the purpose of Promise in JavaScript?',
                options: [
                    { id: 'opt1', text: 'To handle synchronous operations' },
                    { id: 'opt2', text: 'To handle asynchronous operations' },
                    { id: 'opt3', text: 'To create loops' },
                    { id: 'opt4', text: 'To define variables' }
                ],
                correctOptionId: 'opt2'
            },
            {
                id: 'q4',
                text: 'What is event bubbling?',
                options: [
                    { id: 'opt1', text: 'Events propagate from child to parent elements' },
                    { id: 'opt2', text: 'Events propagate from parent to child elements' },
                    { id: 'opt3', text: 'Events are cancelled' },
                    { id: 'opt4', text: 'Events are duplicated' }
                ],
                correctOptionId: 'opt1'
            }
        ],
        isDaily: false
    },
    {
        id: 'seed-quiz-3',
        title: 'ES6 Features',
        description: 'Modern JavaScript features introduced in ES6',
        difficulty: 'medium',
        topicId: 'js-fundamentals',
        topic: { name: 'JavaScript Fundamentals' },
        questions: [
            {
                id: 'q1',
                text: 'What is the difference between let and const?',
                options: [
                    { id: 'opt1', text: 'let is block-scoped, const is function-scoped' },
                    { id: 'opt2', text: 'const cannot be reassigned, let can be' },
                    { id: 'opt3', text: 'There is no difference' },
                    { id: 'opt4', text: 'let is faster than const' }
                ],
                correctOptionId: 'opt2'
            },
            {
                id: 'q2',
                text: 'What is arrow function syntax?',
                options: [
                    { id: 'opt1', text: '() => {}' },
                    { id: 'opt2', text: 'function() {}' },
                    { id: 'opt3', text: '-> {}' },
                    { id: 'opt4', text: 'func => {}' }
                ],
                correctOptionId: 'opt1'
            }
        ],
        isDaily: false
    }
];

export default function QuizPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [useMockData, setUseMockData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            // First, fetch the quizzes with their basic info
            const response = await fetch('http://localhost:3005/quiz');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            
            // Ensure we have an array of quizzes
            const quizzes = Array.isArray(data) ? data : [];
            
            // For each quiz, fetch its questions and options
            const quizzesWithDetails = await Promise.all(quizzes.map(async (quiz) => {
                try {
                    const quizResponse = await fetch(`http://localhost:3005/quiz/${quiz.id}`);
                    if (quizResponse.ok) {
                        const quizDetails = await quizResponse.json();
                        return {
                            ...quiz,
                            questions: quizDetails.questions || []
                        };
                    }
                    return quiz;
                } catch (e) {
                    console.error(`Error fetching details for quiz ${quiz.id}:`, e);
                    return quiz;
                }
            }));
            
            setQuizzes(quizzesWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quizzes from backend, using mock data:', error);
            setQuizzes(mockQuizzes);
            setUseMockData(true);
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
                
                {/* Mock Data Warning */}
                {useMockData && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                        <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-medium">Using Mock Data</p>
                            <p className="text-sm opacity-80">Couldn't connect to the backend. Using mock quiz data for demonstration.</p>
                        </div>
                    </div>
                )}

                {/* Quiz Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-lime-500/10 rounded-lg">
                                <BookOpen size={20} className="text-lime-400" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Total Quizzes</p>
                                <p className="text-2xl font-bold">{quizzes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Sparkles size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Total Questions</p>
                                <p className="text-2xl font-bold">
                                    {quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Trophy size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Topics</p>
                                <p className="text-2xl font-bold">
                                    {new Set(quizzes.map(q => q.topicId).filter(Boolean)).size || 1}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
