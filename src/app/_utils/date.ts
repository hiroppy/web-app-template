export function format(date: Date) {
  return date.toLocaleDateString("ja-JP", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
