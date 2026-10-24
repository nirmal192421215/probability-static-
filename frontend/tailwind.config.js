/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060D1A",
          900: "#0B192E",
          850: "#0F2341",
          800: "#132D54",
          700: "#1E427B",
          600: "#2B5BA8",
        },
        accent: {
          600: "#2563EB",
          500: "#3B82F6",
          400: "#60A5FA",
          300: "#93C5FD",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
        surface: "#F6F9FD",
        surfaceDark: "#0A1322",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 25px -5px rgba(15, 35, 65, 0.06), 0 8px 10px -6px rgba(15, 35, 65, 0.04)",
        cardHover: "0 20px 35px -8px rgba(15, 35, 65, 0.12), 0 10px 15px -5px rgba(37, 99, 235, 0.08)",
        glow: "0 0 25px -5px rgba(37, 99, 235, 0.35)",
        glowCyan: "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        glass: "0 8px 32px 0 rgba(11, 25, 46, 0.12)",
        soft: "0 2px 10px -2px rgba(11, 25, 46, 0.06)",
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
