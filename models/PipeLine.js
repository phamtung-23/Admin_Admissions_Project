import mongoose from 'mongoose';
const { Schema } = mongoose;


const PipeLineSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  },
  colorCodeLine: {
    type: String,
    default: '#FFFFFF'
  },
  
},{timestamps: true})

export default mongoose.model("PipeLine", PipeLineSchema)