/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  safelist: [
    'stroke-blue-500',
    'stroke-violet-500',
    'stroke-amber-500',
    'stroke-red-500',
    'stroke-emerald-500',
    'stroke-gray-200',
    'stroke-slate-700',
    'dark:stroke-slate-700',
    'bg-blue-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-red-500',
    'bg-emerald-500',
  ],
  theme: {
    extend: {
      colors: {
        // Vichy Theme Palette:
        // Teal Accent: #05AD98
        // Medium Slate: #878787
        // Soft Light Gray: #BBBFBF
        // Crisp White: #FFFFFF
        vichy: {
          teal: '#05AD98',
          'teal-light': '#06C4AD',
          'teal-dark': '#048F7D',
          'teal-deep': '#036B5E',
          gray: '#878787',
          'gray-light': '#BBBFBF',
          white: '#FFFFFF',
        },
        navy: {
          950: '#070C10',
          900: '#0D1418', // Main background deep charcoal/slate
          800: '#131E24', // Sidebar & top navigation
          700: '#1A2830', // Cards and panels
          600: '#223540',
          border: '#2F424E', // Borders
        },
        primary: {
          50: '#e6f7f5',
          100: '#c0ebe5',
          200: '#94ded3',
          300: '#63cec0',
          400: '#34bfac',
          500: '#05AD98', // Vichy Teal primary
          600: '#048f7d',
          700: '#036e60',
          800: '#03544a',
          900: '#023c34',
        },
        secondary: {
          50: '#f6f7f7',
          100: '#e5e7e7',
          200: '#d0d3d3',
          300: '#BBBFBF', // Vichy Soft Gray
          400: '#9fa3a3',
          500: '#878787', // Vichy Medium Slate Gray
          600: '#6e6e6e',
          700: '#565656',
          800: '#3f3f3f',
          900: '#292929',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-violet': 'linear-gradient(135deg, #05AD98 0%, #036B5E 100%)',
        'vichy-gradient': 'linear-gradient(135deg, #05AD98 0%, #048F7D 100%)',
      },
      boxShadow: {
        'blue-glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'violet-glow': '0 0 15px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
