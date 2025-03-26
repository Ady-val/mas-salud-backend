import { DataSource } from 'typeorm';
import { User } from './app/users/users.entity';
import { Institution } from './app/institutions/institutions.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'massalud',
  password: 'contra123',
  database: 'mas_salud',
  entities: [User, Institution],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['query', 'error', 'schema'],
});
