import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "bg-l": "#222831",
      "bg-d": "#31363F",
      "ac-1": "#76ABAE",
      "ac-2": "#EEEEEE",
      "ac-3": "#76ABAE"
    }
  },
  plugins: [],
};
export default config;