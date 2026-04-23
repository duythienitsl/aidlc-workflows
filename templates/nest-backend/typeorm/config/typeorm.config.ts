import * as path from 'path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: path.resolve(__dirname, '../../.env.local') });
config({ path: path.resolve(__dirname, '../../.env') });

const baseDir = path.join(__dirname, '..');

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, '../../src/**/*.entity{.ts,.js}')],
  migrations: [path.join(baseDir, 'migrations/**/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
