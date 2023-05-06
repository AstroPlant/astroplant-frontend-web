import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  define: {
    "process.env": {},
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "index.ts",
      fileName: "index",
      formats: ["es"],
      name: "astroplant-api",
    },
  },
  test: {
    environment: "jsdom",
  },
});
