'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import LanguageSelector from './components/LanguageSelector';
import './code-editor.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function CodeEditorPage() {
    const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, NOIR!");');
    const [language, setLanguage] = useState('javascript');
    const [languageVersion, setLanguageVersion] = useState('18.15.0');
    const [languages, setLanguages] = useState([]);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [executionTime, setExecutionTime] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [testResults, setTestResults] = useState(null);

    // Fetch available languages on mount
    useEffect(() => {
        fetchLanguages();
    }, []);

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
            }
        } catch (err) {
            console.error('Failed to fetch languages:', err);
        }
    };

    const handleLanguageChange = (newLang, newVersion) => {
        setLanguage(newLang);
        setLanguageVersion(newVersion);
        // Clear output when changing language
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

        try {
            const startTime = Date.now();
            const response = await axios.post(`${API_BASE_URL}/code/execute`, {
                language,
                version: languageVersion,
                code,
                stdin: '',
            });

            const endTime = Date.now();
            setExecutionTime(endTime - startTime);

            if (response.data.success) {
                const result = response.data.data;
                setOutput(result.stdout || '');
                setError(result.stderr || result.compileOutput || '');
                setStatus(result.success ? 'success' : 'error');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Execution failed');
            setStatus('error');
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="w-full max-w-[1920px] mx-auto min-h-screen bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-800 p-4 bg-zinc-950">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-mono text-lime-400 text-xs tracking-widest">
              /// CODE_EXECUTION_TERMINAL_V1
                        </span>
                        <h1 className="noir-heading text-4xl mt-2">CODE EDITOR</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${isExecuting ? 'bg-lime-400 animate-pulse' : 'bg-zinc-700'}`}></div>
                        <span className="font-mono text-xs text-zinc-500">
                            {isExecuting ? 'EXECUTING...' : 'READY'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 min-h-[calc(100vh-120px)]">
                {/* Left Panel - Controls */}
                <div className="col-span-12 lg:col-span-3 border-r border-zinc-800 bg-zinc-950 p-6">
                    {/* Language Selector */}
                    <div className="mb-6">
                        <label className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                            Language
                        </label>
                        <LanguageSelector
                            value={language}
                            onChange={handleLanguageChange}
                            languages={languages}
                        />
                    </div>

                    {/* Execute Button */}
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting}
                        className={`w-full noir-button mb-4 ${isExecuting ? 'noir-loading' : ''}`}
                    >
                        {isExecuting ? 'EXECUTING...' : '▶ EXECUTE'}
                    </button>

                    {/* Submit Button (placeholder for future) */}
                    <button
                        disabled
                        className="w-full noir-button-secondary opacity-50"
                        title="Load a problem to submit"
                    >
                        SUBMIT CODE
                    </button>

                    {/* Stats */}
                    <div className="mt-8 space-y-3">
                        <div className="border border-zinc-800 p-3">
                            <div className="font-mono text-xs text-zinc-600 mb-1">LANGUAGE</div>
                            <div className="font-mono text-sm text-lime-400 uppercase">{language}</div>
                        </div>
                        <div className="border border-zinc-800 p-3">
                            <div className="font-mono text-xs text-zinc-600 mb-1">VERSION</div>
                            <div className="font-mono text-sm text-zinc-300">{languageVersion}</div>
                        </div>
                        {executionTime !== null && (
                            <div className="border border-zinc-800 p-3">
                                <div className="font-mono text-xs text-zinc-600 mb-1">EXEC_TIME</div>
                                <div className="font-mono text-sm text-zinc-300">{executionTime}ms</div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-8 p-4 border border-zinc-800 bg-zinc-900">
                        <div className="font-mono text-xs text-zinc-600 leading-relaxed">
                            <span className="text-lime-400">NOIR</span> Code Execution System
                            <br />
                            <br />
                            Powered by Piston API
                            <br />
                            40+ Languages Supported
                            <br />
                            <br />
                            <span className="text-zinc-700">/// CHAOS_IN_A_CAGE</span>
                        </div>
                    </div>
                </div>

                {/* Center Panel - Code Editor */}
                <div className="col-span-12 lg:col-span-5 border-r border-zinc-800 flex flex-col">
                    <div className="bg-zinc-950 border-b border-zinc-800 p-3">
                        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              /// EDITOR
                        </span>
                    </div>
                    <div className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
                        <CodeEditor
                            value={code}
                            onChange={(value) => setCode(value)}
                            language={language}
                        />
                    </div>
                </div>

                {/* Right Panel - Output */}
                <div className="col-span-12 lg:col-span-4 flex flex-col">
                    <div style={{ height: 'calc(100vh - 120px)' }}>
                        <OutputPanel
                            output={output}
                            error={error}
                            status={status}
                            executionTime={executionTime}
                            testResults={testResults}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-3 bg-zinc-950">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-700">
                        NorthStaRs // Gamified Learning Platform
                    </span>
                    <span className="font-mono text-xs text-zinc-700">
                        STATUS: ONLINE // LATENCY: 12ms
                    </span>
                </div>
            </div>
        </div>
    );
}
