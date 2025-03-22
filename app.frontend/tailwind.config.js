/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 4s infinite",
      },
      colors: {
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
        },
        gray: {
          800: "#1F2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
  };
  
