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

    useEffect(() => {
        fetchLanguages();
        if (problemId) {
            fetchProblemById(problemId);
        }
    }, [problemId]);

    const fetchLanguages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/code/languages`);
            if (response.data.success) {
                const formattedLangs = response.data.data.map((runtime) => ({
                    language: runtime.language,
                    version: runtime.version,
                    label: runtime.language.charAt(0).toUpperCase() + runtime.language.slice(1),
                }));
                setLanguages(formattedLangs);
                // Default to JS if available
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
    };

    const handleExecute = async () => {
        setIsExecuting(true);
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

        // TODO: Get real userId from Auth Context
        const userId = 'test-user-id';

        setIsExecuting(true);
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

                if (data.gridSize && (data.userPath || data.expectedPath)) {
                    setGridResult({
                        gridSize: data.gridSize,
                        userPath: data.userPath,
                        expectedPath: data.expectedPath,
                        success: response.data.success,
                        message: response.data.message,
                    });
                } else if (data.testResults) {
                    setTestResults(data.testResults);
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
                        {selectedProblem && (
                            <div className="flex items-center gap-3 px-4 py-2 border border-[#333333]">
                                <span className="text-[10px] text-[#555555] uppercase tracking-wider">DIFFICULTY</span>
                                <span className={`text-xs font-bold uppercase ${selectedProblem.difficulty?.toLowerCase() === 'beginner' ? 'text-[#CCFF00]' :
                                    selectedProblem.difficulty?.toLowerCase() === 'intermediate' ? 'text-yellow-400' :
                                        'text-[#FF3333]'
                                    }`}>
                                    {selectedProblem.difficulty || 'UNKNOWN'}
                                </span>
                            </div>
                        )}
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
                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        {/* Problem Description */}
                        <div className="mb-8">
                            <div className="text-[#CCFF00] text-xs tracking-widest mb-4 border-b border-[#333333] pb-2">
                                /// MISSION_BRIEFING
                            </div>
                            {selectedProblem ? (
                                <p className="text-sm text-[#B8B8B8] leading-relaxed whitespace-pre-wrap font-mono">
                                    {selectedProblem.description}
                                </p>
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

                    {/* Action Area */}
                    <div className="p-6 border-t border-[#333333] bg-[#0a0a0a]">
                        <button
                            onClick={handleExecute}
                            disabled={isExecuting || !code}
                            className={`w-full py-4 mb-3 font-bold text-sm uppercase tracking-wider transition-all border border-[#333333]
                                ${isExecuting
                                    ? 'bg-[#333333] text-[#555555] cursor-wait'
                                    : 'bg-[#CCFF00] text-black hover:bg-transparent hover:text-[#CCFF00] hover:border-[#CCFF00]'
                                }
                            `}
                        >
                            {isExecuting ? '> EXECUTING...' : '> RUN_TESTS'}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedProblem || isExecuting}
                            className={`w-full py-4 border font-bold text-sm uppercase tracking-wider transition-all
                                ${!selectedProblem
                                    ? 'border-[#333333] text-[#333333] cursor-not-allowed'
                                    : 'border-[#555555] text-[#F2F2F2] hover:border-[#CCFF00] hover:text-[#CCFF00]'
                                }
                            `}
                        >
                            {status === 'submitting' ? 'UPLOADING...' : 'COMMIT_SOLUTION'}
                        </button>
                    </div>
                </div>

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
        </div>
    );
}