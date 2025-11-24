import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { MarkdownPreview } from './MarkdownPreview';
const formatDateTime = (value) => new Date(value).toLocaleString();
const applyFormatting = (action, textarea) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let result = textarea.value;
    let newStart = start;
    let newEnd = end;
    const wrapSelection = (prefix, suffix = prefix) => {
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        result = `${before}${prefix}${selectedText}${suffix}${after}`;
        newStart = start + prefix.length;
        newEnd = newStart + selectedText.length;
    };
    switch (action.type) {
        case 'wrap':
            wrapSelection(action.prefix, action.suffix);
            break;
        case 'insertHeading': {
            const lines = textarea.value.split('\n');
            const currentLineIndex = textarea.value.substring(0, start).split('\n').length - 1;
            lines[currentLineIndex] = `${'#'.repeat(action.level)} ${selectedText || lines[currentLineIndex]}`;
            result = lines.join('\n');
            const lineStart = lines.slice(0, currentLineIndex).join('\n').length + (currentLineIndex > 0 ? 1 : 0);
            newStart = lineStart;
            newEnd = lineStart + lines[currentLineIndex].length;
            break;
        }
        case 'insertBlockquote': {
            const before = textarea.value.substring(0, start);
            const after = textarea.value.substring(end);
            const text = selectedText || 'Quote';
            result = `${before}> ${text}\n${after}`;
            newStart = before.length + 2;
            newEnd = newStart + text.length;
            break;
        }
        case 'insertList': {
            const before = textarea.value.substring(0, start);
            const after = textarea.value.substring(end);
            const text = selectedText || 'List item';
            result = `${before}- ${text}\n${after}`;
            newStart = before.length + 2;
            newEnd = newStart + text.length;
            break;
        }
    }
    textarea.value = result;
    textarea.selectionStart = newStart;
    textarea.selectionEnd = newEnd;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
};
export const NoteEditor = ({ note, onChange }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef(null);
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
    }, [note.id, note.title, note.content]);
    const debouncedSave = useDebouncedCallback(async (changes) => {
        setIsSaving(true);
        try {
            await onChange(note.id, changes);
        }
        finally {
            setIsSaving(false);
        }
    }, 600);
    useEffect(() => {
        debouncedSave({ title });
    }, [title, debouncedSave]);
    useEffect(() => {
        debouncedSave({ content });
    }, [content, debouncedSave]);
    const toolbarActions = useMemo(() => [
        {
            label: 'Bold',
            onClick: () => textareaRef.current && applyFormatting({ type: 'wrap', prefix: '**' }, textareaRef.current)
        },
        {
            label: 'Italic',
            onClick: () => textareaRef.current && applyFormatting({ type: 'wrap', prefix: '*' }, textareaRef.current)
        },
        {
            label: 'Code',
            onClick: () => textareaRef.current && applyFormatting({ type: 'wrap', prefix: '`' }, textareaRef.current)
        },
        {
            label: 'H2',
            onClick: () => textareaRef.current && applyFormatting({ type: 'insertHeading', level: 2 }, textareaRef.current)
        },
        {
            label: 'Quote',
            onClick: () => textareaRef.current && applyFormatting({ type: 'insertBlockquote' }, textareaRef.current)
        },
        {
            label: 'List',
            onClick: () => textareaRef.current && applyFormatting({ type: 'insertList' }, textareaRef.current)
        }
    ], []);
    return (_jsxs("div", { className: "flex h-full flex-col gap-6", children: [_jsxs("header", { className: "flex flex-col gap-2 border-b border-surface-border pb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("input", { type: "text", value: title, onChange: (event) => setTitle(event.target.value), placeholder: "Note title", className: "w-full flex-1 rounded-md border border-transparent bg-transparent text-2xl font-semibold text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary", "aria-label": "Note title" }), _jsx("button", { type: "button", className: "ml-4 rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10", onClick: () => {
                                    void onChange(note.id, { pinned: !note.pinned });
                                }, "aria-pressed": note.pinned, "aria-label": note.pinned ? 'Unpin note' : 'Pin note', children: note.pinned ? 'Unpin' : 'Pin' })] }), _jsxs("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: ["Created ", formatDateTime(note.createdAt), " \u2022 Last updated ", formatDateTime(note.updatedAt)] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-slate-500", children: "Formatting" }), _jsx("div", { className: "flex flex-wrap gap-2", children: toolbarActions.map((action) => (_jsx("button", { type: "button", className: "rounded bg-surface-muted px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-surface-border/60", onClick: action.onClick, children: action.label }, action.label))) }), isSaving && _jsx("span", { className: "ml-auto text-xs text-primary", children: "Saving\u2026" })] })] }), _jsxs("div", { className: "grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "sr-only", htmlFor: "note-content", children: "Note content editor" }), _jsx("textarea", { id: "note-content", ref: textareaRef, value: content, onChange: (event) => setContent(event.target.value), placeholder: "Write your note in Markdown...", className: "min-h-[280px] flex-1 rounded-lg border border-surface-border bg-surface-muted p-4 text-sm text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" })] }), _jsxs("div", { className: "flex flex-col rounded-lg border border-surface-border bg-surface-muted p-4", children: [_jsx("h2", { className: "mb-2 text-sm font-semibold text-slate-300", children: "Preview" }), _jsx("div", { className: "flex-1 overflow-y-auto pr-1", children: _jsx(MarkdownPreview, { content: content }) })] })] })] }));
};
