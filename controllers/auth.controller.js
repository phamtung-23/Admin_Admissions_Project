import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import {createError} from '../utils/error.js'
import General from '../models/General.js';

// [POST] /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, password, fullname, email, rePassword } = req.body;

    // Check if username and password are not empty
    if (!username || !password || !fullname || !email) {
      return res.status(400).json({ message: 'These are the required fields' });
    }
   

    // Check if username is unique
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists, please try a different username!' });
    }

    // Check if username meets the conditions
    const usernameRegex = /^[A-Za-z][A-Za-z0-9]{0,15}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Username must meet the following conditions:</br>- Contains at least 1 alphabet character</br>- No spaces or special characters in the username</br>- Length is less than 16 characters' });
    }

    // Check if password meets the conditions
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters long, with at least 1 alphabet character and 1 special character!' });
    }
    // check compare password and rePassword
    if (password != rePassword) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }

    // Check if email is valid
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists, please try a different email!' });
    }
    
     
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      ...req.body,
      password: hash
    });

    await newUser.save();
    res.status(200).json({message:'Account created successfully!'});
  } catch (error) {
    next(error);
  }
};
// [POST] /api/auth/login
export const login = async (req, res, next) => {
  try {
    const user  = await User.findOne({username: req.body.username})
    // check user exist
    if(!user) {
      return next(createError(404, {message:"Username or password incorrect. Please try again."}))
    }
    // check password correct
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordCorrect) {
      return next(createError(400, {message:"Username or password incorrect. Please try again."}))
    }
    // check active account
    if(!user.isActive) {
      return next(createError(400, {message:"Your account has been locked. Please contact the administrator for support."}))
    }
   
    // set cookie for login
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, isManager: user.isManager}, process.env.JWT)
    const {password, isAdmin, isManager, isActive, ...otherDetails} = user._doc

    const expirationDate = new Date(new Date().getTime() + (12 + 7) * 60 * 60 * 1000)
    res.cookie("access_token",token,{
      httpOnly: true,
      expires: expirationDate
    }).status(200).json({details:{...otherDetails}, isAdmin, isManager, isActive})
  } catch (error) {
    next(error);
  }
}

export const loginMobile = async (req, res, next) => {
  try {
    const user  = await User.findOne({username: req.body.username})
    const generalSetting = await General.find()
    const expiresTime = generalSetting[0].expiresSessions
    // check user exist
    if(!user) {
      return next(createError(404, {vi:'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.!',en:"Username or password incorrect. Please try again."}))
    }
    // check password correct
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordCorrect) {
      return next(createError(400, {vi:'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.!',en:"Username or password incorrect. Please try again."}))
    }
    // check active account
    if(!user.isActive) {
      return next(createError(400, {vi:'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để được hỗ trợ.',en:"Your account has been locked. Please contact the administrator for support."}))
    }
    
    // set cookie for login
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, isManager: user.isManager}, process.env.JWT)
    // const {password, isAdmin, isManager, isActive, ...otherDetails} = user._doc
    
    res.status(200).json({token, expires: expiresTime})
  } catch (error) {
    next(error);
  }
}
// ...

