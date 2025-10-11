# Modern Notes App

This project is a modern, offline-first note-taking experience built with React 18, TypeScript, Vite, and Tailwind CSS. It offers rich Markdown editing, instant search, pinning, and complete CRUD operations with persistent storage powered by `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

## Available scripts

- `npm run dev` – start the development server with hot module reloading.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build locally.
- `npm test` – run the Vitest test suite.

## Key features

- Responsive dual-pane layout with a searchable notes list and a live Markdown preview.
- Auto-saving editor with formatting shortcuts (bold, italic, headings, quotes, lists, inline code).
- Notes are persisted to `localStorage` with timestamps and pinning support.
- Fully typed data models validated with Zod and exercised through comprehensive tests.
