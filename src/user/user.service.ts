import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import User from './user.model';


@Injectable()
export class UserService {
  // constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

  async createUser(userBody): Promise<any> {
    if ( User.isEmailTaken(userBody.email)) {
      throw new HttpException(
        'Email is already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await User.create(userBody);
    return user;

  }
}
