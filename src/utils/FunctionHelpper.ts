const getSecondsDiff = (now: Date, time: Date) =>
  Math.floor((now.getTime() - time.getTime()) / 1000);
const getMinutesDiff = (seconds: number) => Math.floor(seconds / 60);
const getHoursDiff = (minutes: number) => Math.floor(minutes / 60);
const getDaysDiff = (hours: number) => Math.floor(hours / 24);
const getMonthsDiff = (days: number) => Math.floor(days / 30);
const getYearsDiff = (months: number) => Math.floor(months / 12);

export const timeToLast = (time: Date): string => {
  const now = new Date();
  const seconds = getSecondsDiff(now, time);
  if (seconds < 60) return `${seconds} giây trước`;

  const minutes = getMinutesDiff(seconds);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = getHoursDiff(minutes);
  if (hours < 24) return `${hours} giờ trước`;

  const days = getDaysDiff(hours);
  if (days < 30) return `${days} ngày trước`;

  const months = getMonthsDiff(days);
  if (months < 12) return `${months} tháng trước`;

  const years = getYearsDiff(months);
  return `${years} năm trước`;
};
