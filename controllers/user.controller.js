import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js';

// UPDATE User [PUT] /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const {username, password, ipAddress, email, fullname} = req.body
    const _id = req.params.id
    
    // Check if username and password are not empty
    if (!username || !ipAddress || !fullname || !email) {
      return res.status(400).json({ message: 'These are the required fields!' });
    }
    
    // Check if username is unique
    const existingUser = await User.findOne({ _id });
    const newUser = await User.findOne({ username });
    if (existingUser.username != username && newUser) {
      return res.status(400).json({ message: 'Username already exists, please try a different username!' });
    }

     // Check if username meets the conditions
     const usernameRegex = /^[A-Za-z][A-Za-z0-9]{0,15}$/;
     if (!usernameRegex.test(username)) {
       return res.status(400).json({ message: 'Username must meet the following conditions:\n- Contains at least 1 alphabet character\n- No spaces or special characters in the username\n- Length is less than 16 characters' });
     }

    //  password exsit
    let dataUpdate 
    if (password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be 8-16 characters long, with at least 1 alphabet character and 1 special character!' });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      dataUpdate = {
        ...req.body,
        password: hash
      }
    }
    dataUpdate = {
      ...req.body
    }
    // check email exist
    if(email != existingUser.email){
      const isExistEmail =  await User.findOne({email})
      if (isExistEmail){
        return res.status(400).json({ message: 'Email already exists, please try a different email!' });
      }
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {$set:dataUpdate},{new:true})
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({message:error});
  }
}
// DELETE User [DELETE] /users/:id
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'Delete successful!'});
  } catch (error) {
    res.status(500).json(error);
  }
}
// GET User [GET] /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}
// // GET ALL  User
// export const getAllUser = async (req, res, next) => { 
//   try {
//     const users = await User.find()
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }

// [PUT] /profile/:id 
export const updateProfile = async (req, res, next) => {
  try {
    const {currentPassword, newPassword, fullname, email} = req.body
    const _id = req.params.id

    // Check if username and password are not empty
    if (!fullname || !email) {
      return res.status(400).json({ message: 'Name and email are required fields!' });
    }

    const user  = await User.findOne({_id})
    // check current password
    if(currentPassword){
      // check password correct
      const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.password)
      if(!isPasswordCorrect) {
        return next(createError(400, {message:'Old password is incorrect, please try again!'}))
      }
    }

    // check new password
    if(newPassword){
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be 8-16 characters long, with at least 1 alphabet character and 1 special character' });
      }
    }

    // check email valid
    if(email != user.email){
      const isExistEmail =  await User.findOne({email})
      if (isExistEmail){
        return res.status(400).json({ message: 'Email already exists, please try a different email!' });
      }
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: {
      fullname,
      email,
      password: newPassword ? bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)) : user.password
    }},{new:true})
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
}
