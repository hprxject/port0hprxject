import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // No custom theme extension — design system lives in CSS variables.
  // Tailwind used only for utility resets; design tokens are in globals.css.
  theme: {},
  plugins: [],
}

export default config
