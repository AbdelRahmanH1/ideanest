import 'dotenv/config';
import 'module-alias/register.js';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { CustomError } from './utils/customErrorUtils.js';
import { connectDB } from './DB/connection.js';
import userRouter from './routers/userRouter.js';
import cors from 'cors';
import organizationRouter from './routers/organizationRouter.js';
import { initializeRedisClient } from './services/redisService.js';
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
await initializeRedisClient();
await connectDB();

app.use('/', userRouter);
app.use('/organization', organizationRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError('Resource not found', 400);
  next(error);
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Start successfully at port ${PORT}`);
});
