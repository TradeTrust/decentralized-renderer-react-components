/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV ?? "development",
  entry: path.join(__dirname, "./app.tsx"),
  externals: {},
  output: {
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    port: 9001,
    static: {
      directory: path.join(__dirname, "."),
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      process: "process/browser",
    },
    fallback: {
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer"),
      "process/browser": require.resolve("process/browser"),
      util: require.resolve("util/"),
      events: require.resolve("events/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: { loader: "css-loader", options: { url: false } },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.ContextReplacementPlugin(
      /(@mattrglobal\/node-bbs-signatures)/,
      `${__dirname}/node_modules/@mattrglobal/node-bbs-signatures`,
      {}
    )
  ],
};
