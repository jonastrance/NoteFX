import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useState } from 'react';
import { ChevronRight, FolderTree, Search } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { cn } from '../utils/cn';
// Memoize individual tag row to prevent unnecessary re-renders
const TagRow = memo(({ tag, selectedId, onClick, children }) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: onClick, className: cn('flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/70 px-4 py-3 text-left transition hover:border-sky-400/40', selectedId === tag.id && 'border-sky-400/70 shadow-lg shadow-sky-500/20'), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { "aria-hidden": true, className: "h-3 w-3 rounded-full", style: { backgroundColor: tag.color } }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-white", children: tag.name }), tag.description && (_jsx("p", { className: "text-xs text-slate-400", children: tag.description }))] })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-400", children: [_jsxs("span", { className: "rounded-full bg-white/5 px-2 py-0.5 font-medium text-sky-300", children: [tag.usageCount, " uses"] }), children && _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), children && _jsx("div", { className: "ml-6 space-y-2", children: children })] })));
TagRow.displayName = 'TagRow';
export const TagsList = memo(({ tags, onSelect, selectedId }) => {
    const { search, getChildren } = useTags();
    const [query, setQuery] = useState('');
    const filteredTags = useMemo(() => {
        if (!query)
            return tags;
        return search(query);
    }, [query, search, tags]);
    const roots = useMemo(() => filteredTags.filter((tag) => !tag.parentId), [filteredTags]);
    const renderTagRow = (tag) => {
        const children = query ? [] : getChildren(tag.id);
        return (_jsx(TagRow, { tag: tag, selectedId: selectedId, onClick: () => onSelect(tag.id), children: children.length > 0 && children.map(renderTagRow) }, tag.id));
    };
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h2", { className: "flex items-center gap-2 text-lg font-semibold text-white", children: [_jsx(FolderTree, { className: "h-5 w-5 text-sky-300", "aria-hidden": true }), "Tag hierarchy"] }) }), _jsxs("label", { className: "relative block", children: [_jsx("span", { className: "sr-only", children: "Search tags" }), _jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), _jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), className: "w-full rounded-lg border border-white/5 bg-slate-950/70 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40", placeholder: "Search tags...", type: "search" })] }), _jsx("div", { className: "space-y-3", role: "list", children: filteredTags.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No tags match your search." })) : query ? (filteredTags.map((tag) => (_jsxs("button", { onClick: () => onSelect(tag.id), className: cn('flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/70 px-4 py-3 text-left transition hover:border-sky-400/40', selectedId === tag.id && 'border-sky-400/70 shadow-lg shadow-sky-500/20'), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { "aria-hidden": true, className: "h-3 w-3 rounded-full", style: { backgroundColor: tag.color } }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-white", children: tag.name }), tag.description && (_jsx("p", { className: "text-xs text-slate-400", children: tag.description }))] })] }), _jsxs("span", { className: "text-xs text-slate-400", children: [tag.usageCount, " uses"] })] }, tag.id)))) : (roots.map(renderTagRow)) })] }));
});
TagsList.displayName = 'TagsList';
