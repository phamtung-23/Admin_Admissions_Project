import {
  mongooseToObject
} from "../utils/mongooses.js";

import PipeLine from "../models/PipeLine.js";

export const getPipeLines = async (req, res) => {
  try {
    const pipeLines = await PipeLine.find();
    const modifiedPipeLines = pipeLines.map(pipeLine => {
      const { _id, createdAt, updatedAt, __v, ...rest } = pipeLine.toObject();
      return { id: _id, ...rest };
    });

    res.status(200).json(modifiedPipeLines);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getPipeLine = async (req, res) => {
  try {
    const pipeLine = await PipeLine.findById(req.params.id);
    // console.log(pipeLine)
    if (!pipeLine) {
      return res.status(404).json({
        message: "ID not found!"
      });
    }
    // Exclude createdAt and updatedAt fields
    const { _id, createdAt, updatedAt, __v, ...rest } = pipeLine.toObject();

    // Convert _id to id
    const modifiedPipeLine = {
      id: _id,
      ...rest
    };

    res.status(200).json(modifiedPipeLine);
  } catch (err) {
    res.status(500).json({
      message: "An error occurred!"
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

export const createPipeLine = async (req, res) => {
  const { name, coordinates, colorCodeLine } = req.body;
  // console.log(req.body)
  if (!coordinates || !colorCodeLine || !name) {
    return res.status(404).json({message: "These are the required fields!"});
  }
  // check name exists
  const existPipeLine = await PipeLine.findOne({name});
  if (existPipeLine) {
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

  const pipeLine = new PipeLine({
    ...req.body,
    location: {
      coordinates: nestedArr
    }
  });
  // console.log(pipeLine)

  try {
    await pipeLine.save();
    res.status(200).json({message: "Creation successful!"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePipeLine = async (req, res) => {
  try {
    const existPipeLine = await PipeLine.findById(req.params.id);
    const { name, coordinates, colorCodeLine } = req.body

    if (!coordinates || !colorCodeLine || !name) {
      return res.status(404).json({message: "These are the required fields!"});
    }
    // check name exists
    const existPipeLineName = await PipeLine.findOne({name})
    if (existPipeLineName && existPipeLineName._id != req.params.id) {
      return res.status(404).json({message: "Name already exists!"});
    }

    if (!existPipeLine) {
      return res.status(404).json({
        message: "ID not found!"
      });
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
    await PipeLine.findByIdAndUpdate(
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

export const deletePipeLine = async (req, res) => {
  try {
    const pipeLine = await PipeLine.findById(req.params.id);
    if (!pipeLine) {
      return res.status(404).json({
        message: "ID not found!"
      });
    }
    await PipeLine.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Deleted successfully!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};