
// import dotenv from 'dotenv'

// import mongoose from "mongoose"
// dotenv.config();

// const connectDB = async()=>{


// try {
//     const connect = await mongoose.connect('mongodb+srv://shotdeck2:ROS0KZoq5HDmOlbz@cluster0.5sfxlm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//         dbName: 'shotdeck', 
//       });
//    console.log(`moongdo db connected `);
    
// } catch (error) {
//     console.log(error.message, "error");
// }
// }

// export default connectDB;










import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://shotdeck2:123456@127.0.0.1:27017/yourdbname?authSource=admin",
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

