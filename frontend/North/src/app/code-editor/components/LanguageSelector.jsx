'use client';
import React, { useState, useEffect } from 'react';

/**
 * LanguageSelector Component
 * Dropdown for selecting programming languages
 */
const LanguageSelector = ({ value, onChange, languages = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Default popular languages if none provided
    const defaultLanguages = [
        { language: 'javascript', version: '18.15.0', label: 'JavaScript' },
        { language: 'python', version: '3.10.0', label: 'Python' },
        { language: 'java', version: '15.0.2', label: 'Java' },
        { language: 'cpp', version: '10.2.0', label: 'C++' },
        { language: 'c', version: '10.2.0', label: 'C' },
        { language: 'go', version: '1.16.2', label: 'Go' },
        { language: 'rust', version: '1.68.2', label: 'Rust' },
        { language: 'typescript', version: '5.0.3', label: 'TypeScript' },
    ];

    const availableLanguages = languages.length > 0 ? languages : defaultLanguages;

    const currentLang = availableLanguages.find((l) => l.language === value) || availableLanguages[0];

    const handleSelect = (lang) => {
        onChange(lang.language, lang.version);
        setIsOpen(false);
    };

    return (
        <div className="language-selector relative">
            {/* Selector Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 font-mono text-sm text-zinc-200 hover:border-lime-400 transition-none flex items-center justify-between group"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-lime-400"></div>
                    <span className="uppercase tracking-widest">{currentLang?.label || 'Select Language'}</span>
                </div>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Dropdown Menu - Snap animation */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-zinc-950 border border-zinc-800 z-50 max-h-80 overflow-auto shadow-2xl">
                    {availableLanguages.map((lang, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(lang)}
                            className={`w-full px-4 py-3 font-mono text-sm text-left border-b border-zinc-800 transition-none
                ${lang.language === value
                                    ? 'bg-lime-400 bg-opacity-10 text-lime-400 border-l-2 border-l-lime-400'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-lime-400'
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="uppercase tracking-wider">{lang.label}</span>
                                <span className="text-xs text-zinc-600">{lang.version}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default LanguageSelector;
