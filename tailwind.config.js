/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#85ff3b',
        secondary: '#ff9a3c',
        dark: '#121212',
        darker: '#0a0a0a',
        light: '#e0e0e0',
        danger: '#ff3b3b',
      },
      fontFamily: {
        sans: ['Saira', 'sans-serif'],
        display: ['"Special Elite"', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
