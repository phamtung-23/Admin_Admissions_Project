import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import LegendItem from '../../models/LegendItem.js';
import LegendGroup from '../../models/LegendGroup.js';
import { createError } from '../../utils/error.js';


export const getListLegendItem = async (req, res, next) => {
  try {
    const legendItem = await LegendItem.find().populate('legendGroup');
    const user  = await User.findOne({_id: req.user.id})
    res.render('legendItem/listLegendItem', 
    {
      user: mongooseToObject(user),
      legendItem: mutipleMongooseTonObject(legendItem),
      activeSideBar: 'legendItem'
    });
  } catch (err) {
    next(err);
  }
}

export const getCreateLegendItem = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const groupLegend  = await LegendGroup.find()

    res.render('legendItem/createLegendItem',{
      user: mongooseToObject(user),
      groupLegend: mutipleMongooseTonObject(groupLegend),
      activeSideBar: 'legendItem'
    });
  } catch (err) {
    next(err);
  }
}

export const handleCreateLegendItem = async (req, res, next) => {
  try {
    const { nameVi, nameEn, legendGroup, colorCode } = req.body
    const legendItemVi = await LegendItem.findOne({ 'name.vi': nameVi });
    const legendItemEn = await LegendItem.findOne({ 'name.en': nameEn });

    if(!nameEn || !nameVi || !legendGroup){
      return res.status(404).json({message: "Legend item name and legend group are required fields!"});
    }

    if(legendItemVi || legendItemEn){
      return res.status(404).json({message: "Legend item name already exists!"});
    }

    if (colorCode && !/^#[0-9A-F]{6}$/i.test(colorCode)) {
      return res.status(404).json({message: "Invalid color code!"});
    }

    if (req.files.length > 0) {
      const domain = req.get("host");
      let protocol  
      if (req.protocol === "https") {
        protocol = "https"
      } else {
        protocol = "http"
      }
      const imageUrl =protocol+"://"+domain+"/"+req.files[0].originalname
      req.body.colorImage = imageUrl
      req.body.colorCode = ''
    }else{
      req.body.colorImage = ''
    }
    const currentLegendGroup = await LegendGroup.findById(legendGroup)
    const newLegendItem = new LegendItem({
      ...req.body,
      name: {
        vi:nameVi,
        en:nameEn
      },
      legendGroup: currentLegendGroup
    });

    await newLegendItem.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getEditLegendItem = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const legendGroup = await LegendGroup.find()
    const legendItemEdit = await LegendItem.findById(req.params.id)

    legendItemEdit.populate("legendGroup")
      .then((val)=>{
        const idLegendGroup = val.legendGroup._id.toString()
        res.render('legendItem/editLegendItem', {
          legendItem:mongooseToObject(val), 
          user: mongooseToObject(user),  
          legendGroup: {
            data: mutipleMongooseTonObject(legendGroup),
            idLegendGroup: idLegendGroup
          },
          activeSideBar: 'legendItem'
        })
      })
      .catch((err) => {
        next(err)
      })

  } catch (error) {
    next(error);
  }
}

export const handleUpdateLegendItem = async (req, res, next) => {
  try {
    const { nameVi, nameEn, legendGroup, colorCode } = req.body
    const legendItemVi = await LegendItem.findOne({ 'name.vi': nameVi });
    const legendItemEn = await LegendItem.findOne({ 'name.en': nameEn });
    const currentLegendItem = await LegendItem.findById(req.params.id)

    if(!currentLegendItem){
      return res.status(404).json({message: "Legend item not found!"});
    }

    if(!nameEn || !nameVi || !legendGroup){
      return res.status(404).json({message: "Legend item name and legend group are required fields!"});
    }

    if((legendItemVi && legendItemVi.name.vi != currentLegendItem.name.vi) || (legendItemEn && legendItemEn.name.en != currentLegendItem.name.en)){
      return res.status(404).json({message: "Legend item name already exists!"});
    }

    if (colorCode && !/^#[0-9A-F]{6}$/i.test(colorCode)) {
      return res.status(404).json({message: "Invalid color code!"});
    }

    if (req.files.length > 0) {
      const domain = req.get("host");
      let protocol  
      if (req.protocol === "https") {
        protocol = "https"
      } else {
        protocol = "http"
      }
      const imageUrl =protocol+"://"+domain+"/"+req.files[0].originalname
      req.body.colorImage = imageUrl
      req.body.colorCode = ''
    }else{
      if(colorCode){
        req.body.colorImage = ''
      }else{
        req.body.colorImage = currentLegendItem.colorImage
      }
    }
    const currentLegendGroup = await LegendGroup.findById(legendGroup)
    const updateLegendItem = await LegendItem.findByIdAndUpdate(
      req.params.id,
      {
        $set:{
          ...req.body,
          name: {
            vi:nameVi,
            en:nameEn
          },
          legendGroup: currentLegendGroup
        }
    });
    res.status(200).json({message: "Update successful!"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const handleDeleteLegendItem = async (req, res, next) => {
  try {
    const legendItem = await LegendItem.findById(req.params.id);
    if(!legendItem){
      return res.status(404).json({message: "Legend item not found!"});
    }
    await LegendItem.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

