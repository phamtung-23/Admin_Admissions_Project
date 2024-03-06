import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessagesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  messages: {
    type: Array,
    default: []
  }, 
});

export default mongoose.model('Messages', MessagesSchema)