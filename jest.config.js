module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageReporters: [
        'json',
        'text',
        'lcov',
        'clover',
    ],
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
};
