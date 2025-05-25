import mongoose from 'mongoose'

const ServiceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
})

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  frontImg: {
    type: String,
    required: true
  },
  gallery: {
    type: [String],
    required: true
  },
  serviceType: {
    type: [ServiceTypeSchema],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bestFor: {
    type: [String],
    default: []
  },
  features: {
    type: [String],
    default: []
  }
}, { timestamps: true })

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
