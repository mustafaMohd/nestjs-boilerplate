import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './token.model';
import {Model } from 'mongoose';
import * as moment from 'moment';
import { tokenTypes } from './constants';
import { ConfigService } from 'src/config/config.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {

  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>,
  private readonly configService: ConfigService,
  private jwtService: JwtService,
  ) {}
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
 generateToken (userId, expires, type ){
  const payload = {
    sub: userId,
    type,
  };
  return this.jwtService.sign(payload,{expiresIn:expires.unix()});
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
 async saveToken(token, userId, expires, type, blacklisted = false) {
  const tokenDoc = await this.tokenModel.create({
    token,
    user: userId,
    expiresIn: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

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
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
async generateAuthTokens(user) {
  const accessTokenExpires = moment().add(this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES'), 'minutes');
  const accessToken = this.generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(this.configService.get('JWT_REFRESH_EXPIRATION_DAYS'), 'days');
  const refreshToken = this.generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
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
};



}
