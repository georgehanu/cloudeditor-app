const path = require("path");
const argv = require("yargs").argv;

const workspace = argv.workspace || "admin";
const prod = (argv.mode || "production") === "production" ? 1 : 0;
const namespace = "cloudeditor";

const config = {
  namespace,
  entry: {
    main: path.join(
      __dirname,
      namespace,
      "/workspaces/" + workspace + "/index.js"
    )
  },
  paths: {
    base: __dirname,
    dist: path.join(__dirname, "public", workspace),
    cleanPaths: ["public/" + workspace],
    contentBase: "./dist/",
    htmlInput: path.join(
      __dirname,
      namespace,
      "/workspaces/" + workspace + "/index.html"
    )
  },
  prod,
  publicPath: "",
  sourcemaps: !prod,
  resourceRoot: "/",
  fileLoaderDirs: {
    images: "images",
    fonts: "fonts"
  },
  port: 8081,
  cleanDistDir: !prod,
  cssPrefix: ".cloudeditor"
};

module.exports = require("./buildConfig")(config);
