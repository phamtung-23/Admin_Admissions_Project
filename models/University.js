import mongoose from 'mongoose';
const { Schema } = mongoose;


const UniversitySchema = new mongoose.Schema({
  searchName: {
    type: String,
    required: true
  },
  name: {
    vi: {
      type: String,
      unique: true,
      required: true
    },
    en: {
      type: String,
      unique: true,
      required: true
    } 
  },
  imgCover:{
    type: String,
    required: true
  },
  icon:{
    type: String,
    required: true
  },
  code: {
    type: String, 
    required: true,
    unique: true
  },
  type:{
    type: String,
    required: true
  },
  trainingSystem:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  website:{
    type: String,
    required: true
  },
  facebook:{
    type: String
  },
  imgGallery:{
    type: [String],
    required: true
  },
  // infoAdmission:{
  //   type: [String]
  // }
  infoAdmission:{
    type: String
  }
  
},{timestamps: true})

export default mongoose.model("University", UniversitySchema)