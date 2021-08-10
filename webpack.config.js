const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: { 
    index: path.resolve(__dirname,"jscript", "app_startup_code.js"),
    /* target: path.resolve(__dirname,"jscript", "target_classes.js"), */
    /* batch:path.resolve(__dirname,"jscript", "app_batch_prediction_code.js"), */
  },
  output: { 
    filename:'[name].js',
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
    new CopyPlugin({
      patterns: [
        /* { from: 'source', to: 'dest' },
        { from: 'other', to: 'public' }, */
        { from: './model_kaggle_3', to: './model_kaggle_3'},
        {from: './assets', to:'./assets' }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
};
