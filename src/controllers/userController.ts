import User from '@/DB/models/userModel.js';
import { Role } from '@/enums/role.enum.js';
import type { IUser } from '@/interfaces/UserInterface.js';
import bcrypt from 'bcrypt';
import asynHandler from '@/utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { errorResponse, successResponse } from '@/utils/reponseUtils.js';
import type { Request, Response, NextFunction } from 'express';
import { storeRefreshToken } from '@/services/redisService.js';

import { CustomError } from '@/utils/customErrorUtils.js';

export const signUp = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as IUser;
    const userExists = await User.findOne({ email: body.email });
    if (userExists) return errorResponse(res, 400, 'User already exists');
    await User.create({ ...body, role: body.role ? body.role : Role.USER });
    return successResponse(res, 201, 'User created successfully');
  },
);
export const signIn = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as IUser;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new CustomError('Invalid email or password', 400);
    }
    const sercretKey: string = process.env.TOKEN_SECRET || '';
    const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || '';
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      sercretKey,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      refreshTokenSecret,
      {
        expiresIn: '7d',
      },
    );
    await storeRefreshToken(user._id.toString(), refreshToken);
    return successResponse(res, 200, 'login sucess', {
      accessToken,
      refreshToken,
    });
  },
);
