import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

/**
 * Login Paylaod Class
 */
export class LoginPayload {
  /**
   * Email field
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password field
   */

  @IsNotEmpty()
  password: string;
}
