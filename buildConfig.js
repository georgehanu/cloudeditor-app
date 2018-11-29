const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (entry, paths, publicPath, prod) => ({
  entry: {
    main: entry
  },
  output: {
    path: paths.dist,
    publicPath,
    filename: "[name].js",
    chunkFilename: prod ? "[name].[hash].chunk.js" : "[name].js"
  },
  devtool: prod ? "" : "source-map",
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
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /(\.(png|jpe?g|gif)$|^((?!font).)*\.svg$)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: path => {
                return "images/[name]-[hash].[ext]";
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
              name: "fonts/[name].[ext]?[hash]"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
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
    new CleanWebpackPlugin(paths.cleanPaths, { root: "" }),
    new CopyWebpackPlugin(
      [
        {
          from: "./cloudeditor/core/locales/*/*.json",
          to: "./locales/[5]/[name].[ext]",
          toType: "template",
          test: /^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/
        },
        {
          from: "./cloudeditor/plugins/*/locales/*/*.json",
          to: "./locales/[5]/[3].[ext]",
          toType: "template",
          test: /^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/
          /**
           * var regex1 = new RegExp(/^(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\.json$/)
            var str1 = '\\cloudeditor-app\\cloudeditor\\plugins\\p1\\locales\\en-US\\translate.json';
           */
        }
      ],
      { debug: prod ? "" : "info" }
    )
  ],
  devServer: {
    contentBase: paths.contentBase,
    hot: true,
    port: 8081
  }
});
