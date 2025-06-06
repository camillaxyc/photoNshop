import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
