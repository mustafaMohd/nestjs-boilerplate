import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { Request } from 'express';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from './user.model';
@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: Request, @Res() res: Response, @CurrentUser() user: User) {
    const name = user.fullname;

    res.status(HttpStatus.OK).send(`Hi, ${name}`);
  }
}
