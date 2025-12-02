'use client';
import React, { useState } from 'react';

/**
 * NOIR DESIGN SYSTEM: Problem Selector
 * Replaces the native select dropdown with a styled custom component.
 */
export default function ProblemSelector({ problems, selectedProblem, onSelect, loading }) {
    const [isOpen, setIsOpen] = useState(false);

    if (loading) {
        return (
            <div className="space-y-2 animate-pulse">
                <div className="h-3 w-24 bg-[#333333]"></div>
                <div className="h-12 w-full bg-[#0a0a0a] border border-[#333333]"></div>
            </div>
        );
    }

    const handleSelect = (problem) => {
        onSelect(problem);
        setIsOpen(false);
    };

    return (
        <div className="relative font-mono text-sm group z-40 mb-8">
            {/* LABEL */}
            <div className="flex justify-between items-end mb-2 border-b border-[#333333] pb-1">
                <span className="text-[#CCFF00] text-[10px] uppercase tracking-widest">
                    {'/// MISSION_SELECT'}
                </span>
                {selectedProblem && (
                    <span className={`text-[9px] font-bold uppercase ${selectedProblem.difficulty === 'beginner' ? 'text-[#CCFF00]' :
                        selectedProblem.difficulty === 'intermediate' ? 'text-yellow-500' : 'text-[#FF3333]'
                        }`}>
                        [{selectedProblem.difficulty}]
                    </span>
                )}
            </div>

            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between p-4
                    bg-[#080808] border border-[#333333]
                    text-left text-[#F2F2F2] transition-all
                    hover:border-[#F2F2F2]
                    focus:outline-none
                    ${isOpen ? 'border-[#F2F2F2]' : ''}
                `}
            >
                <span className="uppercase tracking-wider font-bold truncate pr-4">
                    {selectedProblem?.title || 'SELECT_PROTOCOL...'}
                </span>
                <span className="text-[10px] text-[#555555]">
                    {isOpen ? '▲' : '▼'}
                </span>
            </button>

            {/* DROPDOWN LIST */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-[-1px] bg-[#080808] border border-[#333333] border-t-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,1)] z-50 max-h-80 overflow-y-auto custom-scrollbar">
                    {problems.map((problem) => (
                        <button
                            key={problem.id}
                            onClick={() => handleSelect(problem)}
                            className={`
                                w-full flex items-center justify-between px-4 py-4 text-left
                                border-b border-[#333333] last:border-0
                                transition-colors duration-0
                                group/item
                                ${selectedProblem?.id === problem.id
                                    ? 'bg-[#F2F2F2] text-black'
                                    : 'text-[#888888] hover:bg-[#111111] hover:text-[#F2F2F2]'
                                }
                            `}
                        >
                            <span className="uppercase text-xs font-bold tracking-wider truncate">
                                {problem.title}
                            </span>
                            <span className={`
                                text-[9px] uppercase tracking-widest px-2 py-0.5 border
                                ${selectedProblem?.id === problem.id
                                    ? 'border-black text-black'
                                    : 'border-[#333333] text-[#555555] group-hover/item:border-[#F2F2F2] group-hover/item:text-[#F2F2F2]'
                                }
                            `}>
                                {problem.difficulty.substring(0, 3)}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* DESCRIPTION PANEL */}
            {selectedProblem && (
                <div className="mt-4 p-4 border border-[#333333] bg-[#0a0a0a]">
                    <div className="text-[#555555] text-[10px] uppercase tracking-widest mb-2">
                        OBJECTIVE
                    </div>
                    <p className="text-[#B8B8B8] text-xs leading-relaxed">
                        {selectedProblem.description}
                    </p>
                </div>
            )}

            {/* BACKDROP */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}