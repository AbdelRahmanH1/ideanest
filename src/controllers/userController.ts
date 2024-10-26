import User from '@/DB/models/userModel.js';
import { Role } from '@/enums/role.enum.js';
import type { IUser } from '@/interfaces/UserInterface.js';
import bcrypt from 'bcrypt';
import asynHandler from '@/utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { errorResponse, successResponse } from '@/utils/reponseUtils.js';
import type { Request, Response, NextFunction } from 'express';
import {
  deleteRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from '@/services/redisService.js';

import { CustomError } from '@/utils/customErrorUtils.js';
import type { RefreshTokenInterface } from '@/interfaces/RefreshTokenInterface.js';

export const signUp = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as IUser;
    const userExists = await User.findOne({ email: body.email });
    if (userExists) return errorResponse(res, 400, 'User already exists');
    await User.create({ ...body });
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
    const accessToken = jwt.sign({ userId: user._id }, sercretKey, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, {
      expiresIn: '7d',
    });
    await storeRefreshToken(user._id.toString(), refreshToken);
    return successResponse(res, 200, 'login sucess', {
      accessToken,
      refreshToken,
    });
  },
);

export const refreshToken = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body as RefreshTokenInterface;

    const sercretKey: string = process.env.TOKEN_SECRET || '';
    const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || '';

    const decoded = jwt.verify(refresh_token, refreshTokenSecret) as {
      userId: string;
      role: string;
    };

    const savedRefreshToken = await getRefreshToken(decoded.userId);
    if (!savedRefreshToken || savedRefreshToken !== refresh_token) {
      return next(new CustomError('Invalid or expired refresh token', 401));
    }
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      sercretKey,
      {
        expiresIn: '1h',
      },
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      refreshTokenSecret,
      { expiresIn: '7d' },
    );
    await storeRefreshToken(decoded.userId, newRefreshToken);
    return successResponse(res, 200, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  },
);
export const revokeRefreshToken = asynHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body as RefreshTokenInterface;
    const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || '';

    const decoded = jwt.verify(refresh_token, refreshTokenSecret) as {
      userId: string;
    };

    const storedToken = await getRefreshToken(decoded.userId);
    if (!storedToken || storedToken !== refresh_token) {
      return next(
        new CustomError('Refresh token not found or already revoked', 400),
      );
    }
    await deleteRefreshToken(decoded.userId);
    return successResponse(res, 200, 'Refresh token revoked successfully');
  },
);
