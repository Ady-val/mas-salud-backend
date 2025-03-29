import { DataSource } from 'typeorm';
import { User } from './app/users/users.entity';
import { Institution } from './app/institutions/institutions.entity';
import { SessionEntity } from './app/auth/sessions/sessions.entity';
import { Beneficiary } from './app/beneficiaries/beneficiaries.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'massalud',
  password: 'contra123',
  database: 'mas_salud',
  entities: [User, Institution, SessionEntity, Beneficiary],
  migrations: ['../migrations/*.ts'],
  synchronize: false,
  logging: ['error'],
  // logging: ['query', 'error', 'schema'],
});
