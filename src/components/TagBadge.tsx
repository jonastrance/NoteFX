import { X } from 'lucide-react';
import type { Tag } from '../types/tag';
import { cn } from '../utils/cn';

type TagBadgeProps = {
  tag: Tag;
  onRemove?: () => void;
};

export const TagBadge = ({ tag, onRemove }: TagBadgeProps) => (
  <span
    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
    style={{ backgroundColor: `${tag.color}33`, color: tag.color }}
  >
    <span className="font-medium" aria-label={`Tag color ${tag.color}`}>
      {tag.name}
    </span>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px] text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
        )}
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    )}
  </span>
);
