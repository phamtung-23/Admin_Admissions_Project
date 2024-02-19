import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import Field from '../../models/Field.js';
import User from '../../models/User.js';
import { createError } from '../../utils/error.js';


export const showOilFields = async (req, res, next) => {
  try {
    const fields = await Field.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('oilField/listOilField', 
    {
      user: mongooseToObject(user),
      fields: mutipleMongooseTonObject(fields),
      activeSideBar: 'fields'
    });
  } catch (err) {
    next(err);
  }
}

export const showCreateField = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('oilField/createOilField',{
      user: mongooseToObject(user),
      activeSideBar: 'fields'
    });
  } catch (err) {
    next(err);
  }
}

export const showEditField = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const fieldEdit = await Field.findById(req.params.id)
    // convert array [[[1,1],[2,1]]] coordinates to string "[[1,1],[2,1]]"
    const str = JSON.stringify(fieldEdit.location.coordinates).slice(1, -1);;
    res.render('oilField/editOilField', {
      field:mongooseToObject(fieldEdit), 
      coordinates:str, 
      user: mongooseToObject(user),
      activeSideBar: 'fields'
    })
  } catch (error) {
    next();
  }
}


