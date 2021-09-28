const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/assets/js/app.js",
  output: {
    file: "assets/js/app.js",
    format: "cjs",
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), terser()],
};
