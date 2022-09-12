import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
console.log(nodeResolve);
export default {
  input: "src/assets/js/app.js",
  output: {
    file: "assets/js/app.js",
    format: "cjs",
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), terser()],
};
