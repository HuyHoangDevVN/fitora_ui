/** @type {import('tailwindcss').Config} */
import colors from './src/styles/colors';


export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        secondBackground: colors.secondBackground,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        border: colors.border,
        hover: colors.hover,
      },
    },
  },
  plugins: [],
};
