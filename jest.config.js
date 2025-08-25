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
    "\\.(css|sass|scss)$": "identity-obj-proxy",
    "node:stream": "<rootDir>/node_modules/stream-browserify",
    "node:util": "<rootDir>/node_modules/util",
    "node:events": "<rootDir>/node_modules/events",
    "node:process": "<rootDir>/node_modules/process",
    "^cborg$": "<rootDir>/node_modules/cborg/cborg.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@digitalbazaar|@trustvc|@mattrglobal|base64url-universal|base58-universal|cborg|multiformats|uint8arrays)/)",
  ],
};

module.exports = config;
