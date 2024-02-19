import mongoose from 'mongoose';
const { Schema } = mongoose;


const VersionSchema = new mongoose.Schema({
  version:{
    type: String,
    required: true,
    unique: true
  },

},{timestamps: true})

export default mongoose.model("Version", VersionSchema)