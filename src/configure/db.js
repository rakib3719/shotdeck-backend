import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://shotdeck:shotdeckyekah564@localhost:27017/shotdeck?authSource=admin",
      {
        dbName: 'shotdeck',
      }
    );
    console.log(`mongodb db connected`);
  } catch (error) {
    console.log(error.message, "error");
  }
}

export default connectDB;
