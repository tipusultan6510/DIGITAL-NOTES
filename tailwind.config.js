/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#14213D',
          50: '#EEF1F6',
          100: '#D7DEE9',
          600: '#1B2C4F',
          700: '#14213D',
          800: '#0F1930',
          900: '#0A1122',
        },
        accent: {
          DEFAULT: '#5B84B1',
          50: '#F1F5FA',
          100: '#E1EAF3',
          400: '#7FA0C4',
          500: '#5B84B1',
          600: '#496A8D',
        },
        success: { DEFAULT: '#6FA98A', 50: '#EFF7F2' },
        warning: { DEFAULT: '#E0A458', 50: '#FBF3E7' },
        danger: { DEFAULT: '#D97878', 50: '#FBEEEE' },
        ink: {
          DEFAULT: '#1F2430',
          muted: '#6B7280',
        },
        line: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}
