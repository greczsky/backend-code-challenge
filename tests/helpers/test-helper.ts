/**
 * Helper function for initializing tests in consistent way.
 */
export function testInit(): {
  appServer: string;
  basePath: string;
} {
  return {
    appServer: process.env.TEST_APP_SERVER ?? 'http://localhost:3000',
    basePath: `${process.env.TEST_BASE_PATH ? process.env.TEST_BASE_PATH : ''}`,
  };
}
