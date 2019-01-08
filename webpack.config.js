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
    contentBase: path.join(__dirname, "cloudeditor/"),
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
  cssPrefix: ".cloudeditor",
  copyFrom: []
};

if (workspace === "designAndGo")
  config["copyFrom"].push({
    from: "./" + namespace + "/themes/" + workspace + "/images/*",
    to: "./editorImages/[name].[ext]"
  });
else {
  config["copyFrom"].push({
    from: "./" + namespace + "/themes/" + workspace + "/tinymce/",
    to: "./tinymce/"
  });
}
module.exports = require("./buildConfig")(config);
