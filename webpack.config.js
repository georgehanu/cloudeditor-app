const path = require("path");
const argv = require("yargs").argv;
const workspace = argv.workspace || "admin";

const paths = {
  base: __dirname,
  dist: path.join(__dirname, "public", workspace),
  cleanPaths: ["public/" + workspace],
  contentBase: path.join(__dirname, "dist/" + workspace),
  htmlInput: "./cloudeditor/workspaces/" + workspace + "/index.html"
};
const publicPath = "";
const entry = "./cloudeditor/workspaces/" + workspace + "/index.js?quiet=true";
const prod = (argv.mode || "production") === "production" ? 1 : 0;

module.exports = require("./buildConfig")(entry, paths, publicPath, prod);
