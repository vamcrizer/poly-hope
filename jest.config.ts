import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Rewrite .js extensions to allow ts-jest ESM resolution
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  // db.ts opens the DB at module load; each test file gets its own worker
  // so env vars set in globalSetup or at the top of the file won't affect it.
  // Instead we use a setupFiles script that runs inside the worker before any imports.
  setupFiles: ['<rootDir>/__tests__/setup-env.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
};

export default config;
