import Otp from "../models/otpModel.js";
import { generateOTP, sendEmail } from "../utils/utils.js";


export const saveOtp = async (req, res) => {
  try {
    const email = req.body.email; 
    const otp = generateOTP(); 
    const expires = new Date(Date.now() + 20 * 60 * 1000); 

   
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
   
      existingOtp.otp = otp;
      existingOtp.expiresAt = expires;
       
      await existingOtp.save();
    } else {
    
      await Otp.create({
        email,
        otp,
        expiresAt: expires,
        isVerify:false
      });
    }

   const otpInfo = await sendEmail(email, otp);
    res.status(200).json({
      message: 'OTP saved successfully',
      otpInfo

    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};


