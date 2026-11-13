import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  minify: false,
  shims: true,
  dts: false,
  sourcemap: false,
});
