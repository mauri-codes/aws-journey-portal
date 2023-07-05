export default {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  rootDir: "unit_tests",
  testPathIgnorePatterns: [
    "/node_modules/"
  ]
};
