import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decodedToken } from "../middleware/middleware.js";
import Shot from "../models/shotModel.js";
import Otp from "../models/otpModel.js";
import { generateOTP, sendPassword, verifyOtp } from "../utils/utils.js";

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, primaryIndustry, primaryOccupation } = req.body;


    if (!email || !password  || !primaryIndustry || !primaryOccupation) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        requiredFields: ['email', 'password', 'confirmPassword', 'primaryIndustry', 'primaryOccupation']
      });
    }

   

  

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(401).json({
        message: 'No verification record found. Please complete verification first'
      });
    }

    if (!otpRecord.isVerify) {
      return res.status(401).json({
        message: 'Email not verified. Please verify your email first'
      });
    }


    const otpExpirationTime = 10 * 60 * 1000; 
    const currentTime = new Date();
    const otpCreationTime = otpRecord.createdAt;

    if (currentTime - otpCreationTime > otpExpirationTime) {
      return res.status(401).json({
        message: 'Verification expired. Please request a new verification code'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email'
      });
    }

    const hashPassword = await bcrypt.hash(password, 10)
    // Create new user
    const newUser = await User.create({
      ...req.body,
      password : hashPassword, 
      role: 'user', 
      verified: true 
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      primaryIndustry: newUser.primaryIndustry,
      primaryOccupation: newUser.primaryOccupation,
      companyName: newUser.companyName,
      schoolName: newUser.schoolName,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      message: 'Registration successful',
      data: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'User already exists with this email'
      });
    }

    // Handle validation errors
    // if (error.name === 'ValidationError') {
    //   const errors = Object.values(error.errors).map(err => err.message);
    //   return res.status(400).json({
    //     message: 'Validation error',
    //     errors
    //   });
    // }

    return res.status(500).json({
      message: error.message,
      error
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

    const isMatch = await bcrypt.compare(password, user.password);
    

    // const passwordMatch = user.password === password; 
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user?.role },
      'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6',
   
    );

       const isProd = process.env.NODE_ENV === "production";

    // res.cookie("token", token, {
    //   httpOnly: false,
    //   secure: isProd,              
    //   sameSite: isProd ? "None" : "Lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });



    // res.cookie('token', token)



    const userData = {
      id: user?._id,
      role: user?.role,
      token
    }
   
    res.status(200).json({
      message: 'Login successful',
   
    userData
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




// export const getAllUsers = async (req, res) => {
//   try {
//     // const { mobileNumber } = req.query;

//     // let filter = {};
//     // if (mobileNumber) {
//     //   filter.mobileNumber = mobileNumber;
//     // }

//     const data = await User.find();
//     res.status(200).json({
//       success: true,
//       data: data
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Something went wrong!',
//       error
//     });
//   }
// };

export const getUser = async(req, res)=>{

  const token = req?.cookies?.token;
console.log(token, 'cookie asca ttttt');
const decoded = decodedToken(token);
console.log(decoded, 'decoded tokenm');
const resp = await User.findById(decoded?.id);
console.log(resp, 'ay jhai');



}

// otp verification

export const otpVerification = async(req, res)=>{

  try {
 

    const {email, otp} = req.body;

  const {message} = await verifyOtp(email, otp);
  console.log(message, 'msg')

  if(message !== 'OTP verification successful.'){
 return   res.status(401).json({
      message
    })
  }

  res.status(201).json({
    message
  })
    
  } catch (error) {
    res.status(401).json({
      message:'Something went wrong!',
      error
    })
  }
}


export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate temporary password
    const password = generateOTP();
    const hashPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'Email not found! Please register first'
      });
    }

    // Send email with the temporary password
    await sendPassword(email, password);

    // Update user's password in database
    const result = await User.updateOne(
      { email }, // Filter
      { $set: { password: hashPassword } } // Update
    );

    // Check if update was successful
    if (result.modifiedCount === 0) {
      throw new Error('Failed to update password');
    }

    res.status(200).json({
      message: 'Password reset successful',
      temporaryPasswordSent: true // Indicate temp password was sent
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


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



// 