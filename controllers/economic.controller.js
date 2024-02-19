import {
  mongooseToObject
} from "../utils/mongooses.js";
// import Field from "../models/Field.js";
import Economic from "../models/Economic.js";

export const getEconomics = async (req, res) => {
  try {
    const economics = await Economic.find();
    // Modify each document to return id instead of _id and exclude createdAt, updatedAt
    const modifiedEconomics = economics.map(economic => {
      const { _id, createdAt, updatedAt, __v, ...rest } = economic.toObject();
      return { id: _id, ...rest };
    });

    res.status(200).json(modifiedEconomics);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getEconomic = async (req, res) => {
  try {
    const economic = await Economic.findById(req.params.id);
    // console.log(economic)
    if (!economic) {
      return res.status(404).json({
        message: "ID not found!"
      });
    }
    // Exclude createdAt and updatedAt fields
    const { _id, createdAt, updatedAt, __v, ...rest } = economic.toObject();

    // Convert _id to id
    const modifiedEconomic = {
      id: _id,
      ...rest
    };

    res.status(200).json(modifiedEconomic);
  } catch (err) {
    res.status(500).json({
      message: "An error occurred!"
    });
  }
};

export const createEconomic = async (req, res) => {
  const { name, coordinates, colorCodeLine } = req.body;
  if (!coordinates || !colorCodeLine || !name) {
    return res.status(404).json({message: "These are the required fields!"});
  }
  // check name exist
  const existName = await Economic.findOne({name: name})
  if (existName){
    return res.status(404).json({message: "Name already exists!"});
  }
  //check format hex code color line
  if (colorCodeLine && !/^#[0-9A-F]{6}$/i.test(colorCodeLine)) {
    return res.status(404).json({message: "Invalid line color!"});
  }
  
  // check format of coordinates [[1,1],[2,2]]
  let nestedArr
  if (stringToArray(coordinates).error){
    return res.status(404).json({message: "Coordinates are not in the correct format!"});
  }else{
    nestedArr = stringToArray(coordinates)
  }
  

  const economic = new Economic({
    ...req.body,
    location: {
      coordinates: nestedArr
    }
  });
  // console.log(economic)

  try {
    await economic.save();
    res.status(200).json({message: "Creation successful!"});
  } catch (err) {
    res.status(400).json({ message: err.message });
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
export const updateEconomic = async (req, res) => {
  try {
    const existField = await Economic.findById(req.params.id);
    const { name, coordinates, colorCodeLine } = req.body

    if (!coordinates || !colorCodeLine || !name) {
      return res.status(404).json({message: "These are the required fields!"});
    }
    if (!existField) {
      return res.status(404).json({
        message: "ID not found!"
      });
    }
    // checl name exist
    const existName = await Economic.findOne({ name })
    if (existName && existName._id != req.params.id) {
      return res.status(404).json({message: "Name already exists!"});
    }
    
    if(colorCodeLine){
      //check format hex code color line
      if (colorCodeLine && !/^#[0-9A-F]{6}$/i.test(colorCodeLine)) {
        return res.status(404).json({message: "Invalid line color!"});
      }
    }

    let nestedArr
    if (stringToArray(coordinates).error){
      return res.status(404).json({message: "Coordinates are not in the correct format!"});
    }else{
      nestedArr = stringToArray(coordinates)
    }

    // console.log(nestedArr)              
    await Economic.findByIdAndUpdate(
      req.params.id, {
        $set: {
          ...req.body,
          location: {
            coordinates: nestedArr
          }}
      }, {new: true}
    );
    res.status(200).json({message: "Update successful!"});
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

export const deleteEconomic = async (req, res) => {
  try {
    const economic = await Economic.findById(req.params.id);
    if (!economic) {
      return res.status(404).json({
        message: "ID not found!"
      });
    }
    await Economic.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Deleted successfully!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};