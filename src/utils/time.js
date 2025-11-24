export const nowIsoString = () => new Date().toISOString();
export const minutesFromNow = (minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString();
};
