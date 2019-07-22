
module.exports = {
  testMatch: [
    '<rootDir>/test/**/*.(spec|test).(js|jsx|ts|tsx)|<rootDir>/**/__tests__/*.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts}'
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
}
