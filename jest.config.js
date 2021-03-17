module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/data/usecases/db-add-account-protocols.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-controller-protocols.ts',
    '!<rootDir>/src/presentation/protocols/index.ts'
  ],
  watchPathIgnorePatterns: ['globalConfig'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
