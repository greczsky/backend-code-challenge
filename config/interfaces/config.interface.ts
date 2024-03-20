import type { Environment } from 'src/types/enums';

export interface Config {
  nodeEnv: Environment;
  port: number;
  featureSlug?: string;
  logLevel: string;
  logContext: string;
  db: {
    postgres: {
      url: string;
      logging: boolean;
      migrationsRun: boolean;
      migrations: string;
    };
  };
}
