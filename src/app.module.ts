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
import { TodoGroupModule } from './todo-group/todo-group.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './config/jwt.config';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          ...jwtConfig(),
        };
      },
    }),
    AuthModule,
    NotesModule,
    UserModule,
    TimeModule,
    TodoModule,
    TodoGroupModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AppModule { }
