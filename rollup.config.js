import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/assets/js/app.js",
  output: {
    file: "assets/js/app.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), terser()],
};
