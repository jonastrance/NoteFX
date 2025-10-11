export const formatDate = (date: string | number | Date) => {
  const value = typeof date === 'string' ? new Date(date) : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
};
