import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

/**
 * Register Payload Class
 */
export class RegisterPayload {
  /**
   * Email field
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Full Name field
   */

  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  fullname: string;

  /**
   * Password field
   */
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=\D*\d)[^a-z]*[a-z].*$/, { message: 'password must  contain at least 1 letter and 1 number' })
  password: string;
}

