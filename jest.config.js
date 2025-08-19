/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
  verbose: true,
  coverageDirectory: "coverage",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)test.[jt]s?(x)"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.js?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
    "\\.(d\\.ts|[jt]sx?)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/_mocks_/fileMock.js",
    "\\.(css|sass|scss|less)$": "identity-obj-proxy",
    "\\.*?inline$": "<rootDir>/_mocks_/fileMock.js",
    "node:stream": "<rootDir>/node_modules/stream-browserify",
    "node:crypto": "<rootDir>/node_modules/crypto-browserify",
    "node:util": "<rootDir>/node_modules/util",
    "node:events": "<rootDir>/node_modules/events",
    "node:process": "<rootDir>/node_modules/process",
    "^cborg$": "<rootDir>/node_modules/cborg",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@digitalbazaar|@trustvc|@tradetrust-tt|@mattrglobal|base64url-universal|base58-universal|cborg|multiformats|uint8arrays)/)",
  ],
};

module.exports = config;
