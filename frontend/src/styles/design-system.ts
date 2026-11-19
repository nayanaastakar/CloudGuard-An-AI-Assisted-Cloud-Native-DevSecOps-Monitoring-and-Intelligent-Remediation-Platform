/**
 * KubeSight Design System
 * Complete design tokens, component variants, and styling utilities
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#F1F5F7',
    100: '#DDE7ED',
    200: '#C0D1DC',
    300: '#A0B7C7',
    400: '#87A5BA',
    500: '#7395AE',
    600: '#557A95',
    700: '#47677D',
    800: '#395366',
    900: '#2C404F',
  },

  // Semantic Colors
  success: {
    50: '#EFF7F4',
    100: '#D8ECE6',
    200: '#B2D8CC',
    300: '#86BFAF',
    400: '#379683',
    500: '#2C7E6E',
    600: '#246556',
    700: '#1E5146',
    800: '#153B34',
    900: '#102923',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  purple: {
    50: '#F1F4F6',
    100: '#D9E3E9',
    200: '#B9CBD6',
    300: '#96B0C0',
    400: '#7496AD',
    500: '#557A95',
    600: '#47677D',
    700: '#395366',
    800: '#2C404F',
    900: '#1F303D',
  },

  // Neutral Colors - Light Mode
  light: {
    bg: {
      primary: '#F8FAFC',
      secondary: '#FFFFFF',
      tertiary: '#F1F5F9',
      card: 'rgba(255, 255, 255, 0.8)',
      hover: '#F1F5F9',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      muted: '#94A3B8',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E2E8F0',
      light: 'rgba(226, 232, 240, 0.5)',
      focus: '#557A95',
    },
  },

  // Neutral Colors - Dark Mode
  dark: {
    bg: {
      primary: '#171619',
      secondary: '#222126',
      tertiary: '#2D2C31',
      card: 'rgba(45, 44, 49, 0.8)',
      hover: '#3E3D42',
    },
    text: {
      primary: '#F7F4F1',
      secondary: '#D7D1CC',
      muted: '#B1A296',
      inverse: '#171619',
    },
    border: {
      default: '#5D5C61',
      light: 'rgba(93, 92, 97, 0.5)',
      focus: '#7395AE',
    },
  },
} as const;

// =============================================================================
// SPACING SCALE
// =============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
} as const;

// =============================================================================
// TYPOGRAPHY SCALE
// =============================================================================

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Fira Code, Consolas, Monaco, "Andale Mono", monospace',
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Glassmorphism shadows
  glass: {
    light: '0 8px 32px rgba(0, 0, 0, 0.08)',
    dark: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },

  // Colored shadows for buttons
  colored: {
    primary: '0 4px 14px rgba(85, 122, 149, 0.25)',
    success: '0 4px 14px rgba(55, 150, 131, 0.25)',
    warning: '0 4px 14px rgba(245, 158, 11, 0.25)',
    danger: '0 4px 14px rgba(239, 68, 68, 0.25)',
    purple: '0 4px 14px rgba(168, 85, 247, 0.25)',
  },
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  default: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  fast: '150ms ease',
  default: '200ms ease',
  slow: '300ms ease',
  spring: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
} as const;

// =============================================================================
// COMPONENT VARIANTS (Tailwind Classes)
// =============================================================================

export const componentClasses = {
  // Card Variants
  card: {
    base: 'rounded-2xl border transition-all duration-200',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 shadow-xl',
    solid: 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm',
    elevated: 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-lg',
    interactive: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer',
  },

  // Button Variants
  button: {
    base: 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 focus:ring-primary-500',
    secondary: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 focus:ring-gray-500',
    outline: 'border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 focus:ring-gray-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200',
    danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/30 focus:ring-danger-500',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25 hover:shadow-xl hover:shadow-success-500/30 focus:ring-success-500',
    sizes: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },

  // Input Variants
  input: {
    base: 'w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
    default: 'px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
    glass: 'px-4 py-2.5 text-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-gray-200/50 dark:border-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
  },

  // Badge/Tag Variants
  badge: {
    base: 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full',
    primary: 'bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    success: 'bg-success-100 dark:bg-success-500/10 text-success-600 dark:text-success-400',
    warning: 'bg-warning-100 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-100 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400',
    purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    gray: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
  },

  // Table Variants
  table: {
    wrapper: 'overflow-hidden rounded-xl border border-gray-200/50 dark:border-slate-700/50',
    base: 'w-full',
    header: 'bg-gray-50/50 dark:bg-slate-800/50',
    headerCell: 'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    row: 'border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors',
    cell: 'px-4 py-3 text-sm text-gray-700 dark:text-gray-300',
  },

  // Alert Variants
  alert: {
    base: 'flex items-start gap-3 p-4 rounded-xl border',
    info: 'bg-primary-50 dark:bg-primary-500/5 border-primary-200 dark:border-primary-500/20 text-primary-800 dark:text-primary-300',
    success: 'bg-success-50 dark:bg-success-500/5 border-success-200 dark:border-success-500/20 text-success-800 dark:text-success-300',
    warning: 'bg-warning-50 dark:bg-warning-500/5 border-warning-200 dark:border-warning-500/20 text-warning-800 dark:text-warning-300',
    danger: 'bg-danger-50 dark:bg-danger-500/5 border-danger-200 dark:border-danger-500/20 text-danger-800 dark:text-danger-300',
  },

  // KPI Card
  kpiCard: {
    wrapper: 'p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50',
    iconWrapper: 'p-2.5 rounded-xl',
    title: 'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    value: 'text-2xl font-bold text-gray-900 dark:text-white',
    trend: {
      up: 'text-success-600 dark:text-success-400',
      down: 'text-danger-600 dark:text-danger-400',
      neutral: 'text-gray-500 dark:text-gray-400',
    },
  },

  // Drawer
  drawer: {
    backdrop: 'fixed inset-0 bg-black/30 backdrop-blur-sm z-40',
    panel: 'fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto',
    header: 'sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between',
    content: 'p-4 space-y-6',
  },

  // Tabs
  tabs: {
    wrapper: 'flex items-center gap-1 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-xl backdrop-blur-sm',
    tab: 'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
    active: 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm',
    inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
  },
};

// =============================================================================
// CHART COLORS
// =============================================================================

export const chartColors = {
  primary: ['#7395AE', '#8AA9BC', '#A9BFCE', '#D1DDE5'],
  success: ['#379683', '#57A995', '#83BBAE', '#B4D8CF'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  purple: ['#557A95', '#7496AD', '#96B0C0', '#C0D0D9'],

  // For multi-series charts
  series: [
    '#7395AE',
    '#379683',
    '#557A95',
    '#B1A296',
    '#A3B8C6',
    '#68AA9B',
    '#89A9BD',
    '#C6B9AF',
    '#83B7AA',
    '#D0C2B7',
  ],

  // Gradients for area charts
  gradients: {
    blue: ['rgba(115, 149, 174, 0.3)', 'rgba(115, 149, 174, 0)'],
    purple: ['rgba(85, 122, 149, 0.3)', 'rgba(85, 122, 149, 0)'],
    green: ['rgba(55, 150, 131, 0.3)', 'rgba(55, 150, 131, 0)'],
    red: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0)'],
  },
};

// =============================================================================
// LAYOUT PRIMITIVES
// =============================================================================

export const layout = {
  // Content widths
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // Grid configurations
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    cols6: 'grid-cols-6',
    cols12: 'grid-cols-12',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },

  // Common layout patterns
  patterns: {
    // 60/40 split
    split6040: 'grid grid-cols-1 lg:grid-cols-5 gap-6',
    // 50/50 split
    split5050: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    // 70/30 split
    split7030: 'grid grid-cols-1 lg:grid-cols-7 gap-6',
    // 3-panel (20/60/20)
    threePanel: 'grid grid-cols-1 lg:grid-cols-5 gap-4',
  },
};

export default {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
  zIndex,
  componentClasses,
  chartColors,
  layout,
};
