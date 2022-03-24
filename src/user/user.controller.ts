import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: any,@Res() res: any): string {
const user=req.user;
    return `Hello ${user.fullname}`;
  }
}
