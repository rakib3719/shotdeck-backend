import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
})

const SettingSChema = new mongoose.Schema({
  logo: {
    type: String,

  },
  websiteName: {
    type: String,

  },
  coverphoto: {
    type: Array

  },
  coverHeading:{
    type: String
  },
  
  coverDescription:{
    type:String
  },
  footerText:{
    type:String

  }
}, { timestamps: true })

const Setting = mongoose.model('Setting', SettingSChema);
export default Setting;
