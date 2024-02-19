import mongoose from 'mongoose';
const { Schema } = mongoose;


const CustomerSchema = new mongoose.Schema({
  name:{
    vi:{
      type: String,
      required: true,
      unique: true
    },
    en:{
      type: String,
      required: true,
      unique: true
    }
    
  },
},{timestamps: true})

export default mongoose.model("Customer", CustomerSchema)