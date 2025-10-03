/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#333333',
        accent: '#666666',
        'gray-50': '#fafafa',
        'gray-100': '#f5f5f5',
        'gray-200': '#e0e0e0',
        'gray-300': '#cccccc',
        'gray-400': '#999999',
        'gray-500': '#666666',
        'gray-600': '#333333',
        'gray-900': '#1a1a1a',
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.10)',
        'heavy': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '4.5': '1.125rem',
        '15': '3.75rem',
      },
      width: {
        '4.5': '1.125rem',
        '15': '3.75rem',
      },
      height: {
        '4.5': '1.125rem',
      },
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [],
}
