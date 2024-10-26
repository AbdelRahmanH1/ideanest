import type { IUser } from '../../interfaces/UserInterface.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { CustomError } from '../../utils/customErrorUtils.js';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, min: 3, max: 10, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => {
        return /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, 'Password must be at least 6 characters long! '],
    maxlength: [20, 'Password cannot exceed 20 characters!'],
  },
  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds: any = parseInt(process.env.SALT_ROUND || '');
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
    } catch (error) {
      const customError = new CustomError(
        error instanceof Error ? error.message : 'Error Hashing password',
        500,
      );
      return next(customError);
    }
  }
  next();
});
const User = model<IUser>('User', userSchema);
export default User;
