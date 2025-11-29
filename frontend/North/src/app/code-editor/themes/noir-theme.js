import { EditorView } from '@codemirror/view';

/**
 * NOIR Design System Theme for CodeMirror 6
 * Following the "Chaos in a Cage" aesthetic
 */
export const noirTheme = EditorView.theme(
    {
        '&': {
            backgroundColor: '#080808', // Void Black
            color: '#F2F2F2', // Plaster White
            fontSize: '14px',
            fontFamily: '"Space Mono", "Geist Mono", "JetBrains Mono", monospace',
            height: '100%',
            borderRadius: '0', // No rounded corners
        },
        '.cm-content': {
            caretColor: '#CCFF00', // Signal Color
            padding: '16px 0',
        },
        '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#CCFF00',
            borderLeftWidth: '3px', // Thick, visible cursor
        },
        '.cm-selectionBackground, ::selection': {
            backgroundColor: 'rgba(204, 255, 0, 0.15) !important',
        },
        '.cm-focused .cm-selectionBackground, .cm-focused ::selection': {
            backgroundColor: 'rgba(204, 255, 0, 0.2) !important',
        },
        '.cm-activeLine': {
            backgroundColor: 'rgba(204, 255, 0, 0.03)',
            borderLeft: '3px solid #CCFF00',
            paddingLeft: '4px',
        },
        '.cm-gutters': {
            backgroundColor: '#0a0a0a',
            color: '#333333', // Fog Grey
            border: 'none',
            borderRight: '1px solid #333333',
            fontFamily: '"Space Mono", "Geist Mono", monospace',
            fontSize: '12px',
            paddingRight: '8px',
        },
        '.cm-activeLineGutter': {
            backgroundColor: '#0d0d0d',
            color: '#CCFF00', // Signal Color for active line number
        },
        '.cm-lineNumbers .cm-gutterElement': {
            padding: '0 8px',
            minWidth: '40px',
        },
        '.cm-foldGutter': {
            width: '16px',
            color: '#666666',
        },
        '.cm-foldPlaceholder': {
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            color: '#666666',
        },
        '&.cm-focused': {
            outline: '2px solid #CCFF00',
            outlineOffset: '-2px',
        },
        '.cm-scroller': {
            fontFamily: '"Space Mono", "Geist Mono", "JetBrains Mono", monospace',
            lineHeight: '1.6',
        },
        '.cm-line': {
            padding: '0 8px',
        },
        // Syntax highlighting - High contrast NOIR style
        '.cm-keyword': {
            color: '#CCFF00', // Signal Color for keywords
            fontWeight: 'bold',
        },
        '.cm-variableName': {
            color: '#F2F2F2', // Plaster White
        },
        '.cm-propertyName': {
            color: '#E0E0E0',
        },
        '.cm-string': {
            color: '#B8B8B8',
            fontStyle: 'italic',
        },
        '.cm-comment': {
            color: '#555555', // Fog Grey variant
            fontStyle: 'italic',
        },
        '.cm-number': {
            color: '#FFFFFF',
        },
        '.cm-operator': {
            color: '#CCFF00',
        },
        '.cm-bracket, .cm-paren': {
            color: '#999999',
        },
        '.cm-function': {
            color: '#F2F2F2',
            fontWeight: '500',
        },
        '.cm-className': {
            color: '#FFFFFF',
            fontWeight: 'bold',
        },
        '.cm-typeName': {
            color: '#E0E0E0',
        },
        '.cm-matchingBracket': {
            backgroundColor: 'rgba(204, 255, 0, 0.1)',
            outline: '1px solid rgba(204, 255, 0, 0.5)',
        },
        '.cm-nonmatchingBracket': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            outline: '1px solid rgba(255, 0, 0, 0.5)',
        },
        '.cm-searchMatch': {
            backgroundColor: 'rgba(204, 255, 0, 0.2)',
            outline: '1px solid #CCFF00',
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
            backgroundColor: 'rgba(204, 255, 0, 0.3)',
        },
        '.cm-panels': {
            backgroundColor: '#0a0a0a',
            color: '#F2F2F2',
            border: '1px solid #333333',
        },
        '.cm-tooltip': {
            backgroundColor: '#0a0a0a',
            color: '#F2F2F2',
            border: '1px solid #333333',
            borderRadius: '0',
            boxShadow: 'none',
        },
        '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
            backgroundColor: 'rgba(204, 255, 0, 0.1)',
            color: '#CCFF00',
        },
    },
    { dark: true }
);

/**
 * Base editor styles
 */
export const noirEditorStyles = {
    '& .cm-editor': {
        border: '1px solid #333333',
    },
};
