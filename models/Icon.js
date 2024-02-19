import mongoose from 'mongoose';
const { Schema } = mongoose;

const IconSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String, 
    required: true
  },
  status: {
    type: String,
    enum: ['In use', 'Not in use'],
    default: 'Not in use' 
  },
  projects: {
    type: [String],
  },
});

export default mongoose.model('Icon', IconSchema)