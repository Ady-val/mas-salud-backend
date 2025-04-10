import { DataSource } from 'typeorm';
import {
  User,
  Institution,
  SessionEntity,
  Beneficiary,
  Product,
  InventoryItem,
} from './common/entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'massalud',
  password: 'contra123',
  database: 'mas_salud',
  entities: [User, Institution, SessionEntity, Beneficiary, Product, InventoryItem],
  // migrations: ['migrations/*.ts'],
  migrations: ['../migrations/*.ts'],
  synchronize: false,
  logging: ['error'],
  // logging: ['query', 'error', 'schema'],
});
