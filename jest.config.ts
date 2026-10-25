import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  // COUNT_MODULES=1 logs how many files under node_modules/@mui/* each run loads.
  ...(process.env.COUNT_MODULES === "1" && {
    resolver: "<rootDir>/scripts/counting-resolver.js",
  }),
};

export default createJestConfig(config);
