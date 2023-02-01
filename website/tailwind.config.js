/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./theme.config.tsx",
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/container-queries")],
};
