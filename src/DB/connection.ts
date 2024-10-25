import { connect } from 'mongoose';

export const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;

    if (!DB_URL) {
      throw new Error(
        'Database URL is not defined in the environment variables.',
      );
    }
    await connect(DB_URL);
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error(`Database connection error: ${error.message}`);
    throw error;
  }
};
