import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/button-progress-card.ts",
  output: {
    file: "dist/button-progress-card.js",
    format: "es",
    sourcemap: true,
  },
  external: ["lit", "lit/decorators.js", "lit/directives/style-map.js"],
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: true,
    }),
  ],
};