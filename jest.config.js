module.exports = {
  verbose: true,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|yml)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "<rootDir>/tests/__mocks__/styleMock.js",
  },
  moduleFileExtensions: ["worker.js", "js", "json"],
  moduleDirectories: ["node_modules", "app/node_modules"],
  modulePaths: ["src"],
  setupFiles: [
    "<rootDir>/tests/__setup__/enzyme",
    "<rootDir>/tests/__setup__/jest",
    "<rootDir>/tests/__setup__/common",
  ],
  setupFilesAfterEnv: ["jest-enzyme"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testEnvironment: "enzyme",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
