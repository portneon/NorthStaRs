/**
 * GridVisualizer Component
 * NOIR DESIGN SYSTEM v1.0
 * "Chaos in a Cage"
 */

import React, { useState, useEffect } from 'react';

export default function GridVisualizer({
    gridSize,
    expectedPath,
    userPath,
    onTryAgain,
    onComplete
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [mismatchIndex, setMismatchIndex] = useState(-1);
    const [status, setStatus] = useState('ready'); // 'ready', 'animating', 'success', 'failed'

    const rows = gridSize?.rows || 5;
    const cols = gridSize?.cols || 5;

    // Check if paths match
    useEffect(() => {
        if (!userPath || !expectedPath) return;

        // Find first mismatch
        for (let i = 0; i < expectedPath.length; i++) {
            if (i >= userPath.length ||
                userPath[i][0] !== expectedPath[i][0] ||
                userPath[i][1] !== expectedPath[i][1]) {
                setMismatchIndex(i);
                return;
            }
        }

        // Check if user path is longer
        if (userPath.length > expectedPath.length) {
            setMismatchIndex(expectedPath.length);
        } else {
            setMismatchIndex(-1); // Paths match!
        }
    }, [userPath, expectedPath]);

    // Animation loop
    useEffect(() => {
        if (!animating || !userPath) return;

        if (currentStep < userPath.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);

                // Check if we reached a mismatch
                if (currentStep + 1 === mismatchIndex) {
                    setAnimating(false);
                    setStatus('failed');
                }
            }, 200); // Faster, snappier steps (200ms)

            return () => clearTimeout(timer);
        } else {
            setAnimating(false);
            const isSuccess = mismatchIndex === -1;
            setStatus(isSuccess ? 'success' : 'failed');
            if (isSuccess && onComplete) {
                setTimeout(onComplete, 1000); // Delay slightly to show success state
            }
        }
    }, [currentStep, animating, userPath, mismatchIndex, onComplete]);

    const startAnimation = () => {
        setCurrentStep(0);
        setAnimating(true);
        setStatus('animating');
    };

    const handleTryAgain = () => {
        setCurrentStep(0);
        setAnimating(false);
        setStatus('ready');
        onTryAgain?.();
    };

    const isCellExpected = (row, col) => {
        if (!expectedPath) return false;
        return expectedPath.some(pos => pos[0] === row && pos[1] === col);
    };

    const getCurrentPosition = () => {
        if (!userPath || currentStep === 0) return gridSize?.startPosition || [0, 0];
        return userPath[Math.min(currentStep - 1, userPath.length - 1)];
    };

    const [toyRow, toyCol] = getCurrentPosition();

    return (
        <div className="bg-[#080808] border border-[#333333] p-6 font-mono relative overflow-hidden">
            {/* Decorative Grid Lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#333333]"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#333333]"></div>

            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333333] pb-4">
                <div>
                    <div className="text-[#CCFF00] text-[10px] tracking-[0.2em] mb-1">
                        /// VISUAL_FEED
                    </div>
                    <h3 className="text-[#F2F2F2] text-xl font-bold uppercase tracking-tight">
                        GRID_SIMULATION
                    </h3>
                </div>

                <div className="flex gap-4 items-center">
                    {!animating && status === 'ready' && userPath && (
                        <button
                            onClick={startAnimation}
                            className="px-6 py-3 bg-[#CCFF00] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                        >
                            {'>'} EXECUTE_SEQUENCE
                        </button>
                    )}

                    {status === 'failed' && (
                        <div className="flex items-center gap-4">
                            <span className="text-[#F2F2F2] text-xs font-mono bg-red-600 px-2 py-1">
                                [ERROR: PATH_DIVERGENCE]
                            </span>
                            <button
                                onClick={handleTryAgain}
                                className="px-4 py-2 border border-[#333333] text-[#555555] text-xs font-bold uppercase tracking-widest hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
                            >
                                // SYSTEM_RESET
                            </button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#CCFF00]"></div>
                            <span className="text-[#CCFF00] text-xs font-bold tracking-widest">
                                SEQUENCE_VERIFIED
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Container */}
            <div className="my-8 flex justify-center relative">
                {/* Glitch Overlay on Failure */}
                {status === 'failed' && (
                    <div className="absolute inset-0 bg-white mix-blend-difference z-50 animate-[glitch_0.2s_ease-in-out_infinite] opacity-10 pointer-events-none"></div>
                )}

                <div
                    className="grid gap-[1px] bg-[#333333] border border-[#333333]"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        width: '100%',
                        maxWidth: '500px',
                        aspectRatio: `${cols}/${rows}`
                    }}
                >
                    {Array.from({ length: rows * cols }).map((_, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const isStart = row === (gridSize?.startPosition?.[0] || 0) &&
                            col === (gridSize?.startPosition?.[1] || 0);
                        const isToyHere = row === toyRow && col === toyCol && (animating || status === 'ready' || status === 'success' || status === 'failed');
                        const isInExpected = isCellExpected(row, col);
                        const isInUserPath = currentStep > 0 && userPath?.some((pos, idx) =>
                            idx < currentStep && pos[0] === row && pos[1] === col
                        );

                        // Base Cell Style
                        let cellContent = null;
                        let cellStyle = "bg-[#080808] relative flex items-center justify-center transition-none"; // No transition for snap effect

                        if (isToyHere) {
                            // The "Cursor" / Toy
                            cellStyle = "bg-[#F2F2F2] text-black z-10";
                            cellContent = <span className="font-bold text-xs tracking-tighter">ACTV</span>;
                        } else if (isStart) {
                            // Start Position
                            cellStyle = "bg-[#333333] text-[#CCFF00]";
                            cellContent = <span className="font-mono text-[10px]">STRT</span>;
                        } else if (isInUserPath) {
                            // Trail
                            cellStyle = "bg-[#CCFF00] text-black";
                            cellContent = <span className="font-mono text-[10px] opacity-50">PATH</span>;
                        } else if (isInExpected) {
                            // Expected Path (Ghost)
                            cellStyle = "bg-[#080808]";
                            cellContent = <div className="w-1.5 h-1.5 bg-[#333333]"></div>;
                        }

                        return (
                            <div key={`${row}-${col}`} className={cellStyle}>
                                {/* Coordinate Label (faint) */}
                                {!isToyHere && !isInUserPath && (
                                    <span className="absolute top-1 left-1 text-[8px] text-[#333333] font-mono">
                                        {row}{col}
                                    </span>
                                )}
                                {cellContent}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Legend */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#333333]">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#333333] border border-[#CCFF00]"></div>
                        <span className="text-[10px] text-[#555555] uppercase tracking-widest">Start</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#080808] border border-[#333333] flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#333333]"></div>
                        </div>
                        <span className="text-[10px] text-[#555555] uppercase tracking-widest">Target_Path</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#CCFF00]"></div>
                        <span className="text-[10px] text-[#555555] uppercase tracking-widest">Active_Trace</span>
                    </div>
                </div>

                <div className="font-mono text-xs text-[#555555]">
                    {animating ? (
                        <span className="text-[#CCFF00] animate-pulse">
                            PROCESSING_STEP: {String(currentStep).padStart(2, '0')}
                        </span>
                    ) : (
                        <span>SYSTEM_IDLE</span>
                    )}
                </div>
            </div>

            {/* Glitch Animation Keyframes */}
            <style jsx>{`
                @keyframes glitch {
                    0% { transform: translate(0) }
                    20% { transform: translate(-2px, 2px) }
                    40% { transform: translate(-2px, -2px) }
                    60% { transform: translate(2px, 2px) }
                    80% { transform: translate(2px, -2px) }
                    100% { transform: translate(0) }
                }
            `}</style>
        </div>
    );
}
