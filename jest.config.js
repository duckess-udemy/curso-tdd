const makeModuleNameMapper = (tsconfigPath) => {
  // Get paths from tsconfig
  const { paths } = require(tsconfigPath).compilerOptions;

  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace("/*", "/(.*)");
    const path = paths[item][0].replace("/*", "/$1");
    aliases[key] = "<rootDir>/" + path;
  });
  return aliases;
};

const TS_CONFIG_PATH = "./tsconfig.json";
const SRC_PATH = "<rootDir>/src";

module.exports = {
  roots: [SRC_PATH],
  collectCoverage: true,
  preset: "@shelf/jest-mongodb",
  // collectCoverageFrom: [`${SRC_PATH}/**/*.ts`],
  moduleNameMapper: makeModuleNameMapper(TS_CONFIG_PATH),
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
