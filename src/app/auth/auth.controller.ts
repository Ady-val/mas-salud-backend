import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse = await this.authService.login(loginDto);

    // res.cookie('access_token', loginResponse.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'lax',
    // });

    return {
      username: loginResponse.username,
      institution: loginResponse.institution,
      name: loginResponse.name,
      rules: loginResponse.rules,
      accessToken: loginResponse.accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['access_token'] as string | undefined;

    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('access_token');

    return { message: 'Logged out successfully' };
  }
}
