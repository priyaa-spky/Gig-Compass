const PATHS = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  briefcase: 'M3 7h18v13H3z M9 7V4h6v3 M3 13h18',
  file: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h7',
  calendar: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4',
  bell: 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  logout: 'M9 3H4v18h5 M16 8l4 4-4 4 M20 12H9',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4',
  check: 'M5 12l5 5 9-10',
  close: 'M6 6l12 12 M18 6L6 18',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
