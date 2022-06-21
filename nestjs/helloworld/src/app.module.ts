import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserModuleModule } from './user-module/user-module.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [UserModule, UserModuleModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
