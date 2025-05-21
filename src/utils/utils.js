import nodemailer from 'nodemailer'
import Otp from '../models/otpModel.js';

export const  generateOTP = (length = 8)=> {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

export const sendEmail = async(email, otp )=>{
  try {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "rakib.fbinternational@gmail.com",
    pass: "gbjv irau ksag logr",
  },



});


const info = await transporter.sendMail({
  from: '"Otp Verification" <shotdeck@gmail.com>',
  to: email,
  subject: "Your One-Time Password (OTP)",
  text: `Your OTP is: ${otp}`, 
  html: `
  <div style="background-color: #121212; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
    <h2 style="color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 10px;">🔐 Verification Code</h2>
    <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
    <p style="font-size: 16px; line-height: 1.5;">
      Use the following One-Time Password (OTP) to complete your sign-in process. This code is valid for the next 10 minutes.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; background: #1e1e1e; padding: 15px 30px; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #00e5ff; border-radius: 6px; border: 1px solid #333;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 14px; color: #aaa;">If you did not request this, please ignore this email or contact support.</p>
    <p style="font-size: 14px; margin-top: 30px;">Thanks,<br><strong>ShotDeck Team</strong></p>
  </div>
  `
});

return info;





    
  } catch (error) {
    return error;
  }
}

export const verifyOtp = async (email, otp) => {
  console.log(email, otp);
  
  try {


    const findEmail = await Otp.findOne({ email });

    if (!findEmail) {
      return {
        message: 'OTP has expired or was not requested for this email address.'
      };
    }

    const existingOtp = findEmail.otp;


    if (otp !== existingOtp) {
      return {
        message: 'The OTP you entered is incorrect. Please try again.'
      };
    }
 await findEmail.updateOne({ isVerify: true });
    return {
      message: 'OTP verification successful.'
    };

  } catch (error) {
    return {
      message: error.message,
      error
    };
  }
};



export const sendPassword = async(email, otp )=>{
  try {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "rakib.fbinternational@gmail.com",
    pass: "gbjv irau ksag logr",
  },



});


const info = await transporter.sendMail({
  from: '"Temporary Password" <shotdeck@gmail.com>',
  to: email,
  subject: "Your Temporery Password ",
  text: `Your Temporary Password is: ${otp}`, 
  html: `
  <div style="background-color: #121212; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
    <h2 style="color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 10px;">🔐 Verification Code</h2>
    <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
    <p style="font-size: 16px; line-height: 1.5;">
      Use the following One-Time Password (OTP) to complete your sign-in process. This code is valid for the next 10 minutes.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; background: #1e1e1e; padding: 15px 30px; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #00e5ff; border-radius: 6px; border: 1px solid #333;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 14px; color: #aaa;">If you did not request this, please ignore this email or contact support.</p>
    <p style="font-size: 14px; margin-top: 30px;">Thanks,<br><strong>ShotDeck Team</strong></p>
  </div>
  `
});

return info;





    
  } catch (error) {
    return error;
  }
}

