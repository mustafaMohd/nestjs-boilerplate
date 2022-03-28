import { Body, Controller, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayload } from './payloads/login.payload';
import { LogoutPayload } from './payloads/logout.payload';
import { RegisterPayload } from './payloads/register.payload';
import { Response } from 'express';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UserService) {}
  @Post('register')
  async register(@Req() req: Request, @Res() res: Response, @Body() payload: RegisterPayload) {
    const user = await this.usersService.createUser(payload);
    const tokens = await this.authService.generateAuthTokens(user);
    res.status(HttpStatus.CREATED).send({ user, tokens });
  }
  @Post('login')
  async login(@Res() res: Response, @Body() payload: LoginPayload) {
    const user = await this.usersService.getByEmail(payload.email);
    if (!user || !user.isPasswordMatch(payload.password)) {
      throw new UnauthorizedException('Could not authenticate. Please try again.');
    }
    const tokens = await this.authService.generateAuthTokens(user);
    res.status(HttpStatus.OK).send({ user, tokens });
  }
  @Post('logout')
  async logout(@Res() res: Response, @Body() payload: LogoutPayload) {
    await this.authService.logout(payload.refreshToken);
    res.status(HttpStatus.NO_CONTENT).send();
  }
  @Post('refreshAuth')
  async refreshAuth(@Res() res: Response, @Body() payload: LogoutPayload) {
    const tokens = await this.authService.refreshAuth(payload.refreshToken);
    res.status(HttpStatus.OK).send({ ...tokens });
  }
}
