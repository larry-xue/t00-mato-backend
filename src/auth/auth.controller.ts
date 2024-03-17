import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    let token: { access_token: string } = { access_token: '' };
    try {
      token = await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      return res.send({ message: 'Invalid credentials' });
    }

    // set cookie
    res.cookie('Authentication', token.access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.send({ message: 'Login successful' });
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.send({ message: 'Logout successful' });
  }

  @Post('send-code')
  async sendCode(@Body() body: { email: string }) {
    await this.authService.sendVerificationCode(body.email);
    return { message: 'Verification code sent.' };
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    await this.authService.verifyCode(body.email, body.code);
    // check user exists
    // if not exists, create user, then generate token
    // if exists, generate token
    return { message: 'Verified successfully.' };
  }
}