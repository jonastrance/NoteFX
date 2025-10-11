export const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
