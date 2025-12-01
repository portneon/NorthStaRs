'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/app/utils/api';
import { Timer, CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle } from 'lucide-react';
import NavWrapper from '@/Navwrapper';

export default function QuizTakingPage() {
    const params = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuiz();
    }, [params.id]);

    useEffect(() => {
        let interval;
        if (quiz && !result && !isSubmitting) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quiz, result, isSubmitting]);

    const fetchQuiz = async () => {
        try {
            const resp = await fetchWithAuth(`/quiz/${params.id}`);
            if (!resp.ok) throw new Error(`Failed to fetch quiz (${resp.status})`);
            const data = await resp.json();
            setQuiz(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            if (error.code === 'UNAUTHORIZED') {
                // redirect to login
                router.push('/auth/login');
                return;
            }
            setError(error.message || 'Unknown error');
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
                questionId,
                optionId
            }));

            const response = await fetchWithAuth(`/quiz/${params.id}/attempt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizId: params.id,
                    answers: formattedAnswers,
                    timeTaken: timeElapsed
                })
            });

            if (!response.ok) throw new Error('Failed to submit quiz');

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <NavWrapper>
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </NavWrapper>
        );
    }

    if (error) {
        return (
            <NavWrapper>
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                    <div className="text-center">
                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Error</h2>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/quiz')}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </NavWrapper>
        );
    }

    if (result) {
        return (
            <NavWrapper>
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white p-4">
                    <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-lime-500/20 text-lime-400 border border-lime-400/30">
                            <Trophy size={48} />
                        </div>

                        <span className="font-mono text-lime-400 text-xs tracking-widest mb-2 block">/// QUIZ_COMPLETED</span>
                        <h2 className="font-mono text-5xl uppercase leading-[0.9] tracking-tighter mb-4">Quiz Completed!</h2>
                        <p className="font-mono text-xs text-zinc-500 max-w-sm">You have successfully finished the quiz.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-sm text-gray-400 mb-1">Score</div>
                                <div className="text-2xl font-bold text-lime-400">{result.score}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-sm text-gray-400 mb-1">XP Gained</div>
                                <div className="text-2xl font-bold text-lime-400">+{result.xpGained}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/quiz')}
                            className="w-full py-3 bg-lime-600 hover:bg-lime-700 rounded-xl font-mono text-sm transition-colors"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </NavWrapper>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-mono text-3xl md:text-4xl uppercase leading-[0.9] tracking-tighter text-white">{quiz.title}</h1>
                        <div className="font-mono text-xs text-zinc-500 mt-2">QUESTION {currentQuestionIndex + 1} OF {quiz.questions.length}</div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <Timer size={16} className="text-lime-400" />
                        <span className="font-mono text-lime-400">{formatTime(timeElapsed)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-lime-400 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Question Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
                    <h2 className="font-mono text-2xl md:text-3xl leading-relaxed tracking-tight">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option) => {
                            const isSelected = answers[currentQuestion.id] === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                      ${isSelected
                                            ? 'bg-lime-400/20 border-lime-400/50 text-lime-100'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                        }`}
                                >
                                    <span>{option.text}</span>
                                    {isSelected && <CheckCircle size={20} className="text-lime-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm transition-colors
                                ${currentQuestionIndex === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-lime-600 hover:bg-lime-700 text-white uppercase tracking-wider'
                            }`}
                    >
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitting}
                            className={`px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-colors flex items-center gap-2`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            {!isSubmitting && <CheckCircle size={18} />}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors flex items-center gap-2"
                        >
                            Next
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
