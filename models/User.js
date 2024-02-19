import mongoose from 'mongoose';
const { Schema } = mongoose;


const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  fullname:{
    type: String
  },
  email:{
    type: String,
    unique: true
  },
  isActive:{
    type: Boolean,
    default: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  isManager:{
    type: Boolean,
    default: false
  }
},{timestamps: true})

export default mongoose.model("User", UserSchema)