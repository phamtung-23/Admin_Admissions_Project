import mongoose from 'mongoose';
const { Schema } = mongoose;


const FieldSchema = new mongoose.Schema({
  fieldId: {
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
  colorCodeBg: {
    type: String
  },
  colorImage: {
    type: String // path to SVG file
  }
  
},{timestamps: true})

export default mongoose.model("Field", FieldSchema)