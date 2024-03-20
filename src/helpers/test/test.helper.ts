import type { DataSource } from 'typeorm';

/**
 * @deprecated use "refreshDb" from "@libs-365/common" instead
 */
export async function refreshDb(dataSource: DataSource): Promise<DataSource> {
  if (dataSource.isInitialized) {
    await dataSource.dropDatabase();
    await dataSource.runMigrations({ transaction: 'all' });
  }

  return dataSource;
}
