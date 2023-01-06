import baseConfig from "./rollup.config.base.js";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
 
export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      contentBase: "",
      port: 8020,
    }),
    livereload("src"),
  ],
};