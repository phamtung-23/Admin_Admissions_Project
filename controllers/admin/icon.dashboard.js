import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import Service from '../../models/Service.js'
import Icon from '../../models/Icon.js';
import { createError } from '../../utils/error.js';
import Project from '../../models/Project.js';


export const getListIcon = async (req, res, next) => {
  try {
    const icons = await Icon.find();
    const user  = await User.findOne({_id: req.user.id})
    const projects = await Project.find()

  
    // Iterate through each icon
    await Promise.all(
      icons.map(async (icon) => {
          let iconIsUsed = false;
          const projectsUsingIcon = [];

          // Check if the icon is used as project icon in any project
          for (const project of projects) {
              if (project.icon.toString() === icon._id.toString()) {
                  iconIsUsed = true;
                  projectsUsingIcon.push(project.name.vi);
                  break; // No need to continue checking other projects
              }

              // Check if the icon is used in any service of the project
              for (const service of project.services) {
                  if (service.icon.toString() === icon._id.toString()) {
                      iconIsUsed = true;
                      projectsUsingIcon.push(project.name.vi);
                      break; // No need to continue checking other services of the same project
                  }
              }
          }

          if (iconIsUsed) {
              // Icon is used in at least one project or as project icon
              await Icon.findByIdAndUpdate(icon._id, {
                  $set: {
                      status: 'In use',
                      projects: projectsUsingIcon
                  }
              });
          } else {
              // Icon is not used in any project or as project icon
              await Icon.findByIdAndUpdate(icon._id, {
                  $set: {
                      status: 'Not in use',
                      projects: []
                  }
              });
          }
      })
    );
    
    
    const newListIcons = await Icon.find();
  
    res.render('icon/listIcon', 
    {
      user: mongooseToObject(user),
      icons: mutipleMongooseTonObject(newListIcons),
      activeSideBar: 'icon'
    });
  } catch (err) {
    next(err);
  }
}
 
export const getCreateIcon = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('icon/createIcon',{
      user: mongooseToObject(user),
      activeSideBar: 'icon'
    });
  } catch (err) {
    next(err);
  }
}

export const handleCreateIcon = async (req, res, next) => {
  
  try {
    const { iconNameCreate } = req.body
    const existIcon = await Icon.findOne({name:iconNameCreate})

    if (!iconNameCreate){
      return res.status(404).json({message: "Icon name is a required field!"});
    }
    if (existIcon){
      return res.status(404).json({message: "Icon name already exists!"});
    }
    if (req.files.length <= 0){
      return res.status(404).json({message: "Please choose an image!"});
    }
    else{
      const domain = req.get("host");
      let protocol  
      if (req.protocol === "https") {
        protocol = "https"
      } else {
        protocol = "http"
      }
      const imageUrl =protocol+"://"+domain+"/"+req.files[0].originalname
      const newIcon = new Icon({
        name: iconNameCreate,
        imageUrl: imageUrl
      });
      await newIcon.save();
      res.status(200).json({message: "Upload successful!"});
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getEditIcon = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const iconEdit = await Icon.findById(req.params.id)
    res.render('icon/editIcon', {
      iconEdit:mongooseToObject(iconEdit), 
      user: mongooseToObject(user),
      activeSideBar: 'icon'
    })
  } catch (error) {
    next();
  }
}
export const getDetailIcon = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const detailIcon = await Icon.findById(req.params.id)
    res.render('icon/detailIcon', {
      detailIcon:mongooseToObject(detailIcon), 
      user: mongooseToObject(user),
      activeSideBar: 'icon'
    })
  } catch (error) {
    next();
  }
}

export const handleUpdateIcon = async (req, res, next) => {
  try {
    const { iconName } = req.body
    const currentIconEdit = await Icon.findById(req.params.id)
    const existIcon = await Icon.findOne({name:iconName})

    if (!iconName){
      return res.status(404).json({message: "Icon name is a required field!"});
    }
    if (existIcon && existIcon.name != currentIconEdit.name){
      return res.status(404).json({message: "Icon name already exists!"});
    }
    if (req.files.length <= 0){
      await Icon.findByIdAndUpdate(req.params.id,{
        $set:{
          name: iconName
        }
      })
      res.status(200).json({message: "Update successful!"});
    }
    else{
      const domain = req.get("host");
      let protocol  
      if (req.protocol === "https") {
        protocol = "https"
      } else {
        protocol = "http"
      }
      const imageUrl =protocol+"://"+domain+"/"+req.files[0].originalname
      await Icon.findByIdAndUpdate(req.params.id,{
        $set:{
          name: iconName,
          imageUrl: imageUrl
        }
      })
      res.status(200).json({message: "Update successful!"});
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const handleDeleteIcon = async (req, res, next) => {
  try {
    const deleteIcon = await Icon.findById(req.params.id)
    if(!deleteIcon){
      return res.status(404).json({message: "Icon not found!"});
    }
    await Icon.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

