import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Mongo DB Connected Successfully!🤩🤩🤩');
  } catch (e) {
    console.error(`Mongo DB Connection Failed ❌❌❌: ${e.message}`);
    process.exit(1);
  }
};
