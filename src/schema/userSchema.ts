import type { RefreshTokenInterface } from '@/interfaces/RefreshTokenInterface.js';
import type { IUser } from '@/interfaces/UserInterface.js';
import Joi from 'joi';

export const signUpSchema = Joi.object<IUser>({
  name: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
}).required();

export const signInSchema = Joi.object<IUser>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
}).required();

export const refreshTokenSchema = Joi.object<RefreshTokenInterface>({
  refresh_token: Joi.string().required(),
}).required();
