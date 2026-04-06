import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  await mongoose.connect(uri);
  // Keep logging minimal to avoid noisy output in tests
  console.log('MongoDB connected');
};

export default connectDB;
