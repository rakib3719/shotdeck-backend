import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  primaryIndustry: {
    type: String,
    required: [true, 'Primary industry is required'],
    enum: [
      'Advertising',
      'Film',
      'Television',
      'Digital Media',
      'Gaming',
      'Theater',
      'Music',
      'Education',
      'Other'
    ]
  },
  primaryOccupation: {
    type: String,
    required: [true, 'Primary occupation is required']
  },
  companyName: {
    type: String,
    trim: true
  },
  schoolName: {
    type: String,
    trim: true
  },
  otherDetails: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});


userSchema.index({ email: 1 });
userSchema.index({ primaryIndustry: 1 });
userSchema.index({ primaryOccupation: 1 });

export const User = mongoose.model('User', userSchema);