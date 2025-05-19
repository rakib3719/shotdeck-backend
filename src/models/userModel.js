import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
 
password: {
    type: String,
    required: [true, 'PIN is required'],


  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
   
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
   
   
  },
 

  
  

  lastLogin: {
    type: Date
  },
 
}, { timestamps: true });





export const User = mongoose.model('User', userSchema);

