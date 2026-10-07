const pad = (n) => String(n).padStart(2, '0');

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Accepts 'YYYY-MM-DD' (local midnight) or a full date-time string.
export const parseDate = (s) => new Date(s.length === 10 ? `${s}T00:00:00` : s);

export const formatDate = (s) =>
  parseDate(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (s) =>
  parseDate(s).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

export const formatTime = (s) =>
  parseDate(s).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

// Whole calendar days from today to the given date (negative = in the past).
export const daysLeft = (s) => {
  const a = parseDate(todayStr());
  const b = parseDate(s.slice(0, 10));
  return Math.round((b - a) / 86400000);
};

export const deadlineLabel = (s) => {
  const d = daysLeft(s);
  if (d < 0) return 'Closed';
  if (d === 0) return 'Closes today';
  if (d === 1) return '1 day left';
  return `${d} days left`;
};

export const whenLabel = (s) => {
  const d = daysLeft(s);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  if (d > 1) return `In ${d} days`;
  return `${Math.abs(d)} days ago`;
};

export const formatPackage = (lpa) => `₹${lpa} LPA`;

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

export const timeAgo = (s) => {
  const mins = Math.round((Date.now() - parseDate(s).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

export const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
