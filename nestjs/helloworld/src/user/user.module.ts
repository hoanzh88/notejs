import { Module } from '@nestjs/common';
import { User } from './user';
import { UserController } from './user/user.controller';

@Module({
  providers: [User],
  controllers: [UserController]
})
export class UserModule {}
