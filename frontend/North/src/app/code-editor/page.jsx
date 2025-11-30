'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

// Tere existing components imports
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import LanguageSelector from './components/LanguageSelector';
import GridVisualizer from '@/components/GridVisualizer/GridVisualizer';
import XPNotification from '@/components/XPNotification';
import AchievementNotification from '@/components/AchievementNotification';
import CompletionModal from '@/components/CompletionModal';
import { getCurrentUser } from '@/app/utils/api';

// CSS hata diya kyunki ab hum Tailwind use kar rahe hain Noir look ke liye
// import './code-editor.css'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function CodeEditorPage() {
    const searchParams = useSearchParams();
    const problemId = searchParams.get('problemId');

    // --- State Logic (Same as your original code) ---
    const [code, setCode] = useState('// INITIALIZING_EDITOR...');
    const [language, setLanguage] = useState('javascript');
    const [languageVersion, setLanguageVersion] = useState('18.15.0');
    const [languages, setLanguages] = useState([]);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [executionTime, setExecutionTime] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const [selectedProblem, setSelectedProblem] = useState(null);
    const [loadingProblem, setLoadingProblem] = useState(false);
    const [gridResult, setGridResult] = useState(null);
    const [xpNotification, setXpNotification] = useState(null);
    const [newAchievement, setNewAchievement] = useState(null);
    const [showHints, setShowHints] = useState(false);
    const [showHintConfirmation, setShowHintConfirmation] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [isSubmission, setIsSubmission] = useState(false);

    const fetchLanguages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/code/languages`);
            if (response.data.success) {
                const allowedLangs = ['javascript', 'python'];
                const formattedLangs = response.data.data
                    .filter(runtime => allowedLangs.includes(runtime.language))
                    .map((runtime) => ({
                        language: runtime.language,
                        version: runtime.version,
                        label: runtime.language.charAt(0).toUpperCase() + runtime.language.slice(1),
                    }));
                setLanguages(formattedLangs);
                const js = formattedLangs.find(l => l.language === 'javascript');
                if (js) {
                    setLanguage(js.language);
                    setLanguageVersion(js.version);
                }
            }
        } catch (err) {
            console.error('Failed to fetch languages:', err);
        }
    };

    useEffect(() => {
        fetchLanguages();
        if (problemId) {
            fetchProblemById(problemId);
            setShowHints(false); // Reset hints when problem changes
        }
    }, [problemId]);



    const fetchProblemById = async (id) => {
        setLoadingProblem(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/code/problems/${id}`);
            if (response.data.success) {
                const problem = response.data.data;
                setSelectedProblem(problem);

                if (problem.starterCode) {
                    try {
                        const starterCodeObj = typeof problem.starterCode === 'string'
                            ? JSON.parse(problem.starterCode)
                            : problem.starterCode;

                        const starter = starterCodeObj[language] || starterCodeObj.javascript || '// Code goes here';
                        setCode(starter);
                    } catch (e) {
                        console.error("Error parsing starter code");
                    }
                } else {
                    setCode('// Write your solution here...');
                }
            }
        } catch (err) {
            console.error('Failed to fetch problem:', err);
            setError('CRITICAL_FAILURE: MISSION_DATA_CORRUPTED');
        } finally {
            setLoadingProblem(false);
        }
    };

    const handleLanguageChange = (newLang, newVersion) => {
        setLanguage(newLang);
        setLanguageVersion(newVersion);
        setOutput('');
        setError('');
        setTestResults(null);

        // Update starter code for the new language
        if (selectedProblem && selectedProblem.starterCode) {
            try {
                const starterCodeObj = typeof selectedProblem.starterCode === 'string'
                    ? JSON.parse(selectedProblem.starterCode)
                    : selectedProblem.starterCode;

                const starter = starterCodeObj[newLang] || starterCodeObj.javascript || '// Code goes here';
                setCode(starter);
            } catch (e) {
                console.error("Error updating starter code for new language", e);
            }
        }
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        setIsSubmission(false);
        setOutput('');
        setError('');
        setStatus('executing');
        setExecutionTime(null);
        setTestResults(null);
        setGridResult(null);

        try {
            const startTime = Date.now();
            const response = await axios.post(`${API_BASE_URL}/code/execute`, {
                language,
                version: languageVersion,
                code,
                stdin: '',
                problemId: selectedProblem?.id // Send problemId for grid validation
            });

            const endTime = Date.now();
            setExecutionTime(endTime - startTime);

            if (response.data.success) {
                const result = response.data.data;
                setOutput(result.stdout || '');
                setError(result.stderr || result.compileOutput || '');
                setStatus(result.success ? 'success' : 'error');

                // Handle grid result if present
                if (result.gridResult) {
                    setGridResult(result.gridResult);
                }
            } else {
                setError(response.data.message || 'Execution failed');
                setStatus('error');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'EXECUTION_FAILED');
            setStatus('error');
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedProblem) return;

        // Get real userId from Auth Context
        const currentUser = getCurrentUser();
        const userId = currentUser ? currentUser.id : null;

        if (!userId) {
            setError('AUTHENTICATION_REQUIRED: PLEASE_LOGIN');
            setStatus('error');
            return;
        }

        setIsExecuting(true);
        setIsSubmission(true);
        setOutput('');
        setError('');
        setStatus('submitting');
        setGridResult(null);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/code/submit/${selectedProblem.id}`,
                {
                    userId,
                    language,
                    version: languageVersion,
                    code,
                }
            );

            if (response.data.success) {
                const data = response.data.data;
                setTestResults(data.testResults || null);

                // Show XP notification if XP was awarded
                if (data.xpAwarded > 0) {
                    const user = getCurrentUser();
                    // We need to fetch the updated user to get the new level
                    // For now, we can just increment locally or fetch user again
                    // Let's just show the XP gained
                    setXpNotification({
                        xp: data.xpAwarded,
                        level: null // We could pass new level if backend returned it
                    });
                }

                // Show Achievement notification if any
                if (data.newAchievements && data.newAchievements.length > 0) {
                    // Show the first one for now, or queue them
                    setNewAchievement(data.newAchievements[0]);
                }

                if (data.gridResult) {
                    setGridResult(data.gridResult);
                } else {
                    // For standard problems, show completion modal after 5 seconds
                    setTimeout(() => {
                        setShowCompletionModal(true);
                    }, 5000);
                }

                setOutput(response.data.message || 'SUBMISSION_LOGGED');
                setStatus('success');
            } else {
                setError(response.data.message || 'SUBMISSION_REJECTED');
                setStatus('error');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'TRANSMISSION_FAILED');
            setStatus('error');
        } finally {
            setIsExecuting(false);
        }
    };

    const handleTryAgain = () => {
        setGridResult(null);
        setOutput('');
        setError('');
        setStatus('');
    };

    // --- JSX RENDER (NOIR THEME APPLIED) ---
    return (
        <div className="w-full max-w-[1920px] mx-auto min-h-screen bg-[#080808] text-[#F2F2F2] font-mono selection:bg-[#CCFF00] selection:text-black flex flex-col">

            {/* XP Notification */}
            {xpNotification && (
                <XPNotification
                    xp={xpNotification.xp}
                    level={xpNotification.level}
                    onClose={() => setXpNotification(null)}
                />
            )}

            {/* Achievement Notification */}
            {newAchievement && (
                <AchievementNotification
                    achievement={newAchievement}
                    onClose={() => setNewAchievement(null)}
                />
            )}

            {/* Header */}
            <div className="border-b border-[#333333] p-4 bg-[#080808]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/arena"
                            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8B8B8] hover:text-[#CCFF00] transition-colors border border-[#333333] px-3 py-2 bg-transparent"
                        >
                            <span className="text-[#CCFF00] group-hover:-translate-x-1 transition-transform">←</span>
                            Return_Arena
                        </Link>

                        <div className="h-8 w-[1px] bg-[#333333]"></div>

                        <div>
                            <span className="block text-[#CCFF00] text-[10px] tracking-[0.2em] mb-1">
                                /// ACTIVE_PROTOCOL
                            </span>
                            {loadingProblem ? (
                                <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-[#555555] animate-pulse">
                                    ESTABLISHING_UPLINK...
                                </h1>
                            ) : selectedProblem ? (
                                <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-white">
                                    {selectedProblem.title}
                                </h1>
                            ) : (
                                <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-[#555555]">
                                    NO_MISSION_SELECTED
                                </h1>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Action Buttons - Moved to Header */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExecute}
                                disabled={isExecuting || !code}
                                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all border border-[#333333]
                                    ${isExecuting
                                        ? 'bg-[#333333] text-[#555555] cursor-wait'
                                        : 'bg-[#CCFF00] text-black hover:bg-transparent hover:text-[#CCFF00] hover:border-[#CCFF00]'
                                    }
                                `}
                            >
                                {isExecuting ? 'EXECUTING...' : 'RUN_TESTS'}
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={!selectedProblem || isExecuting}
                                className={`px-4 py-2 border font-bold text-xs uppercase tracking-wider transition-all
                                    ${!selectedProblem
                                        ? 'border-[#333333] text-[#333333] cursor-not-allowed'
                                        : 'border-[#555555] text-[#F2F2F2] hover:border-[#CCFF00] hover:text-[#CCFF00]'
                                    }
                                `}
                            >
                                {status === 'submitting' ? 'UPLOADING...' : 'COMMIT'}
                            </button>
                        </div>

                        <div className="h-8 w-[1px] bg-[#333333]"></div>

                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 ${isExecuting ? 'bg-[#CCFF00] animate-ping' : 'bg-[#333333]'}`}></div>
                            <span className="text-xs text-[#555555] tracking-widest">
                                {isExecuting ? 'PROCESSING...' : 'SYSTEM_IDLE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 flex-1">

                {/* Left Panel: Briefing & Controls */}
                <div className="col-span-12 lg:col-span-3 border-r border-[#333333] bg-[#080808] flex flex-col h-full">

                    {/* Action Area Removed from here */}

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        {/* Problem Description */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between border-b border-[#333333] pb-2 mb-4">
                                <div className="text-[#CCFF00] text-xs tracking-widest">
                                    /// MISSION_BRIEFING
                                </div>
                                {selectedProblem && (
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 border border-[#333333] ${selectedProblem.difficulty?.toLowerCase() === 'beginner' ? 'text-[#CCFF00]' :
                                        selectedProblem.difficulty?.toLowerCase() === 'intermediate' ? 'text-yellow-400' :
                                            'text-[#FF3333]'
                                        }`}>
                                        {selectedProblem.difficulty || 'UNKNOWN'}
                                    </span>
                                )}
                            </div>

                            {selectedProblem ? (
                                <div className="space-y-6">
                                    {/* Description */}
                                    <p className="text-sm text-[#B8B8B8] leading-relaxed whitespace-pre-wrap font-mono">
                                        {selectedProblem.description}
                                    </p>

                                    {/* Instructions */}
                                    {selectedProblem.instructions && (
                                        <div>
                                            <div className="text-[#555555] text-[10px] uppercase tracking-widest mb-2">
                                                /// OBJECTIVES
                                            </div>
                                            <p className="text-xs text-[#999999] leading-relaxed whitespace-pre-wrap font-mono border-l-2 border-[#333333] pl-3">
                                                {selectedProblem.instructions}
                                            </p>
                                        </div>
                                    )}

                                    {/* Hints (Tactical Intel) */}
                                    {selectedProblem.hints && selectedProblem.hints.length > 0 && (
                                        <div>
                                            <div
                                                onClick={() => !showHints && setShowHintConfirmation(true)}
                                                className={`text-[10px] uppercase tracking-widest mb-2 flex items-center justify-between cursor-pointer group ${showHints ? 'text-[#CCFF00]' : 'text-[#555555] hover:text-[#B8B8B8]'}`}
                                            >
                                                <span>/// TACTICAL_INTEL {showHints ? '[DECRYPTED]' : '[ENCRYPTED]'}</span>
                                                {!showHints && <span className="text-[8px] border border-[#333] px-1 group-hover:border-[#555]">CLICK_TO_DECRYPT</span>}
                                            </div>

                                            {showHints ? (
                                                <ul className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {selectedProblem.hints.map((hint, idx) => (
                                                        <li key={idx} className="text-xs text-[#B8B8B8] flex gap-2">
                                                            <span className="text-[#CCFF00]">{'>'}</span>
                                                            {hint}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="h-8 border border-dashed border-[#333333] flex items-center justify-center bg-[#0a0a0a]/50">
                                                    <span className="text-[10px] text-[#333333]">DATA_OBFUSCATED</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-[#555555] italic">Select a protocol from the Arena to begin...</div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div className="mb-8">
                            <div className="text-[#CCFF00] text-xs tracking-widest mb-4 border-b border-[#333333] pb-2">
                                /// RUNTIME_ENV
                            </div>
                            <LanguageSelector
                                value={language}
                                onChange={handleLanguageChange}
                                languages={languages}
                            />
                        </div>
                    </div>
                </div>

                {/* Hint Confirmation Modal */}
                {showHintConfirmation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#0a0a0a] border border-[#CCFF00] p-6 max-w-sm w-full shadow-[0_0_30px_rgba(204,255,0,0.1)] relative">
                            <div className="text-[#CCFF00] text-xs tracking-widest mb-4 border-b border-[#333333] pb-2">
                                /// SECURITY_PROTOCOL
                            </div>
                            <p className="text-sm text-[#B8B8B8] mb-6 font-mono">
                                Decrypting tactical intel may reduce mission rating. Are you sure you want to proceed?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowHints(true);
                                        setShowHintConfirmation(false);
                                    }}
                                    className="flex-1 py-2 bg-[#CCFF00] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                                >
                                    Decrypt
                                </button>
                                <button
                                    onClick={() => setShowHintConfirmation(false)}
                                    className="flex-1 py-2 border border-[#333333] text-[#555555] font-bold text-xs uppercase tracking-wider hover:border-[#555] hover:text-[#B8B8B8] transition-colors"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Center Panel: Editor */}
                <div className="col-span-12 lg:col-span-5 border-r border-[#333333] flex flex-col bg-[#080808] min-h-[500px]">
                    <div className="border-b border-[#333333] p-2 flex justify-between items-center bg-[#0a0a0a]">
                        <span className="text-[#555555] text-[10px] uppercase tracking-widest px-4">
                            /// SOURCE_CODE_EDITOR
                        </span>
                        <div className="flex gap-2 px-2">
                            <div className="w-2 h-2 bg-[#333333]"></div>
                            <div className="w-2 h-2 bg-[#333333]"></div>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        {/* Assuming CodeEditor accepts className or style props, wrapper helps enforce dark bg */}
                        <div className="absolute inset-0 bg-[#080808]">
                            <CodeEditor
                                value={code}
                                onChange={(value) => setCode(value)}
                                language={language}
                            />
                        </div>
                    </div>

                    {/* Editor Footer Stats */}
                    <div className="border-t border-[#333333] p-2 flex gap-4 text-[10px] text-[#555555] font-mono bg-[#080808]">
                        <span>LN: {code.split('\n').length}</span>
                        <span>CH: {code.length}</span>
                        <span>UTF-8</span>
                    </div>
                </div>

                {/* Right Panel: Output & Visualization */}
                <div className="col-span-12 lg:col-span-4 flex flex-col bg-[#080808]">
                    <div className="border-b border-[#333333] p-2 bg-[#0a0a0a]">
                        <span className="text-[#555555] text-[10px] uppercase tracking-widest px-4">
                            /// SYSTEM_OUTPUT
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                        <div className="h-full flex flex-col">
                            {/* Standard Output Panel */}
                            <OutputPanel
                                output={output}
                                error={error}
                                status={status}
                                executionTime={executionTime}
                                testResults={testResults}
                            />

                            {/* Grid Visualizer (If active) */}
                            {gridResult && (
                                <div className="border-t border-[#333333] p-6 bg-[#0a0a0a]">
                                    <div className="text-[#CCFF00] text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                                        /// VISUAL_FEED
                                    </div>
                                    <GridVisualizer
                                        gridSize={gridResult.gridSize}
                                        expectedPath={gridResult.expectedPath}
                                        userPath={gridResult.userPath}
                                        onTryAgain={handleTryAgain}
                                        onComplete={() => isSubmission && setTimeout(() => setShowCompletionModal(true), 5000)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#333333] p-3 bg-[#080808]">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#555555]">
                        NorthStaRs // Gamified Learning Platform
                    </span>
                    <span className="font-mono text-xs text-[#555555]">
                        STATUS: ONLINE // LATENCY: 12ms
                    </span>
                </div>
            </div>

            {/* Completion Modal */}
            {showCompletionModal && (
                <CompletionModal onClose={() => setShowCompletionModal(false)} />
            )}
        </div>
    );
}