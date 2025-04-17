import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { entities } from './src/common/entities';

dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_NAME
) {
  throw new Error('Missing required environment variables for database connection');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: entities,
  migrations: ['migrations/'],
  synchronize: false,
  logging: ['error'],
});
