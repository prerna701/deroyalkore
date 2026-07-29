import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#D4AF37", // Metallic Gold
        "primary-light": "#E5C158",
        "primary-dark": "#B38F2D",
        "background-light": "#fdfcfb",
        "background-dark": "#0D1023", // Deep Navy - canonical dark surface
        "cream": "#FAF4E4", // canonical light surface + light-on-dark text
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Nunito', 'sans-serif'],
        cormorant: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    containerQueries,
  ],
}

