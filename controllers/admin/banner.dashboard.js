import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import { createError } from '../../utils/error.js';
import University from '../../models/University.js';
import Banner from '../../models/Banner.js';
import { convertFilename } from '../../utils/convertFileName.js';
import fs from "fs";

// [GET] /
export const getListBanner = async (req, res, next) => {
  try {
    const banners = await Banner.find()
    const user  = await User.findOne({_id: req.user.id})
    res.render('banner/listBanner', {
      user: mongooseToObject(user),
      banners: mutipleMongooseTonObject(banners),
      activeSideBar: 'banner'
    })
  } catch (error) {
    next(createError(500, error))
  }
}

export const getCreateBanner = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})

    res.render('banner/createBanner',{
      user: mongooseToObject(user),
      activeSideBar: 'banner'
    });
  } catch (err) {
    next(createError(500, err))
  }
}

export const handleCreateBanner = async (req, res, next) => {
  
  try {
    const { iconNameCreate, isActiveCreate } = req.body
    const existBanner = await Banner.findOne({name:iconNameCreate})

    if (!iconNameCreate){
      return res.status(404).json({message: "Name is a required field!"});
    }
    if (existBanner){
      return res.status(404).json({message: "Name already exists!"});
    }
    if (req.files.length <= 0){
      return res.status(404).json({message: "Please choose an image!"});
    }
    else{
      const imageUrl = convertFilename(req.files[0].originalname)
      const newBanner = new Banner({
        name: iconNameCreate,
        imageUrl: imageUrl,
        status: isActiveCreate
      });
      await newBanner.save();
      res.status(200).json({message: "Upload successful!"});
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

function hasObjectWithFieldname(array, fieldNameToCheck) {
  if (array.some(item => item.fieldname === fieldNameToCheck)){
    return true 
  }else{
    return false
  }
}

export const getEditBanner = async (req, res, next) => { 
  try {
    const idBanner = req.params.id;
    const user = await User.findOne({_id: req.user.id})

    const banner = await Banner.findOne({_id: idBanner})
    if (!banner){
      return res.status(404).json({message: "Image not found!"});
    }

    res.render('banner/editBanner',{
      user: mongooseToObject(user),
      banner: mongooseToObject(banner),
      activeSideBar: 'banner'
    });

  } catch (error) {
    
  }
}
function processFile(content) {
  console.log(content);
}
export const handleUpdateBanner = async (req, res, next) => {
  try {
    // First I want to read the file 
    // fs.readFile('./2023_GPT4All_Technical_Report.pdf', function read(err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     const content = data;

    //     // Invoke the next step here however you like
    //     console.log(content);   // Put all of the code here (not the best solution)
    //     processFile(content);   // Or put the next step in a function and invoke it
    // });

   
    const { iconName, isActiveCreate } = req.body
    const currentBannerEdit = await Banner.findById(req.params.id)
    const existBanner = await Banner.findOne({name:iconName})

    if (!iconName){
      return res.status(404).json({message: "Name is a required field!"});
    }
    if (existBanner && existBanner.name != currentBannerEdit.name){
      return res.status(404).json({message: "Name already exists!"});
    }
    if (req.files.length <= 0){
      await Banner.findByIdAndUpdate(req.params.id,{
        $set:{
          name: iconName,
          status: isActiveCreate
        }
      })
      res.status(200).json({message: "Update successful!"});
    }
    else{
      const imageUrl = convertFilename(req.files[0].originalname)
      await Banner.findByIdAndUpdate(req.params.id,{
        $set:{
          name: iconName,
          imageUrl: imageUrl,
          status: isActiveCreate
        }
      })
      res.status(200).json({message: "Update successful!"});
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const handleDeleteBanner = async (req, res, next) => {
  try {
    const idBanner = req.params.id;
    const banner = await Banner.findOne({_id: idBanner})
    if (!banner){
      return res.status(404).json({message: "Banner not found!"});
    }

    await Banner.deleteOne({_id: idBanner})
    res.status(200).json({message: 'Delete Banner successfully!'})
  } catch (error) {
    
  }
}