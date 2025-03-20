import type { Config } from "tailwindcss";

function darkenColor(hexColor: string, percent: number): string {
  // Strip the # if it exists
  hexColor = hexColor.replace(/^#/, '');

  // Parse r, g, b values
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Apply darkening
  const darken = (color: number): number => {
    let darkened = Math.round(color * (1 - percent / 100));
    return Math.max(0, darkened); // Ensure it doesn't go below 0
  };

  const newR = darken(r);
  const newG = darken(g);
  const newB = darken(b);

  // Convert back to hex
  const toHex = (color: number): string => {
    const hex = color.toString(16);
    return hex.length === 1 ? "0" + hex : hex; // Pad with 0 if needed
  };

  const newHexColor = "#" + toHex(newR) + toHex(newG) + toHex(newB);
  return newHexColor;
}

const baseBackground = '#FAFAFA';
const darkenedBackground = darkenColor(baseBackground, 20);

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          950: 'hsl(var(--secondary-950))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Component-specific color themes
        baby: {
          50: 'hsl(var(--baby-50))',
          100: 'hsl(var(--baby-100))',
          500: 'hsl(var(--baby-500))',
          600: 'hsl(var(--baby-600))',
        },
        health: {
          50: 'hsl(var(--health-50))',
          100: 'hsl(var(--health-100))',
          400: 'hsl(var(--health-400))',
          500: 'hsl(var(--health-500))',
          600: 'hsl(var(--health-600))',
        },
        reminder: {
          50: 'hsl(var(--reminder-50))',
          100: 'hsl(var(--reminder-100))',
          500: 'hsl(var(--reminder-500))',
        },
        tip: {
          50: 'hsl(var(--tip-50))',
          100: 'hsl(var(--tip-100))',
          500: 'hsl(var(--tip-500))',
          700: 'hsl(var(--tip-700))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-light': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255, 255, 255, 0)' },
        },
        'sound-wave': {
          '0%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.5)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-light': 'pulse-light 1.5s infinite',
        'sound-wave': 'sound-wave 1s ease-in-out infinite',
      },
      boxShadow: {
        'neo-light': '5px 5px 10px #d1d1d1, -5px -5px 10px transparent',
        'neo-dark': '5px 5px 10px #151515, -5px -5px 10px #353535',
        'neo-inset': 'inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff',
        'neo-inset-dark': 'inset 2px 2px 5px #151515, inset -2px -2px 5px #353535',
        'card': '0px 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        'page-mobile': '1rem', // 16px
        'page-sm': '4rem',     // 64px
        'page-md': '6rem',     // 96px
        'page-lg': '8rem',     // 128px
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
