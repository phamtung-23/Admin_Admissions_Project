import mongoose from 'mongoose';
const { Schema } = mongoose;


const LegendItemSchema = new mongoose.Schema({
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
  colorCode:{
    type: String
  },
  colorImage:{
    type: String
  },
  legendGroup: {
    type: mongoose.Types.ObjectId, 
    ref: "LegendGroup"
  }
},{timestamps: true})

export default mongoose.model("LegendItem", LegendItemSchema)