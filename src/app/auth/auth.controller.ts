// src/auth/auth.controller.ts

import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse = await this.authService.login(loginDto);

    res.cookie('access_token', loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      username: loginResponse.username,
      institutionId: loginResponse.institutionId,
      name: loginResponse.name,
      rules: loginResponse.rules,
    };
  }
}
