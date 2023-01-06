// import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import eslint from "@rollup/plugin-eslint";
import { babel } from '@rollup/plugin-babel'

import pkg from "./package.json" assert { type: 'json' };

export default {
  input: "src/jsbridge.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
    {
      file: pkg.browser,
      format: "umd",
    },
  ],
  plugins: [
    json(),
    commonjs({
      include: /node_modules/,
    }),
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      brower: true,
    }),
    // typescript(),
    // eslint(),
    babel({ babelHelpers: 'bundled', exclude: "node_modules/**" }),
  ],
};