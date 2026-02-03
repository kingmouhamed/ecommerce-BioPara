/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00a859',
        secondary: '#2d6a4f',
        accent: '#ffb703',
        'light-bg': '#f6f6f6',
      }
    },
  },
  plugins: [],
}