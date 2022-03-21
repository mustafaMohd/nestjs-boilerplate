import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginPayload } from './payloads/login.payload';
import { RegisterPayload } from './payloads/register.payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UserService,) {}
  @Post('register')
  async register(@Body() payload: RegisterPayload) {
    const user = await this.usersService.createUser(payload);
   // const tokens = await this.authService.generateAuthTokens(user);

    return { user };
  }
  // @Post('login')
  // async login(@Body() payload: LoginPayload) {
  //   const user = await this.usersService.getByEmail(payload.email);

  //   if (!user || !(await user.isPasswordMatch(payload.password))) {
  //     throw new Error('Incorrect email or password');
  //     // throw new UnauthorizedException(
  //     //     "Could not authenticate. Please try again.",
  //     //   );
  //   }

  //   // const foundUserCopy = { ...user.toObject() };

  //   // delete foundUserCopy.password;
  //   // delete foundUserCopy.__v;

  //   const tokens = await this.authService.generateAuthTokens(user);

  //   return { user, tokens };
  // }
}
