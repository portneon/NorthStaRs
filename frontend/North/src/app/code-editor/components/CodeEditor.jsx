'use client';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { noirTheme, noirSyntax } from '../themes/noir-theme';

/**
 * CodeEditor Component
 * CodeMirror 6 wrapper with NOIR theme
 * 
 * 
 */
const CodeEditor = ({ value,
    onChange,
    language = 'javascript',
    readOnly = false,
    placeholder = '// Start coding...',
}) => {
    const getLanguageExtension = (lang) => {
        const languageMap = {
            javascript: javascript({ jsx: true, typescript: false }),
            typescript: javascript({ jsx: true, typescript: true }),
            python: python(),
            java: java(),
            cpp: cpp(),
            c: cpp(),
        };

        return languageMap[lang] || javascript();
    };

    return (
        <div className="code-editor-wrapper w-full h-full">
            <CodeMirror
                value={value}
                height="100%"
                theme={noirTheme}
                extensions={[getLanguageExtension(language), noirSyntax]}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: false,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    searchKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                }}
                style={{
                    fontSize: '14px',
                    fontFamily: 'Space Mono, Geist Mono, JetBrains Mono, monospace',
                    height: '100%',
                    width: '100%',
                }}
            />
        </div>
    );
};

export default CodeEditor;
