import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import { createError } from '../../utils/error.js';
import University from '../../models/University.js';
import { convertTextSearch } from '../../utils/convertFileName.js';




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
    const { nameVi, nameEn, code, type, trainingSystem, address, phone, email, website, facebook } = req.body;
    console.log(req.body);
    console.log(req.files);

    if (!nameVi || !nameEn || !code || !type || !trainingSystem || !address || !phone || !email || !website || !facebook) {
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
          imgCover = item.originalname
        }
      })
    } else {
      return res.status(404).json({message: "Please choose an image for the University!"});
    }

    // check ison of project
    let icon
    if (hasObjectWithFieldname(imageListForm, 'icon')) {
      imageListForm.map((item)=>{
        if (item.fieldname === 'icon') {
          icon = item.originalname
        }
      })
    } else {
      return res.status(404).json({message: "Please choose an icon for the University!"});
    }
    
    let imgGallery = []
    if (hasObjectWithFieldname(imageListForm, 'imgGallery')) {
      imageListForm.map((img)=>{
        if (img.fieldname === 'imgGallery') {
          imgGallery.push(img.originalname)
        }
      })
    }else{
      return res.status(404).json({message: "Please choose images for the university!"});
    }
    
    // let pdfList = []
    // if (hasObjectWithFieldname(imageListForm, 'infoAdmission')) {
    //   imageListForm.map((pdf)=>{
    //     if (pdf.fieldname === 'infoAdmission') {
    //       pdfList.push(pdf.originalname)
    //     }
    //   })
    // }else{
    //   return res.status(404).json({message: " Please choose pdf for the university!"});
    // }
    
    const newUniversity = new University({
      ...req.body,
      searchName: convertTextSearch(nameVi),
      name:{
        vi: nameVi,
        en: nameEn
      },
      icon,
      imgCover,
      imgGallery
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

export const getEditUniversity = async (req, res, next) => { 
  try {
    const idUniversity = req.params.id;
    const user = await User.findOne({_id: req.user.id})

    const university = await University.findOne({_id: idUniversity})
    if (!university){
      return res.status(404).json({message: "University not found!"});
    }

    res.render('university/editUniversity',{
      user: mongooseToObject(user),
      university: mongooseToObject(university),
      activeSideBar: 'university'
    });

  } catch (error) {
    
  }
}

export const handleUpdateUniversity = async (req, res, next) => {
  try {
    const { nameVi, nameEn, code, type, trainingSystem, address, phone, email, website, facebook } = req.body;
    const idUniversity = req.params.id;
    const currentUniversity = await University.findOne({_id: idUniversity})

    if (!nameVi || !nameEn || !code || !type || !trainingSystem || !address || !phone || !email || !website || !facebook) {
      return res.status(400).json({success: false, message: 'Please fill all the fields!'})
    }

    if(!currentUniversity){
      return res.status(404).json({message: "University not found!"});
    }

    if(currentUniversity.name.vi !== nameVi){
      const nameViUniversity = await University.findOne({ 'name.vi': nameVi })
      if (nameViUniversity){
        return res.status(400).json({message: "University name already exists!"});
      }
    }

    if(currentUniversity.name.en !== nameEn){
      const nameEnUniversity = await University.findOne({ 'name.en': nameEn })
      if (nameEnUniversity){
        return res.status(400).json({message: "University name already exists!"});
      }
    }

    if(currentUniversity.code !== code){
      const codeUniversity = await University.findOne({code})
      if (codeUniversity){
        return res.status(400).json({message: "University code already exists!"});
      }
    }

    const imageListForm = req.files

    // check image of project
    let imgCover
    if (hasObjectWithFieldname(imageListForm, 'imgCover')) {
      imageListForm.map((item)=>{
        if (item.fieldname === 'imgCover') {
          imgCover = item.originalname
        }
      })
    }
    // check icon of project
    let icon
    if (hasObjectWithFieldname(imageListForm, 'icon')) {
      imageListForm.map((item)=>{
        if (item.fieldname === 'icon') {
          icon = item.originalname
        }
      })
    }
    
    let imgGallery = []
    if (hasObjectWithFieldname(imageListForm, 'imgGallery')) {
      imageListForm.map((img)=>{
        if (img.fieldname === 'imgGallery') {
          imgGallery.push(img.originalname)
        }
      })
    }
    
    // let pdfList = []
    // if (hasObjectWithFieldname(imageListForm, 'infoAdmission')) {
    //   imageListForm.map((pdf)=>{
    //     if (pdf.fieldname === 'infoAdmission') {
    //       pdfList.push(pdf.originalname)
    //     }
    //   })
    // }

    const updateUniversity = {
      ...req.body,
      searchName: convertTextSearch(nameVi),
      name:{
        vi: nameVi,
        en: nameEn
      },
      icon: icon ? icon : currentUniversity.icon,
      imgCover: imgCover ? imgCover : currentUniversity.imgCover,
      imgGallery: imgGallery.length > 0 ? imgGallery : currentUniversity.imgGallery,
      // infoAdmission: pdfList.length > 0 ? pdfList : currentUniversity.infoAdmission
    }

    await University.updateOne({_id: idUniversity}, updateUniversity)
    res.status(200).json({message: 'Update university successfully!'})
  } catch (error) {
    
  }
}

export const handleDeleteUniversity = async (req, res, next) => {
  try {
    const idUniversity = req.params.id;
    const university = await University.findOne({_id: idUniversity})
    if (!university){
      return res.status(404).json({message: "University not found!"});
    }

    await University.deleteOne({_id: idUniversity})
    res.status(200).json({message: 'Delete university successfully!'})
  } catch (error) {
    
  }
}

