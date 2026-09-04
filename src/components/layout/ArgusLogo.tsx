export function ArgusLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="argus-shell" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A4EDB" />
          <stop offset="1" stopColor="#0033BE" />
        </linearGradient>
      </defs>
      <path
        d="M20 1.5 36.5 11v18L20 38.5 3.5 29V11z"
        fill="url(#argus-shell)"
        stroke="#0033BE"
        strokeWidth="0.75"
      />
      <path d="M20 7.5 31 13.75v12.5L20 32.5 9 26.25v-12.5z" stroke="#7DF5F4" strokeWidth="1.1" opacity="0.65" />
      <circle cx="20" cy="20" r="5.5" stroke="#7DF5F4" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="2.25" fill="#7DF5F4" />
      <circle cx="20" cy="7.5" r="1.35" fill="#5ED9D7" />
      <circle cx="31" cy="13.75" r="1.35" fill="#5ED9D7" />
      <circle cx="31" cy="26.25" r="1.35" fill="#5ED9D7" />
      <circle cx="20" cy="32.5" r="1.35" fill="#5ED9D7" />
      <circle cx="9" cy="26.25" r="1.35" fill="#5ED9D7" />
      <circle cx="9" cy="13.75" r="1.35" fill="#5ED9D7" />
    </svg>
  );
}
