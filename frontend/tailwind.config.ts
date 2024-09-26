import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        light: {
          primary: "#e6f2f4",
          secondary: "#081f5c",
          rock: "#b0a99f",
          moon: "#f7f2eb",
          cream: "#fff9f0",
          pear: "#f2f0de",
          yellow: "#ffb331",
          honey: "#f6d110", 
          butter: "#fff9c7",
          blue: "#81ceeb",
          skyblue: "#e6f2f4",
          sky: "#bad6eb",
          vase: "#7096d1",
          royal: "#334eac",
          dawn: "#d0e3ff",
          ocean: "#587892",
          accent: "#081f5c",
          text: "#2a2829",
          success: "#6f8d5e",
          warning: "#fe8492",
          danger: "#a42527",
          muted: "#eeeced",
        }
      }
    },
  },
  plugins: [],
};
export default config;
