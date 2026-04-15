import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json" with { type: "json" };

const isWatch = !!process.env.ROLLUP_WATCH;
const version = process.env.CARD_VERSION ?? pkg.version;

const plugins = [
  replace({
    preventAssignment: true,
    __CARD_VERSION__: version,
  }),
  resolve(),
  typescript({
    tsconfig: "./tsconfig.json",
    sourceMap: true,
  }),
];

if (isWatch) {
  const { default: serve } = await import("rollup-plugin-serve");
  const { default: livereload } = await import("rollup-plugin-livereload");
  plugins.push(
    serve({
      contentBase: ".",
      port: 8080,
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
    livereload({ watch: "dist", port: 35729 })
  );
}

export default {
  input: "src/button-progress-card.ts",
  output: {
    file: "dist/button-progress-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins,
};
