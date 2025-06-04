// models/Otp.js

import mongoose from 'mongoose';

const collectionNameSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },


  name:{
    type:String,
    required:true
  }

});




const CollectionName = mongoose.model('CollectionName', collectionNameSchema);
export default CollectionName;
