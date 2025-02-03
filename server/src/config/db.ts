import mongoose from 'mongoose';

const configDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error Connecting To Mongoose', err);
    process.exit(1);
  }
};

export default configDB;