import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.email, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async sendVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // generate a random 6-digit code
    // store code mapping to email
    await this.storeCode(email, code);
    // send email
    await this.emailService.sendMail(email, 'Your Verification Code', `Your code is: ${code}`);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    // get code from mapping
    const isValid = await this.checkCode(email, code);
    if (!isValid) {
      throw new Error('Invalid or expired code.');
    }
    return true;
  }

  private async storeCode(email: string, code: string) {
    // implement code storage logic
  }

  private async checkCode(email: string, code: string) {
    // implement check logic
    return true;
  }
}