const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const prefixer = require("postcss-prefix-selector");
const autoprefixer = require("autoprefixer");

const build = config => {
  const {
    namespace,
    entry,
    paths,
    publicPath,
    prod,
    sourcemaps,
    fileLoaderDirs,
    cleanDistDir,
    cssPrefix
  } = config;
  return {
    entry,
    output: {
      path: paths.dist,
      publicPath,
      filename: "[name].js",
      chunkFilename: prod ? "[name].[hash].chunk.js" : "[name].js"
    },
    devtool: sourcemaps ? "source-map" : "",
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: "eslint-loader"
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            query: {
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,

            "css-loader",
            "sass-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  prefixer({
                    prefix: cssPrefix,
                    exclude: [".cloudeditor", "body", "html"].concat(
                      cssPrefix ? [cssPrefix] : []
                    )
                  }),
                  autoprefixer({
                    browsers: ["last 4 versions"]
                  })
                ]
              }
            }
          ]
        },
        {
          test: /(\.(png|jpe?g|gif)$|^((?!font).)*\.svg$)/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: path => {
                  return fileLoaderDirs.images + "/[name]-[hash].[ext]";
                }
              }
            }
          ]
        },
        {
          test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: fileLoaderDirs.fonts + "/[name].[ext]?[hash]"
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: sourcemaps // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: paths.htmlInput,
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(paths.cleanPaths, { root: "", dry: cleanDistDir }),
      new CopyWebpackPlugin(
        [
          {
            from: "./" + namespace + "/core/locales/*/*.json",
            to: "./locales/[5]/[name].[ext]",
            toType: "template",
            test: /^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/
          },
          {
            from: "./" + namespace + "/plugins/*/locales/*/*.json",
            to: "./locales/[5]/[name].[ext]",
            toType: "template",
            test: /^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/
            /**
               * var regex1 = new RegExp(/^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/)
                var str1 = '\\cloudeditor-app\\cloudeditor\\plugins\\p1\\locales\\en-US\\translate.json';
               */
          }
        ],
        { debug: prod ? "" : "" }
      )
    ],
    devServer: {
      port: config.port
    },
    stats: "none" //https://webpack.js.org/configuration/stats/
  };
};

module.exports = build;
