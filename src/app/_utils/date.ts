export function format(date: Date) {
  return date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Tokyo",
  });
}
