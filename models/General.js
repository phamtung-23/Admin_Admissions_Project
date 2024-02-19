import mongoose from 'mongoose';
const { Schema } = mongoose;


const GeneralSchema = new mongoose.Schema({
  hexCode:{
    type: String,
    default: "#000000"    
  },
  expiresSessions: {
    type: Number,
    default: 720
  },
  iconOfClient:{
    type: String,
  },
  iconOfOilField:{
    type: String,
  },
  iconOfLocation: {
    type: String,
  }


},{timestamps: true})

export default mongoose.model("General", GeneralSchema)