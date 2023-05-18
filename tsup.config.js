import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["pages/index.tsx"], // changed from "src/index.tsx"
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
});
