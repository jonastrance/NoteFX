export const nowIsoString = () => new Date().toISOString();

export const minutesFromNow = (minutes: number) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toISOString();
};
