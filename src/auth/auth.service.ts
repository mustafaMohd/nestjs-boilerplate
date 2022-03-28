import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './token.model';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { tokenTypes } from './constants';
import { ConfigService } from '../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  async logout(refreshToken) {
    const refreshTokenDoc = await this.tokenModel.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    if (!refreshTokenDoc) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await refreshTokenDoc.remove();
  }
  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  async refreshAuth(refreshToken) {
    try {
      const refreshTokenDoc = await this.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await this.userService.getById(refreshTokenDoc.user.toString());
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return this.generateAuthTokens(user);
    } catch (error) {
      throw new HttpException('Please authenticate', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Generate token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} [secret]
   * @returns {string}
   */
  generateToken(userId, expires, type) {
    const payload = {
      sub: userId,
      type,
    };
    return this.jwtService.sign(payload, { expiresIn: expires });
  }

  /**
   * Save a token
   * @param {string} token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  async saveToken(token, userId, expires, type, blacklisted = false): Promise<any> {
    const tokenDoc = await this.tokenModel.create({
      token,
      user: userId,
      expiresIn: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  }

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<Token>}
   */
  async verifyToken(token, type) {
    const payload = this.jwtService.verify(token);
    const tokenDoc = await this.tokenModel.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  async generateAuthTokens(user) {
    const accessTokenExpires = moment().add(this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES'), 'minutes');
    const accessToken = this.generateToken(
      user.id,
      `${this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES')}m`,
      tokenTypes.ACCESS,
    );

    const refreshTokenExpires = moment().add(this.configService.get('JWT_REFRESH_EXPIRATION_DAYS'), 'days');
    const refreshToken = this.generateToken(
      user.id,
      `${this.configService.get('JWT_REFRESH_EXPIRATION_DAYS')}d`,
      tokenTypes.REFRESH,
    );
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expiresIn: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expiresIn: refreshTokenExpires.toDate(),
      },
    };
  }
}
