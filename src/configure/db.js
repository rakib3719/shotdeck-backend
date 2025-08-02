
import dotenv from 'dotenv'

import mongoose from "mongoose"
dotenv.config();

const connectDB = async()=>{


try {
    const connect = await mongoose.connect('mongodb://shotdeck2:123456@127.0.0.1:27017/yourdbname?authSource=admin', {
        dbName: 'shotdeck', 
      });
   console.log(`moongdo db connected `);
    
} catch (error) {
    console.log(error.message, "error");
}
}

export default connectDB;









// mongodb://shotdeck2:123456@127.0.0.1:27017/yourdbname?authSource=admin



// import dotenv from 'dotenv'
// import mongoose from 'mongoose'

// dotenv.config();

// const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(
//       "mongodb://shotdeck2:123456@31.97.156.58:27017",
//       {
//         dbName: 'shotdeck',
//       }
//     );
//     console.log(`mongodb db connected`);
//   } catch (error) {
//     console.log(error.message, "error");
//   }
// }

// export default connectDB;



