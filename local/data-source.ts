import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// eslint-disable-next-line import/no-default-export
export default new DataSource({
  type: 'postgres',
  url: process.env.TYPEORM_URL,
  migrations: ['./scripts/migrations/*.ts'],
});
