import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import PipeLine from '../../models/PipeLine.js';
import { createError } from '../../utils/error.js';


export const showPipeLine = async (req, res, next) => {
  try {
    const pipeLines = await PipeLine.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('pipeLine/listPipeLine', 
    {
      user: mongooseToObject(user),
      pipeLines: mutipleMongooseTonObject(pipeLines),
      activeSideBar: 'pipe'
    });
  } catch (err) {
    next(err);
  }
}

export const showCreatePipeLine = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('pipeLine/createPipeLine',{
      user: mongooseToObject(user),
      activeSideBar: 'pipe'
    });
  } catch (err) {
    next(err);
  }
}

export const showEditPipeLine = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const pipeLineEdit = await PipeLine.findById(req.params.id)
    // convert array [[[1,1],[2,1]]] coordinates to string "[[1,1],[2,1]]"
    const str = JSON.stringify(pipeLineEdit.location.coordinates).slice(1, -1);;
    res.render('pipeLine/editPipeLine', {
      pipeLine:mongooseToObject(pipeLineEdit), 
      coordinates:str, 
      user: mongooseToObject(user),
      activeSideBar: 'pipe'})
  } catch (error) {
    next();
  }
}


