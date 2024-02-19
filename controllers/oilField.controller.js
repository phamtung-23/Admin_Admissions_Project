import {
  mongooseToObject
} from "../utils/mongooses.js";
import Field from "../models/Field.js";
import General from "../models/General.js";
import Project from "../models/Project.js";

export const getFields = async (req, res) => {
  try {
    const fields = await Field.find({},{ createdAt: 0, updatedAt: 0, __v : 0 });
    const generalSetting = await General.find();
    const hexCode = generalSetting[0].hexCode
     // Convert _id to id
     const modifiedData = fields.map(field => {
      const { _id, ...rest } = field.toObject();
      return { id: _id, colorLine: hexCode, ...rest };
    });
    res.status(200).json(modifiedData);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getField = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({
        message: "Oil field not found!"
      });
    }
    const { _id, createdAt, updatedAt, __v, ...rest } = field.toObject();
    const generalSetting = await General.find();
    const hexCode = generalSetting[0].hexCode
    // Convert _id to id
    const modifiedField = {
      id: _id,
      colorLine: hexCode,
      ...rest
    };

    res.status(200).json(modifiedField);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
function stringToArray(str) {

  // Kiểm tra có ký tự [[ và ]] đúng vị trí
  if (!str.startsWith('[[') || !str.endsWith(']]')) {
    return {
      error: 'Coordinates are not in the correct format' 
    };
  }

  // Thử chuyển đổi sang array
  try {
    const arr = JSON.parse(str);
    
    // Kiểm tra các phần tử con
    const isValid = arr.every(subarr => {
      return Array.isArray(subarr) && subarr.length === 2; 
    });
    
    if (!isValid) {
      return {
        error: 'Coordinates are not in the correct format' 
      };
    }
    
    // Trả về kết quả nếu hợp lệ
    return arr;
    
  } catch (err) {
    return {
      error: 'Coordinates are not in the correct format' 
    };
  }

}
export const createField = async (req, res) => {
  const { fieldId, coordinates, colorCodeBg } = req.body;

  if (!fieldId || !coordinates) {
    return res.status(404).json({message: "Field ID, coordinates, line color are required fields!"});
  }
  const existField = await Field.findOne({fieldId})
  if (existField){
    return res.status(404).json({message: "Oil field name already exists!"}); 
  }
  //check format hex code color bg
  if (colorCodeBg && !/^#[0-9A-F]{6}$/i.test(colorCodeBg)) {
    return res.status(404).json({message: "Invalid background color!"});
  } 
  
  // check format coordinates
  let nestedArr
    if (stringToArray(coordinates).error){
      return res.status(404).json({message: "Coordinates are not in the correct format!"});
    }else{
      nestedArr = stringToArray(coordinates)
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
    req.body.colorCodeBg = ''

  }else{
    req.body.colorImage = ''
  }
  const field = new Field({
    ...req.body,
    location: {
      coordinates: nestedArr
    }
  });
  // console.log(field)

  try {
    const newField = await field.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateField = async (req, res) => {
  try {
    const existField = await Field.findById(req.params.id);
    const {fieldId, coordinates, colorCodeBg} = req.body

    if (!fieldId || !coordinates) {
      return res.status(404).json({message: "Field ID, coordinates, line color are required fields!"});
    }
    if (!existField) {
      return res.status(404).json({
        message: "Oil field not found!"
      });
    }
    const existingField = await Field.findOne({fieldId:req.body.fieldId})
    if (existField.fieldId != req.body.fieldId && existingField) {
      return res.status(400).json({ message: 'Field ID already exists, please try a different Field ID!' });
    }
    
    // check format coordinates
    let nestedArr
    if (stringToArray(coordinates).error){
      return res.status(404).json({message: "Coordinates are not in the correct format!"});
    }else{
      nestedArr = stringToArray(coordinates)
    }

    if(colorCodeBg){
      //check format hex code color bg
      if (colorCodeBg && !/^#[0-9A-F]{6}$/i.test(colorCodeBg)) {
        return res.status(404).json({message: "Invalid background color!"});
      } 
    }
    // check file null
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
      req.body.colorCodeBg = ""
    }else{
      if (existField.colorImage){
        req.body.colorImage = existField.colorImage
        req.body.colorCodeBg = ""
      }else{
        req.body.colorImage = ""
      }
    }

    const updateOilField = await Field.findByIdAndUpdate(
      req.params.id, {
        $set: {
          ...req.body,
          location: {
            coordinates: nestedArr
          }}
      }, {
        new: true
      }
    );
    res.status(200).json({message: "Update successful!"});
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

export const deleteField = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    // Check if the field ID exists in any project
    const projectsWithField = await Project.find({ oilField: req.params.id });
    if (projectsWithField.length > 0) {
      return res.status(400).json({
        message: "Cannot delete oil field. It is used in one or more projects."
      });
    }

    if (!field) {
      return res.status(404).json({
        message: "Oil field not found!"
      });
    }

    await Field.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Delete oil field successful!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};