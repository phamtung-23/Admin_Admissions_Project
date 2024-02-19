import General from '../../models/General.js';
import User from '../../models/User.js';
import Version from '../../models/Version.js'
import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'


// [GET] /version
export const showVersion = async (req, res, next) => {
  try {
    const versions = await Version.find();
    const user  = await User.findOne({_id: req.user.id})
    // get updatedAt in versions
    const listVersion = []
    versions.forEach(version => {
      listVersion.push({
        id: version._id,
        version: version.version,
        updatedAt: version.updatedAt.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' })
      })
    });
    res.render('setting/version', 
    {
      user: mongooseToObject(user),
      versions: listVersion,
      activeSideBar: 'version'
    });
  } catch (err) {
    next(err);
  }
  
}
// [GET] /version/create
export const showCreateVersion = (req, res, next) => {
  res.render('setting/createVersion',{
    activeSideBar: 'version'
  })
}
// [POST] /version/create
export const handleCreateVersion = async (req, res, next) => {
  const { version } = req.body
  try {
    const existVersion = await Version.findOne({version})
    if (!version){
      return res.status(404).json({message: "Version is required!"});
    }
    if (existVersion){
      return res.status(404).json({message: "Version is exist!"});
    }
    const newVersion = new Version({ version })
    await newVersion.save()
    res.status(200).json({message: "Created successfully!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred during creation!"});
  }
}
// [GET] /version/:id/edit
export const showEditVersion = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.id)
    const user  = await User.findOne({_id: req.user.id})
    res.render('setting/editVersion', { 
      version: mongooseToObject(version),
      user: mongooseToObject(user),
      activeSideBar: 'version'
    })
  } catch (error) {
    next(error)
  }
}

// [PUT] /version/:id
export const handleEditVersion = async (req, res, next) => {
  try {
    const { version } = req.body
    const currentVersion = await Version.findById(req.params.id)
    if(!currentVersion){
      return res.status(404).json({message: "Current version does not exist."});
    }
    if (!version){
      return res.status(404).json({message: "Version is required!"});
    }
    const existVersion = await Version.findOne({version})
    if (existVersion && existVersion._id.toString() !== currentVersion._id.toString() ){
      return res.status(404).json({message: "Version is exist!"});
    }
    await Version.updateOne({_id: req.params.id}, {version})
    res.status(200).json({message: "Updated successfully!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred during update!"});
  }
}
// [DELETE] /version/:id
export const handleDeleteVersion = async (req, res, next) => {
  try {
    const version = await Version.findById(req.params.id)
    if(!version){
      return res.status(404).json({message: "Version does not exist."});
    }
    await Version.deleteOne({_id: req.params.id})
    res.status(200).json({message: "Deleted successfully!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred during delete!"});
  }
}

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
