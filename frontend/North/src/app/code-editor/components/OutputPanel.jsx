'use client';
import React from 'react';

/**
 * OutputPanel Component
 * Displays code execution output with NOIR design
 */
const OutputPanel = ({ output, error, status, executionTime, testResults }) => {
    const hasOutput = output || error || testResults;

    // Glitch animation class for errors
    const glitchClass = error
        ? 'animate-[glitch_0.3s_ease-in-out]'
        : '';

    return (
        <div className="output-panel h-full flex flex-col border border-zinc-800">
            {/* Header */}
            <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                    {'/// OUTPUT_TERMINAL'}
                </span>
                {executionTime !== null && executionTime !== undefined && (
                    <span className="font-mono text-xs text-zinc-600">
                        {executionTime}ms
                    </span>
                )}
            </div>

            {/* Output Content */}
            <div className="flex-1 bg-zinc-950 p-4 overflow-auto font-mono text-sm">
                {!hasOutput && (
                    <div className="text-zinc-600 italic">
                        {'// Awaiting execution...'}
                    </div>
                )}

                {/* Stdout */}
                {output && (
                    <div className="text-zinc-200 whitespace-pre-wrap mb-4">
                        {output}
                    </div>
                )}

                {/* Stderr/Errors with glitch effect */}
                {error && (
                    <div
                        className={`text-red-500 whitespace-pre-wrap mb-4 ${glitchClass}`}
                        style={{
                            textShadow: error ? '2px 0 #ff0000, -2px 0 #00ff00' : 'none',
                        }}
                    >
                        <span className="text-lime-400">ERROR:</span> {error}
                    </div>
                )}

                {/* Test Results */}
                {testResults && (
                    <div className="space-y-2">
                        <div className="border-b border-zinc-800 pb-2 mb-3">
                            <span className="text-lime-400 font-bold">
                                TEST_RESULTS: {testResults.passedTests}/{testResults.totalTests}
                            </span>
                            {testResults.allPassed && (
                                <span className="ml-3 text-lime-400">[ALL_PASSED]</span>
                            )}
                        </div>

                        {testResults.results.map((result, idx) => (
                            <div
                                key={idx}
                                className={`border-l-2 pl-3 py-2 ${result.passed
                                    ? 'border-lime-400 bg-lime-400 bg-opacity-5'
                                    : 'border-red-500 bg-red-500 bg-opacity-5'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className={`w-3 h-3 ${result.passed ? 'bg-lime-400' : 'bg-red-500'
                                            }`}
                                    ></span>
                                    <span className="text-xs text-zinc-500">
                                        TEST_CASE_{String(idx + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-xs mt-2 space-y-1">
                                    <div className="text-zinc-600">
                                        Expected: <span className="text-zinc-400">{result.expected}</span>
                                    </div>
                                    <div className="text-zinc-600">
                                        Actual: <span className={result.passed ? "text-zinc-400" : "text-red-400"}>
                                            {result.actual === "" ? <span className="italic opacity-50">No output</span> : result.actual}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Status indicator */}
                {status && (
                    <div className="mt-4 pt-3 border-t border-zinc-800">
                        <span className={`font-mono text-xs ${status === 'PASSED' || status === 'success'
                            ? 'text-lime-400'
                            : status === 'FAILED' || status === 'error'
                                ? 'text-red-500'
                                : 'text-zinc-500'
                            }`}>
                            STATUS: {status.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputPanel;
