import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "bg-l": "#F1FFFA",
      "bg-d": "#464E47",
      "ac-1": "#CCFCCB",
      "ac-2": "#96E6B3",
      "ac-3": "#568259"
    }
  },
  plugins: [],
};
export default config;
