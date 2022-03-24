import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterPayload } from '../auth/payloads/register.payload';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */

  async createUser(userBody: RegisterPayload): Promise<any> {
    if (await this.isEmailTaken(userBody.email)) {
      throw new HttpException('Email is taken', HttpStatus.BAD_REQUEST);
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
    const user = await this.userModel.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
  /**
   * Find by email
   * @param {string} email - The user's email
   * @returns {Promise<User>}
   */
  async getByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
   /**
   * Find by id
   * @param {string} id - The user's email
   * @returns {Promise<User>}
   */
    async getById(id: string): Promise<User> {
      return await this.userModel.findById(id);
    }
}
