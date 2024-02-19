import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import LegendGroup from '../../models/LegendGroup.js';
import LegendItem from '../../models/LegendItem.js';
import { createError } from '../../utils/error.js';


export const getListLegendGroup = async (req, res, next) => {
  try {
    const legendGroup = await LegendGroup.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('legendGroup/listLegendGroup', 
    {
      user: mongooseToObject(user),
      legendGroup: mutipleMongooseTonObject(legendGroup),
      activeSideBar: 'legendGroup'
    });
  } catch (err) {
    next(err);
  }
}

export const getCreateLegendGroup = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('legendGroup/createLegendGroup',{
      user: mongooseToObject(user),
      activeSideBar: 'legendGroup'
    });
  } catch (err) {
    next(err);
  }
}

export const handleCreateLegendGroup = async (req, res, next) => {
  
  try {
    const { nameVi, nameEn } = req.body
    const legendGroupVi = await LegendGroup.findOne({ 'name.vi': nameVi });
    const legendGroupEn = await LegendGroup.findOne({ 'name.vi': nameEn });

    if(!nameEn || !nameVi){
      return res.status(404).json({message: "Legend group name is a required field!"});
    }

    if(legendGroupVi || legendGroupEn){
      return res.status(404).json({message: "Legend group already exists!"});
    }

    const newLegendGroup = new LegendGroup({
      name: {
        vi:nameVi,
        en:nameEn
      }
    });

    await newLegendGroup.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getEditLegendGroup = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const legendGroupEdit = await LegendGroup.findById(req.params.id)
    res.render('legendGroup/editLegendGroup', {
      legendGroup:mongooseToObject(legendGroupEdit), 
      user: mongooseToObject(user),
      activeSideBar: 'legendGroup'
    })
  } catch (error) {
    next();
  }
}

export const handleUpdateLegendGroup = async (req, res, next) => {
  try {
    const { nameVi, nameEn } = req.body
    const currentLegendGroup = await LegendGroup.findById(req.params.id)
    const legendGroupVi = await LegendGroup.findOne({ 'name.vi': nameVi });
    const legendGroupEn = await LegendGroup.findOne({ 'name.vi': nameEn });
    if(!currentLegendGroup){
      return res.status(404).json({message: "Legend group does not exist!"});
    }
    if(!nameEn || !nameVi){
      return res.status(404).json({message: "Legend group name is a required field!"});
    }
    
    if((legendGroupVi && legendGroupVi.name.vi != currentLegendGroup.name.vi) || (legendGroupEn && legendGroupEn.name.en != currentLegendGroup.name.en)){
      return res.status(404).json({message: "Legend group name already exists!"});
    }

    await LegendGroup.findByIdAndUpdate(req.params.id,{ 
      $set:{
        name: {
          vi:nameVi,
          en:nameEn
        }
      }
    });
    res.status(200).json({message: "Update successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const handleDeleteLegendGroup = async (req, res, next) => {
  try {
    await LegendItem.deleteMany({legendGroup: req.params.id});
    await LegendGroup.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

