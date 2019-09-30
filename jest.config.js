module.exports = {
  "roots": [
    "<rootDir>/tests"
  ], "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/tests/setupEnzyme.ts"]
}