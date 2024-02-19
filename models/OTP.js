import mongoose from 'mongoose';
const { Schema } = mongoose;


const OTPSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  code:{
    type: String,
    required: true
  },
  isFalse:{
    type: Number,
    default: 0
  },
  isAllow:{
    type: Boolean,
    default: true
  },
  dateBlock:{
    type: Date,
    default: null
  }
},{timestamps: true})

export default mongoose.model("OTP", OTPSchema)