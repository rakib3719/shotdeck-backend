// models/Otp.js

import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  collectionName:{
    type:String
  },

  shotId:{
    type:String,
    required:true
  }, 
  data:{
    type:Object,
    required:true
  }

});




const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
