import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * ==============================================
 * DESIGN SYSTEM: NOIR STRUCTURE (v1.0)
 * Component: Code Editor Theme
 * "Chaos in a Cage"
 * ==============================================
 */

// --- Palette Definition ---
const colors = {
    voidBlack: '#080808',
    plasterWhite: '#F2F2F2',
    signalColor: '#CCFF00', // Acid Lime
    fogGrey: '#333333',
    subtleGrey: '#555555',
    textGrey: '#B8B8B8',
    errorRed: '#FF3333',
};

// --- Editor Theme ---
export const noirTheme = EditorView.theme(
    {
        '&': {
            backgroundColor: colors.voidBlack,
            color: colors.plasterWhite,
            fontSize: '13px', // Slightly smaller, denser technical feel
            fontFamily: '"Space Mono", "Geist Mono", "JetBrains Mono", monospace',
            height: '100%',
            borderRadius: '0', // REJECT ROUNDED CORNERS
            border: `1px solid ${colors.fogGrey}`, // The "Cage"
        },
        // The "Canvas"
        '.cm-content': {
            caretColor: colors.signalColor,
            padding: '24px 0',
        },
        // The "Signal" Cursor
        '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: colors.signalColor,
            borderLeftWidth: '3px', // Mechanical thickness
        },
        // Selection State (Active Energy)
        '.cm-selectionBackground, ::selection': {
            backgroundColor: 'rgba(204, 255, 0, 0.15) !important', // Lime wash
        },
        '.cm-focused .cm-selectionBackground, .cm-focused ::selection': {
            backgroundColor: 'rgba(204, 255, 0, 0.25) !important', // Brighter when focused
        },
        // Active Line (HUD Highlight)
        '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderLeft: `2px solid ${colors.signalColor}`, // Ticker tape indicator
            paddingLeft: '6px', // Offset for the border
        },
        // The Gutter (Sidebar)
        '.cm-gutters': {
            backgroundColor: colors.voidBlack, // Seamless blend
            color: colors.subtleGrey,
            border: 'none',
            borderRight: `1px solid ${colors.fogGrey}`, // Strict separation
            fontFamily: '"Space Mono", monospace',
            fontSize: '11px',
            paddingRight: '12px',
            letterSpacing: '1px',
        },
        '.cm-activeLineGutter': {
            backgroundColor: 'transparent',
            color: colors.signalColor, // Highlight current line number
            fontWeight: 'bold',
        },
        // Matching Brackets (Linkage)
        '.cm-matchingBracket': {
            backgroundColor: 'rgba(204, 255, 0, 0.2)',
            outline: `1px solid ${colors.signalColor}`,
            color: colors.plasterWhite,
        },
        '.cm-nonmatchingBracket': {
            backgroundColor: 'rgba(255, 51, 51, 0.2)',
            outline: `1px solid ${colors.errorRed}`,
        },
        // Search (Targeting)
        '.cm-searchMatch': {
            backgroundColor: 'rgba(204, 255, 0, 0.2)',
            outline: `1px solid ${colors.signalColor}`,
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
            backgroundColor: colors.signalColor,
            color: colors.voidBlack, // Inverted contrast for active match
        },
        // UI Panels (Find/Replace)
        '.cm-panels': {
            backgroundColor: colors.voidBlack,
            color: colors.plasterWhite,
            borderTop: `1px solid ${colors.signalColor}`, // Signal top border
            borderBottom: `1px solid ${colors.fogGrey}`,
        },
        '.cm-panels-top': {
            borderBottom: `1px solid ${colors.signalColor}`,
        },
        '.cm-panels-bottom': {
            borderTop: `1px solid ${colors.signalColor}`,
        },
        // Tooltips & Autocomplete
        '.cm-tooltip': {
            backgroundColor: '#0F0F0F', // Slightly lighter than void for depth
            color: colors.plasterWhite,
            border: `1px solid ${colors.signalColor}`, // High contrast border
            borderRadius: '0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        },
        '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
            fontFamily: '"Space Mono", monospace',
            fontSize: '12px',
            padding: '4px 8px',
        },
        '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
            backgroundColor: colors.signalColor,
            color: colors.voidBlack, // Inverted active state
        },
    },
    { dark: true }
);

// --- Syntax Highlighting Strategy ---
export const noirHighlightStyle = HighlightStyle.define([
    // Keywords: The "Action" -> Signal Color
    { tag: t.keyword, color: colors.signalColor, fontWeight: 'bold' },
    { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: colors.signalColor },

    // Strings: The "Data" -> Muted / Raw
    { tag: [t.string, t.special(t.string)], color: colors.textGrey, fontStyle: 'italic' },

    // Logic/Operators -> White (Clarity)
    { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: colors.plasterWhite },

    // Functions -> White (Keep it clean, let keywords pop)
    { tag: [t.function(t.variableName), t.variableName], color: colors.plasterWhite },

    // Comments: The "Whisper" -> Dark Grey
    { tag: [t.meta, t.comment], color: colors.subtleGrey, fontStyle: 'italic' },

    // Properties -> Light Grey
    { tag: t.propertyName, color: '#E0E0E0' },

    // Errors -> Signal Red (if you defined one, or standard red)
    { tag: t.invalid, color: colors.errorRed },
]);

export const noirSyntax = syntaxHighlighting(noirHighlightStyle);