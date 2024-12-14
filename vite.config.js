import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/app.[hash].js",
        assetFileNames: ({ name }) => {
          const { ext } = path.parse(name);

          const outputMap = {
            ".css": `assets/css/app.[hash].css`,
            ".ttf": "assets/fonts/[name].[ext]",
            ".otf": "assets/fonts/[name].[ext]",
            ".woff": "assets/fonts/[name].[ext]",
            ".woff2": "assets/fonts/[name].[ext]",
            ".mp4": "assets/videos/[name].[ext]",
            ".ogv": "assets/videos/[name].[ext]",
            ".webm": "assets/videos/[name].[ext]",
          };

          return outputMap[ext] || `assets/img/[name].[ext]`;
        },
      },
    },
  },
});
