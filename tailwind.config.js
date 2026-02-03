/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: '#0a0a0f',
          raised: '#111118',
          overlay: '#1a1a24',
        },
        rarity: {
          normal: '#6b7280',
          rare: '#3b82f6',
          sr: '#fbbf24',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-gold': '0 0 30px rgba(251, 191, 36, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
};
