export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                    esModuleInterop: true
                }
            }
        ]
    },
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/styleMock.js'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/']
};