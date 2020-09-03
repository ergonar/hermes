module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  roots: ['<rootDir>/src'],
  preset: '@shelf/jest-mongodb',
  // testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/dist/'],
};
