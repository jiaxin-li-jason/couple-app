import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#d8f0e3',
          200: '#b3e1c9',
          300: '#81cba8',
          400: '#4dae80',
          500: '#2d9365',
          600: '#1e7650',
          700: '#185e41',
          800: '#154b35',
          900: '#123e2d',
        },
        love: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa3a3',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51d1d',
          700: '#c11414',
          800: '#a01515',
          900: '#841818',
        },
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
