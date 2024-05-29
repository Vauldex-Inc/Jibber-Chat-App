export const formatSentAt = (date: string) => {
  const passwordDate = new Date(date);
  const currentDate = new Date().getTime();
  const timeDiff = currentDate - passwordDate.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return "Password date is in the future";
  }

  if (daysDiff === 0) {
    if (minutesDiff === 0) {
      return "Just now";
    } else if (minutesDiff === 1) {
      return "1 min";
    } else {
      return `${minutesDiff} mins`;
    }
  } else {
    return `${daysDiff} days`;
  }
}