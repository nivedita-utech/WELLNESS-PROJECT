import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (dnsErr) {
        console.warn('Warning: Could not set custom DNS servers:', dnsErr.message);
      }
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
