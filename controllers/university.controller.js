import University from "../models/University.js";
import {
  mongooseToObject
} from "../utils/mongooses.js";


function getFullUrlImg(req,image){
  const domain = req.get("host");
  let protocol  
  if (req.protocol === "https") {
    protocol = "https"
  } else {
    protocol = "http"
  }
  return protocol+"://"+domain+"/"+image
}

export const getAllUniversity = async (req, res, next) => {
  try {
    const { limit, q } = req.query
    let limitValue = parseInt(limit)
    let universityAll
    if (limitValue > 0){
      universityAll = await University.find().limit(limitValue);
    }else{
      if(q){
        universityAll = await University.find({ $or:[
          {'name.vi': { $regex: q, $options: 'i' }},
          {'code': { $regex: q, $options: 'i' }},
        ]});
      }else{
        universityAll = await University.find();
      }
    }

    const localizedUniversity = universityAll.map(item => {
      const { _id, createdAt, updatedAt, name, code, type, trainingSystem, address, phone, email, website, facebook, imgCover, imgGallery, __v } = item.toObject();

      const listImgGallery = imgGallery.map((img)=>{
        return  getFullUrlImg(req, img)
      })
      // console.log(listImgGallery)
      return {
        _id,
        name, 
        code, 
        type, 
        trainingSystem, 
        address, 
        phone, 
        email, 
        website, 
        facebook,
        imgCover: getFullUrlImg(req, imgCover),
        imgGallery:listImgGallery 
      };
    });
    res.status(200).json(localizedUniversity);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
export const getTopUniversity = async (req, res, next) => {
  try {
    let limitValue = parseInt(req.query.limit) || 10;
    console.log(limitValue)
    const universityAll = await University.find().limit(limitValue);
    res.status(200).json(universityAll);
  } catch (error) {
    res.status(500).json({message: err.message});
  }
}

export const getDetailUniversity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const currentUniversity = await University.findById(id)
    if (!id){
      return res.status(404).json({message: "ID does not exist!"});
    }
    if(!currentUniversity){
      return res.status(404).json({message: "University does not exist!"});
    }
    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      name,
      imgCover,
      code,
      type,
      trainingSystem,
      address,
      phone,
      email,
      website,
      facebook,
      imgGallery,
      infoAdmission,
      ...rest
    } = currentUniversity.toObject();

    const result = {
      nameVi: name.vi,
      nameEn: name.en,
      imgCover: getFullUrlImg(req, imgCover),
      code,
      type,
      trainingSystem,
      address,
      phone,
      email,
      website,
      facebook,
      imgGallery: imgGallery.map((img)=>{return getFullUrlImg(req, img)}),
      infoAdmission,
    }

    return res.status(200).json(result);
    
  } catch (error) {
    return  res.status(500).json({message: error.message})
  }
}
