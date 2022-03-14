import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { roles } from '../config/roles';
import bcrypt from 'bcryptjs';
//  User interface representing a document in MongoDB.
export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

//  User Schema corresponding to the document interface.
const userSchema = new Schema<User>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
          }
        },
        private: true, // used by the toJSON plugin
      },
      role: {
        type: String,
        enum: roles,
        default: 'user',
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
  },
},
{
  timestamps: true,
});
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };
  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password:string):Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  };
  
  userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });
// create and export User Model.
export const UserModel = model<User>('User', userSchema);