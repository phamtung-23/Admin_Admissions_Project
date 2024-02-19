import mongoose from 'mongoose';
const { Schema } = mongoose;


const ServiceSchema = new mongoose.Schema({
  name:{
    vi:{
      type: String,
      unique: true
    },
    en:{
      type: String,
      unique: true
    }
  },
},{timestamps: true})

export default mongoose.model("Service", ServiceSchema)