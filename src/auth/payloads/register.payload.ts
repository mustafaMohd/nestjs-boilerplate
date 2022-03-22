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
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'password must  contain at least 1 letter and 1 number' })
  password: string;
}
function d(arg0: number, d: any) {
  throw new Error('Function not implemented.');
}
