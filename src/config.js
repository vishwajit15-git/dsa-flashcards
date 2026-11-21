export const COLORS = {
  bg: '#ffffff',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  accent: '#2563eb',
  error: '#dc2626',
};

export const SIZES = {
  heading: 22,
  body: 15,
  small: 13,
};

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

export const BOX_INTERVALS = {
  1: 0,
  2: 1,
  3: 3,
};

export const DAY_MS = 24 * 60 * 60 * 1000;
export const ALL_TOPICS = 'All topics';
export const STORAGE_KEY = '@dsa_flashcards/progress';
export const MIN_TOUCH = 44;

export const getToday = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};
