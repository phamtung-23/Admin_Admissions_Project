import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import { createError } from '../../utils/error.js';
import University from '../../models/University.js';

// [GET] /
export const getListUniversity = async (req, res, next) => {
  try {
    const universityList = await University.find()
    const user  = await User.findOne({_id: req.user.id})
    res.render('university/listUniversity', {
      user: mongooseToObject(user),
      universityList: mutipleMongooseTonObject(universityList),
      activeSideBar: 'university'
    })
  } catch (error) {
    next(createError(500, error))
  }
}

export const getCreateUniversity = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})

    res.render('university/createUniversity',{
      user: mongooseToObject(user),
      activeSideBar: 'university'
    });
  } catch (err) {
    next(createError(500, err))
  }
}

export const handleCreateUniversity = async (req, res, next) => {
  try {
    const { nameVi, nameEn, code, trainingSystem, address, phone, email, website, facebook } = req.body;
    console.log(req.body);
    console.log(req.files);

    if (!nameVi || !nameEn || !code || !trainingSystem || !address || !phone || !email || !website || !facebook) {
      return res.status(400).json({success: false, message: 'Please fill all the fields!'})
    }

    const nameViUniversity = await University.findOne({ 'name.vi': nameVi })
    const nameEnUniversity = await University.findOne({ 'name.en': nameEn })
    if (nameViUniversity || nameEnUniversity){
      return res.status(400).json({message: "University name already exists!"});
    }

    // check code exists
    const codeUniversity = await University.findOne({code})
    if (codeUniversity){
      return res.status(400).json({message: "University code already exists!"});
    }

    const imageListForm = req.files

    // check image of project
    let imgCover
    if (hasObjectWithFieldname(imageListForm, 'imgCover')) {
      imageListForm.map((item)=>{
        if (item.fieldname === 'imgCover') {
          const domain = req.get("host");
          let protocol
          if (req.protocol === "https") {
            protocol = "https"
          }
          else {
            protocol = "http"
          }
          imgCover = protocol+"://"+domain+"/"+item.originalname
        }
      })
    } else {
      return res.status(404).json({message: "Please choose an image for the University!"});
    }
    
    let imgGallery = []
    if (hasObjectWithFieldname(imageListForm, 'imgGallery')) {
      imageListForm.map((img)=>{
        if (img.fieldname === 'imgGallery') {
          const domain = req.get("host");
          let protocol
          if (req.protocol === "https") {
            protocol = "https"
          }
          else {
            protocol = "http"
          }
          imgGallery.push(protocol+"://"+domain+"/"+img.originalname)
        }
      })
    }else{
      return res.status(404).json({message: "Please choose images for the university!"});
    }
    
    let pdfList = []
    if (hasObjectWithFieldname(imageListForm, 'infoAdmission')) {
      imageListForm.map((pdf)=>{
        if (pdf.fieldname === 'infoAdmission') {
          const domain = req.get("host");
          let protocol
          if (req.protocol === "https") {
            protocol = "https"
          }
          else {
            protocol = "http"
          }
          pdfList.push(protocol+"://"+domain+"/"+pdf.originalname)
        }
      })
    }else{
      return res.status(404).json({message: " Please choose pdf for the university!"});
    }
    
    const newUniversity = new University({
      ...req.body,
      name:{
        vi: nameVi,
        en: nameEn
      },
      imgCover,
      imgGallery,
      infoAdmission: pdfList
    });

    await newUniversity.save()
    res.status(200).json({message: 'Create university successfully!'})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

function hasObjectWithFieldname(array, fieldNameToCheck) {
  if (array.some(item => item.fieldname === fieldNameToCheck)){
    return true 
  }else{
    return false
  }
}