import flowbite from 'flowbite/plugin'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './node_modules/flowbite/**/*.js'],
  // Shared components compose these semantic classes at runtime.
  safelist: [
    { pattern: /^tag-(blue|cyan|green|amber|purple|rose|slate)$/ },
    { pattern: /^button-(primary|secondary)$/ },
    { pattern: /^notice-(success|error)$/ },
    { pattern: /^service-status-(available|unavailable)$/ },
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gray: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
        primary: { 50: '#EFF7FF', 100: '#D9ECFF', 300: '#8AC2FF', 500: '#3180E3', 600: '#1765BB', 700: '#004C97', 800: '#003B75' },
      },
      fontFamily: { sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'] },
    },
  },
  plugins: [flowbite],
}
