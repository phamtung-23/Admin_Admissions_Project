import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessagesPdfSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type:{
    type :String,
  },
  messages: {
    type: Array,
    default: []
  }, 
});

export default mongoose.model('MessagesPdf', MessagesPdfSchema)