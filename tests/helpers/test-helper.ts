import { getSecret } from 'common';
import { createLogger } from 'logger-nestjs';

/**
 * Credentials are used by `supertest.Test.auth()` function.
 */
export type Credentials = {
  username: string;
  password: string;
  options?: {
    type: 'basic' | 'auto';
  };
};

/**
 * Helper function for retrieving authentication credentials for testing purposes.
 * @param secret AWS SecretsManager Secret containing `username` and `password` with basic authentication for Ingress.
 */

export async function getAwsSecretsManagerCredentials(secret?: string): Promise<Credentials> {
  const logger = createLogger({
    mainContext: process.env.LOG_CONTEXT,
    logLevel: 'error',
  });

  if (typeof secret === 'string' && secret.length > 0) {
    return {
      ...(JSON.parse(await getSecret({ secretId: secret, logger })) as {
        username: string;
        password: string;
      }),
      options: { type: 'basic' },
    };
  } else {
    return { username: '', password: '' };
  }
}

/**
 * Helper function for initializing tests in consistent way.
 */
export async function testInit(): Promise<{
  appServer: string;
  basePath: string;
  credentials: Credentials;
}> {
  return {
    appServer: process.env.TEST_APP_SERVER ?? 'http://localhost:3000',
    basePath: `${process.env.TEST_BASE_PATH ? process.env.TEST_BASE_PATH : ''}`,
    credentials: await getAwsSecretsManagerCredentials(process.env.TEST_CREDENTIALS_SECRET),
  };
}
