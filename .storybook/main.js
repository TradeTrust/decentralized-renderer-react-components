const path = require("path");
const webpack = require("webpack");
const toPath = (_path) => path.join(process.cwd(), _path);
import custom from "../webpack.config.js";

module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-mdx-gfm", "@storybook/addon-webpack5-compiler-babel"],

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  webpackFinal: (config) => {
    return {
      ...config,
      // https://github.com/storybookjs/storybook/issues/13277#issuecomment-751747964
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "@emotion/styled": toPath("node_modules/@emotion/styled"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
        },
        fallback: {
          ...config.resolve.fallback,
          ...custom.resolve.fallback,
        },
      },
      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ["buffer", "Buffer"],
        })
      ]
    };
  },

  docs: {
    autodocs: true
  }
};
