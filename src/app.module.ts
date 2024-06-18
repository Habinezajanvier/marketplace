import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { dataSource } from './config/db';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST_DEV,
      port: +process.env.DB_PORT_DEV,
      username: process.env.DB_USER_DEV,
      password: process.env.DB_PASS_DEV,
      database: process.env.DB_NAME_DEV,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
