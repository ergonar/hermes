module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  // coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/dist/'],
};