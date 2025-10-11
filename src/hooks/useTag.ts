import { useMemo } from 'react';
import { useTags } from './useTags';

export const useTag = (id: string | null | undefined) => {
  const { tags } = useTags();

  return useMemo(() => tags.find((tag) => tag.id === id) ?? null, [tags, id]);
};
