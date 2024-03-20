declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      LOG_LEVEL: string;
      LOG_CONTEXT: string;

      TYPEORM_URL: string;
      TYPEORM_MIGRATIONS_RUN: string;
      TYPEORM_LOGGING: string;
      TYPEORM_MIGRATIONS: string;

      TEST_BASE_PATH: string;
      TEST_APP_SERVER: string;
      TEST_CREDENTIALS_SECRET?: string;
    }
  }
}

export {};
