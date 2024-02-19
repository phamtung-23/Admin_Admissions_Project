import mongoose from 'mongoose';
const { Schema } = mongoose;


const LegendGroupSchema = new mongoose.Schema({
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

export default mongoose.model("LegendGroup", LegendGroupSchema)