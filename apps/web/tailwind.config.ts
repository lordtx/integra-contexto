import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#0a0a0f', alt: '#1a1a2e', card: '#12121a' },
        accent: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
      },
      fontFamily: { mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
};
export default config;