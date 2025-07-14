
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
      `mongodb://shotdeck:959UI8*%28%3F%5C%5C%3Afedih%23%40*4JkaK87%5E%25!%7C33@31.97.156.58:27017
`,
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



// db.createUser({
//   user: "admin",
//   pwd: "959UI8*(?\\:fedih#@*4JkaK87^%!|33", 
//   roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
// })