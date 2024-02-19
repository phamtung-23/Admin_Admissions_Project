import User from '../../models/User.js';
import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'


// CREATE User [GET] /users/create
export const getFormCreate = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('user/create', {
      user:mongooseToObject(user),
      activeSideBar: 'users'
    })
  } catch (error) {
    next();
  }
}
// EDIT USER [GET] /users/:id/edit
export const getFormEdit = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const userEdit = await User.findById(req.params.id)
    res.render('user/edit', {
      user:mongooseToObject(user), 
      userEdit:mongooseToObject(userEdit),
      activeSideBar: 'users'})
  } catch (error) {
    next();
  }
}

// GET PROFILE [GET] /profile
export const getProfile = async (req,res)=>{
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('profile', {
      user:mongooseToObject(user),
      activeSideBar: 'profile'
    })
  } catch (error) {
    next();
  }
}
// GET User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}
// GET ALL  User [GET] /
export const getAllUser = async (req, res, next) => { 
  try {
    const user  = await User.findOne({_id: req.user.id})
    const userList  = await User.find({})

    res.render('user/list',{
      user:mongooseToObject(user), 
      users:mutipleMongooseTonObject(userList),
      activeSideBar: 'users'
    })
  } catch (error) {
    next();
  }
}