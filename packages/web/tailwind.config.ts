import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Midnight Protocol Theme
        background: {
          primary: '#111827',   // Deep, dark charcoal
          secondary: '#1F2937', // Slightly lighter dark gray
        },
        text: {
          primary: '#E5E7EB',   // Soft, off-white
          secondary: '#9CA3AF', // Muted gray
        },
        accent: {
          primary: '#22D3EE',   // Vibrant, glowing cyan
          success: '#34D399',   // Vibrant green
          error: '#F87171',     // Vibrant red-orange
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        // Custom spacing if needed
      },
      borderRadius: {
        // Custom border radius if needed
      },
    },
  },
  plugins: [],
};

export default config;
