import mongoose from 'mongoose';

export const connect = async () =>{
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/admissions_db')
    console.log("connect successfully!!!")
  } catch (error) {
    console.log("connect failure!!!")
  }
}