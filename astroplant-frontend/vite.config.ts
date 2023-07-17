import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  resolve: {
    preserveSymlinks: true,
  },
  define: {
    "process.env": {},
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    outDir: "build",
    // debug:
    // minify: false,
    // rollupOptions: {
    //   output: {
    //     assetFileNames: "[name].[ext]",
    //   },
    // },
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
  },
});
