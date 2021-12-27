export default {
  "roots": [
    "<rootDir>/tests"
  ], "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testEnvironment": "jsdom",
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/tests/setupEnzyme.ts"]
}
