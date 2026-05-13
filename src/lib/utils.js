/**
 * Returns a human-readable relative time string and an exact GMT timestamp from a timestamp.
 * @param {string|null|undefined} timestamp - ISO date string (e.g. from Supabase created_at)
 * @returns {{ relative: string, exact: string }}
 */
export function timeAgo(timestamp) {
  if (!timestamp) return { relative: "Just now", exact: "" };

  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now - past) / 1000);

  let relative;
  if (diff < 60) relative = "Just now";
  else if (diff < 3600) relative = `${Math.floor(diff / 60)}m ago`;
  else if (diff < 86400) relative = `${Math.floor(diff / 3600)}h ago`;
  else if (diff < 604800) relative = `${Math.floor(diff / 86400)}d ago`;
  else relative = past.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  const exact = past.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "UTC", hour12: false
  }) + " GMT";

  return { relative, exact };
}
