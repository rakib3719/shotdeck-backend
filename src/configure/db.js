
import dotenv from 'dotenv'

import mongoose from "mongoose"
dotenv.config();

const connectDB = async()=>{


try {
    const connect = await mongoose.connect('mongodb+srv://shotdeck:WmzpbIAxLrR8gyYL@cluster0.5sfxlm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        dbName: 'shotdeck', 
      });
   console.log(`moongdo db connected `);
    
} catch (error) {
    console.log(error.message, "error");
}
}

export default connectDB;