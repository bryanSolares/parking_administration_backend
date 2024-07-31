// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@config/(.*)$': '<rootDir>/src/server/config/$1',
    '^@routes/(.*)$': '<rootDir>/src/server/config/routes/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@assignment-module/(.*)$': '<rootDir>/src/assignment/$1',
    '^@assignment-module-application/(.*)$':
      '<rootDir>/src/assignment/application/$1',
    '^@assignment-module-core/(.*)$': '<rootDir>/src/assignment/core/$1',
    '^@assignment-module-infrastructure/(.*)$':
      '<rootDir>/src/assignment/infrastructure/$1',
    '^@location-module/(.*)$': '<rootDir>/src/location/$1',
    '^@location-module-application/(.*)$':
      '<rootDir>/src/location/application/$1',
    '^@location-module-core/(.*)$': '<rootDir>/src/location/core/$1',
    '^@location-module-infrastructure/(.*)$':
      '<rootDir>/src/location/infrastructure/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ]
};
