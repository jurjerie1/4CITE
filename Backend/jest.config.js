export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          useESM: true,
        },
      ],
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // lance les tests quand je le demande
    watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  };