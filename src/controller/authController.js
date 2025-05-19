import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decodedToken } from "../middleware/middleware.js";
import Shot from "../models/shotModel.js";


export const register = async (req, res) => {
  const userData = req.body;

  try {
    // check mobile
    const existingUserByMobile = await User.findOne({ mobileNumber: userData.mobileNumber });
    if (existingUserByMobile) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          mobileNumber: "Mobile number already registered"
        }
      });
    }

    // email check
    const existingUserByEmail = await User.findOne({ email: userData.email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          email: "Email already registered"
        }
      });
    }

    // NID check
    const existingUserByNid = await User.findOne({ nid: userData.nid });
    if (existingUserByNid) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          nid: "NID already registered"
        }
      });
    }


    // balance & isApproved
    if (userData.accountType === 'user') {
      userData.balance = 40;
    } else if (userData.accountType === 'agent') {
      userData.balance = 0;
      userData.isApproved = false;
    }

    //  hash the pin
    const salt = await bcrypt.genSalt(10);
    userData.pin = await bcrypt.hash(userData.pin, salt);

    // create user
    const newUser = await User.create(userData);

    // don't expose pin
    newUser.pin = undefined;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error
    });
  }
};






export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(401).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const passwordMatch = user.password === password; 
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user?.role },
      'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6',
      { expiresIn: '1h' }
    );

       const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: false,
      secure: isProd,              
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });



    // res.cookie('token', token)
   
    res.status(200).json({
      message: 'Login successful',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};






export const logout = (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    // const { mobileNumber } = req.query;

    // let filter = {};
    // if (mobileNumber) {
    //   filter.mobileNumber = mobileNumber;
    // }

    const data = await User.find();
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error
    });
  }
};

export const getUser = async(req, res)=>{

  const token = req?.cookies?.token;
console.log(token, 'cookie asca ttttt');
const decoded = decodedToken(token);
console.log(decoded, 'decoded tokenm');
const resp = await User.findById(decoded?.id);
console.log(resp, 'ay jhai');



}





// export const getUserController = async (req, res) => {



//   try {
//     // 1. Get token from cookies
//     const token = req?.cookies?.token

    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authenticated'
//       });
//     }

//     // 2. Verify token
//     const decoded = decodedToken(token);
  
  
//     if (!decoded) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token'
//       });
//     }

//     // 3. Get user ID from token (assuming your token contains _id)
//     const userId = decoded.userId;


//     // 4. Fetch user from database (excluding sensitive fields)
//     const user = await User.findOne({_id:userId}).select('-pin -__v');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // 5. Return user data
//     return res.status(200).json({
//       success: true,
//       user
//     });

//   } catch (error) {
//     console.error('Error in getUserController:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };



