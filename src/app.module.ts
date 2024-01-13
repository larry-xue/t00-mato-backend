import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserModule } from './user/user.module';
import { TimeModule } from './time/time.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    load: [databaseConfig],
  }),
  TypeOrmModule.forRoot(databaseConfig()), NotesModule, UserModule, TimeModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
