'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Code, CheckCircle, Lock } from 'lucide-react';
import { fetchWithAuth } from '@/app/utils/api';

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchModule(params.id);
        }
    }, [params.id]);

    const fetchModule = async (id) => {
        try {
            // We need an endpoint to get a single module. 
            // If it doesn't exist, we might need to create it or use an existing one.
            // For now, let's assume we can fetch it via a new endpoint or filter from all.
            // Since we don't have a direct "get module by id" public endpoint yet, 
            // we might need to add one or use the user modules list.
            // Let's try to fetch user modules and find it.
            const response = await fetchWithAuth(`/user/${JSON.parse(localStorage.getItem('user')).id}/modules`);
            if (response.ok) {
                const data = await response.json();
                const found = data.modules.find(m => m.id === id);
                if (found) {
                    // This only gives summary. We need details (problems).
                    // We should probably add a specific endpoint for module details.
                    // For now, let's mock the details or fetch problems if we can.
                    setModule(found);
                }
            }

            // BETTER APPROACH: Add a backend route GET /module/:id
            // I will implement that next.
        } catch (error) {
            console.error('Error fetching module:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
                <button
                    onClick={() => router.push('/')}
                    className="text-lime-400 hover:underline"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-lime-400 transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    <span className="font-mono text-xs tracking-widest">RETURN_DASHBOARD</span>
                </button>

                <div className="mb-12">
                    <span className="font-mono text-lime-400 text-xs tracking-widest mb-2 block">{'/// MODULE_CORE'}</span>
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">{module.title}</h1>
                    <p className="text-zinc-500 max-w-2xl">{module.subTitle}</p>
                </div>

                <div className="grid gap-4">
                    {module.problems && module.problems.length > 0 ? (
                        module.problems.map((problem) => (
                            <div
                                key={problem.id}
                                onClick={() => router.push(`/code-editor?problemId=${problem.id}`)}
                                className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-lime-400 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-lime-400 transition-colors">{problem.title}</h3>
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] uppercase px-2 py-1 rounded border ${problem.difficulty === 'easy' ? 'border-green-500 text-green-500' :
                                                problem.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' :
                                                    'border-red-500 text-red-500'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                            <span className="text-[10px] uppercase px-2 py-1 rounded border border-zinc-700 text-zinc-500">
                                                {problem.type || 'STANDARD'}
                                            </span>
                                        </div>
                                    </div>
                                    <Code className="text-zinc-500 group-hover:text-lime-400 transition-colors" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                            <p className="text-zinc-500 font-mono text-sm">No problems found in this module.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
