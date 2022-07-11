import "reflect-metadata";

export default {
  bail: true,
  verbose: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/*.spec.ts"],
};
