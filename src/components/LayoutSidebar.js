import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Analytics, NotebookText, Share2, Tag, UploadCloud } from 'lucide-react';
const navigationItems = [
    { label: 'Notes', icon: NotebookText },
    { label: 'Tasks', icon: Share2 },
    { label: 'Tags', icon: Tag },
    { label: 'Sync', icon: UploadCloud },
    { label: 'Analytics', icon: Analytics }
];
export const LayoutSidebar = () => {
    return (_jsxs("aside", { className: "hidden w-64 border-r border-slate-800 bg-slate-900/40 p-6 md:block", children: [_jsx("div", { className: "mb-8", children: _jsx("span", { className: "inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary", children: "Modern Notes" }) }), _jsx("nav", { className: "space-y-1", children: navigationItems.map(({ label, icon: Icon }) => (_jsxs("button", { type: "button", className: "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary", children: [_jsx(Icon, { className: "h-4 w-4" }), label] }, label))) })] }));
};
