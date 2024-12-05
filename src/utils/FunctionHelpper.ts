export const timeToLast = (time: Date): string => {
  const now = new Date();
  const diffInMs = Math.abs(now.getTime() - time.getTime());

  const seconds = Math.round(diffInMs / 1000);
  if (seconds < 60) return `${seconds} giây trước`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ngày trước`;

  const months = Math.round(days / 30);
  if (months < 12) return `${months} tháng trước`;

  const years = Math.round(months / 12);
  return `${years} năm trước`;
};
