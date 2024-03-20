import type { Config } from 'config/interfaces/config.interface';
import type { Environment } from 'src/types/enums';

export const initConfig = (): Config => ({
  nodeEnv: process.env.NODE_ENV as Environment,
  port: parseInt(process.env.PORT, 10),
  featureSlug: process.env.CDK_FEATURE_SLUG,
  logLevel: process.env.LOG_LEVEL,
  logContext: process.env.LOG_CONTEXT,
  db: {
    postgres: {
      url: process.env.TYPEORM_URL,
      logging: process.env.TYPEORM_LOGGING === 'true',
      migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
      migrations: process.env.TYPEORM_MIGRATIONS,
    },
  },
});
