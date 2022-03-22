import { Schema, model, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { roles } from '../config/roles';
import * as bcrypt from 'bcryptjs';
//  User interface representing a document in MongoDB.
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified:boolean;
}
export interface IUserDocument extends IUser, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
}


//  User Schema corresponding to the document interface.
export const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
  {
    timestamps: true,
  }
);

// // add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
// userSchema.plugin(paginate);


/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
 UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// create and export User Model.
export const User = model<IUserDocument>('User', UserSchema);

