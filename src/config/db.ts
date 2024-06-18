import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const env = process.env.NODE_ENV || 'development';

console.log({ env });

const development = {
  // username: process.env.DB_USER_DEV,
  username: configService.get<string>('DB_USER_DEV'),
  password: configService.get<string>('DB_PASS_DEV'),
  host: configService.get<string>('DB_HOST_DEV'),
  port: configService.get<string>('DB_PORT_DEV'),
  name: configService.get<string>('DB_NAME_DEV'),
  type: (configService.get<string>('DB_TYPE_DEV') as DbType) || 'postgres',
};
const test = {
  username: process.env.DB_USER_TEST,
  password: process.env.DB_PASSWORD_TEST,
  host: process.env.DB_HOST_TEST,
  port: process.env.DB_PORT_TEST,
  name: process.env.DB_NAME_TEST,
  type: (process.env.DB_TYPE_DEV as DbType) || 'postgres',
};
const staging = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  type: (process.env.DB_TYPE as DbType) || 'postgres',
};
const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  type: (process.env.DB_TYPE as DbType) || 'postgres',
};

const config: {
  [key: string]: envData;
} = {
  development,
  test,
  staging,
  production,
};

export const dataSource: TypeOrmModuleOptions = {
  type: config[env].type,
  logging: false,
  synchronize: true,
  host: config[env].host,
  port: Number(config[env].port as string),
  username: config[env].username,
  password: config[env].password,
  database: config[env].name,
  migrations: [__dirname + '/migrations/'],
  entities: [__dirname + '/models/*{.js,.ts}'],
};

console.log({ dataSource });
