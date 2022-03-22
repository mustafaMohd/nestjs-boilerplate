import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,IUserDocument } from './user.model';


@Injectable()
export class UserService {
 constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>) {}
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

  async createUser(userBody): Promise<any> {
    if ( await this.isEmailTaken(userBody.email)) {
      throw new HttpException(
        'Email is already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await this.userModel.create(userBody);
    return user;

  }
  /**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {

  const user =  await this.userModel.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
}
