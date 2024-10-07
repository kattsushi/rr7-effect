import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  presets: ['@pandacss/dev/presets'],
  // Whether to use css reset
  preflight: true,
  jsxFramework: "react",

  // Where to look for your css declarations
  include: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./../../../libs/web/ui/lib/**/*.{js,jsx,ts,tsx}"
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
  importMap: '@devx/web-ui'
});
