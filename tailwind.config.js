/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EXACT WHITE & SKY BLUE LIGHT THEME PALETTE
        canvas: '#F4F8FA',          // Secondary Background / App Canvas (subtle ice blue)
        surface: '#FFFFFF',         // Main Background / Surface / Elevated containers
        border: {
          light: '#E1EDF7',         // Pale Sky Blue (Card borders, separators, dividers)
          DEFAULT: '#E1EDF7',
          sky: '#8EC5FC',
        },
        brand: {
          50: '#F4F8FA',
          100: '#E1EDF7',
          200: '#C5E0FB',
          300: '#8EC5FC',           // Primary Brand / Interactive / Accent
          400: '#6BA8E5',           // Primary Action Hover / Focus
          500: '#4A90E2',
          600: '#357ABD',
          700: '#2A6197',
          800: '#2C3E50',           // Primary Text / Headings
          900: '#1E2C3A',
        },
        primary: {
          DEFAULT: '#8EC5FC',       // Primary Brand (#8EC5FC)
          hover: '#6BA8E5',         // Hover/Focus (#6BA8E5)
          light: '#E1EDF7',
          dark: '#357ABD',
        },
        content: {
          primary: '#2C3E50',       // Primary Text / Headings (Deep Slate Navy)
          secondary: '#4A6572',     // Secondary Text / Subtitles / Muted
          muted: '#78909C',
          inverse: '#FFFFFF',
        },
        cyber: {
          emerald: '#059669',
          teal: '#0d9488',
          cyan: '#0284c7',
          violet: '#7c3aed',
          fuchsia: '#c026d3',
          amber: '#d97706',
          rose: '#e11d48',
          dark: '#2C3E50',
          darker: '#1E2C3A',
          card: '#FFFFFF',
          border: '#E1EDF7',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'laser-scan': 'laserScan 2.5s ease-in-out infinite',
        'watermark-bounce': 'watermarkBounce 18s linear infinite alternate',
        'glow-spin': 'glowSpin 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        laserScan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
        watermarkBounce: {
          '0%': { top: '10%', left: '10%' },
          '25%': { top: '75%', left: '20%' },
          '50%': { top: '20%', left: '70%' },
          '75%': { top: '70%', left: '60%' },
          '100%': { top: '40%', left: '30%' },
        },
        glowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'neon-indigo': '0 0 25px rgba(99, 102, 241, 0.35)',
        'neon-violet': '0 0 25px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
