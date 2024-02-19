import General from '../../models/General.js';
import User from '../../models/User.js';
import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'



// [GET] /setting/general
export const showSettingGeneral = async (req, res) =>{
  try {
    const general = await General.find();
    const user  = await User.findOne({_id: req.user.id})
    if (general.length === 0){
      const newSetting = new General({ hexCode: "#000000", expiresSessions: 720 })
      await newSetting.save()
      res.render('setting/general', { 
        user: mongooseToObject(user),
        general: mongooseToObject(newSetting),
        activeSideBar: 'general'
      })
    } else {
      res.render('setting/general', { 
        user: mongooseToObject(user),
        general: mongooseToObject(general[0]),
        activeSideBar: 'general'
      })
    }
  } catch (error) {
    next(error)
  }
}

// [POST] /setting/general 
export const handleCreateGeneral = async (req, res) => {
  try {
    const { hexCode, expiresSessions } = req.body
    // console.log(req.body)
    const newSetting = await General({ hexCode, expiresSessions })
    await newSetting.save()
    res.status(200).json({message: "Updated successfully!", data: newSetting});
  } catch (error) {
    res.status(500).json({message: "An error occurred during update!"});
  }
}

// [GET] /setting/general/:id/edit
export const showEditGeneral = async (req, res) => {
  try {
    const general = await General.findById(req.params.id)
    if(!general){
      return res.status(404).json({message: "General does not exist."});
    }
    const user  = await User.findOne({_id: req.user.id})
    res.render('setting/editGeneral', { 
      general: mongooseToObject(general),
      user: mongooseToObject(user),
      activeSideBar: 'general'
    })
  } catch (error) {
    next(error)
  }
}

// [PUT] /setting/general/:id/edit
export const handleEditGeneral = async (req, res) => {
  try {
    console.log(req.files)
    const { hexCode, expiresSessions } = req.body
    const general = await General.findById(req.params.id)
    if(!general){
      return res.status(404).json({message: "General does not exist."});
    }
    if (!hexCode){
      hexCode = "#000000"
    }
    if (!expiresSessions){
      expiresSessions = 720
    }
    await General.updateOne({_id: req.params.id}, {hexCode, expiresSessions})
    res.status(200).json({message: "Updated successfully!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred during update!"});
  }
}
