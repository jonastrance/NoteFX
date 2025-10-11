import { useMemo, useState } from 'react';
import { ChevronRight, FolderTree, Search } from 'lucide-react';
import type { Tag } from '../types/tag';
import { useTags } from '../hooks/useTags';
import { cn } from '../utils/cn';

type TagsListProps = {
  tags: Tag[];
  onSelect: (tagId: string | null) => void;
  selectedId: string | null;
};

export const TagsList = ({ tags, onSelect, selectedId }: TagsListProps) => {
  const { search, getChildren } = useTags();
  const [query, setQuery] = useState('');

  const filteredTags = useMemo(() => {
    if (!query) return tags;
    return search(query);
  }, [query, search, tags]);

  const roots = useMemo(() => filteredTags.filter((tag) => !tag.parentId), [filteredTags]);

  const renderTagRow = (tag: Tag) => {
    const children = query ? [] : getChildren(tag.id);
    return (
      <div key={tag.id} className="space-y-2">
        <button
          onClick={() => onSelect(tag.id)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/70 px-4 py-3 text-left transition hover:border-sky-400/40',
            selectedId === tag.id && 'border-sky-400/70 shadow-lg shadow-sky-500/20'
          )}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <div>
              <p className="text-sm font-semibold text-white">{tag.name}</p>
              {tag.description && (
                <p className="text-xs text-slate-400">{tag.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-medium text-sky-300">
              {tag.usageCount} uses
            </span>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </div>
        </button>
        {children.length > 0 && (
          <div className="ml-6 space-y-2 border-l border-white/5 pl-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onSelect(child.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/70 px-3 py-2 text-left text-sm transition hover:border-violet-400/40',
                  selectedId === child.id && 'border-violet-400/70 shadow-lg shadow-violet-500/20'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: child.color }}
                  />
                  <span className="font-medium text-white">{child.name}</span>
                </div>
                <span className="text-xs text-slate-400">{child.usageCount} uses</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <FolderTree className="h-5 w-5 text-sky-300" aria-hidden />
          Tag hierarchy
        </h2>
      </div>
      <label className="relative block">
        <span className="sr-only">Search tags</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-white/5 bg-slate-950/70 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/40"
          placeholder="Search tags..."
          type="search"
        />
      </label>
      <div className="space-y-3" role="list">
        {filteredTags.length === 0 ? (
          <p className="text-sm text-slate-400">No tags match your search.</p>
        ) : query ? (
          filteredTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-white/5 bg-slate-900/70 px-4 py-3 text-left transition hover:border-sky-400/40',
                selectedId === tag.id && 'border-sky-400/70 shadow-lg shadow-sky-500/20'
              )}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <div>
                  <p className="text-sm font-semibold text-white">{tag.name}</p>
                  {tag.description && (
                    <p className="text-xs text-slate-400">{tag.description}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400">{tag.usageCount} uses</span>
            </button>
          ))
        ) : (
          roots.map(renderTagRow)
        )}
      </div>
    </div>
  );
};
