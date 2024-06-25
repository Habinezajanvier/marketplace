import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import UserService from './services/user.services';
import UserController from './controllers/user.controller';
import MessageService from './services/messages';
import { JwtService } from './helpers';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, MessageService, JwtService],
  controllers: [UserController],
})
export class UsersModule {}
