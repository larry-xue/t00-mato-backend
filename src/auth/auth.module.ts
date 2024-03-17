import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
@Module({
  imports: [UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          ...jwtConfig(),
        };
      },
    }),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
