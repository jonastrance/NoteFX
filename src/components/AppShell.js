import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LayoutHeader } from './LayoutHeader';
import { LayoutSidebar } from './LayoutSidebar';
export const AppShell = ({ children }) => {
    return (_jsxs("div", { className: "flex min-h-screen bg-slate-950 text-slate-100", children: [_jsx(LayoutSidebar, {}), _jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(LayoutHeader, {}), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: children ?? (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-primary/10", children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Modern Notes App" }), _jsx("p", { className: "mt-4 text-slate-300", children: "Kickstart your productivity with tasks, AI-powered tagging, and privacy-first syncing." })] })) })] })] }));
};
