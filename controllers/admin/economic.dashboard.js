import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import Economic from '../../models/Economic.js';
import { createError } from '../../utils/error.js';


export const showEconomic = async (req, res, next) => {
  try {
    const economics = await Economic.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('economic/listEconomic', 
    {
      user: mongooseToObject(user),
      economics: mutipleMongooseTonObject(economics),
      activeSideBar: 'economics'
    });
  } catch (err) {
    next(err);
  }
}

export const showCreateEconomic = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('economic/createEconomic',{
      user: mongooseToObject(user),
      activeSideBar: 'economics'
    });
  } catch (err) {
    next(err);
  }
}

export const showEditEconomic = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const economicEdit = await Economic.findById(req.params.id)
    // convert array [[[1,1],[2,1]]] coordinates to string "[[1,1],[2,1]]"
    const str = JSON.stringify(economicEdit.location.coordinates).slice(1, -1);;
    res.render('economic/editEconomic', {
      economic:mongooseToObject(economicEdit), 
      coordinates:str, 
      user: mongooseToObject(user),
      activeSideBar: 'economics'})
  } catch (error) {
    next();
  }
}


