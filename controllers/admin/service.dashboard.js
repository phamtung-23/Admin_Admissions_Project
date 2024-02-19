import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import Service from '../../models/Service.js'
import Project from '../../models/Project.js';
import { createError } from '../../utils/error.js';


export const getListService = async (req, res, next) => {
  try {
    const services = await Service.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('service/listService', 
    {
      user: mongooseToObject(user),
      services: mutipleMongooseTonObject(services),
      activeSideBar: 'service'
    });
  } catch (err) {
    next(err);
  }
}

export const getCreateService = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('service/createService',{
      user: mongooseToObject(user),
      activeSideBar: 'service'
    });
  } catch (err) {
    next(err);
  }
}

export const handleCreateService = async (req, res, next) => {
  
  try {
    const { nameVi, nameEn } = req.body
    const serviceVi = await Service.findOne({ 'name.vi': nameVi });
    const serviceEn = await Service.findOne({ 'name.en': nameEn });

    if(!nameEn || !nameVi){
      return res.status(404).json({message: "Service name is a required field!"});
    }

    if(serviceVi || serviceEn){
      return res.status(404).json({message: "Service already exists!"});
    }

    const newService = new Service({
      name: {
        vi:nameVi,
        en:nameEn
      }
    });

    await newService.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getEditService = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const serviceEdit = await Service.findById(req.params.id)
    res.render('service/editService', {
      service:mongooseToObject(serviceEdit), 
      user: mongooseToObject(user),
      activeSideBar: 'service'
    })
  } catch (error) {
    next();
  }
}

export const handleUpdateService = async (req, res, next) => {
  try {
    const { nameVi, nameEn } = req.body
    const currentService = await Service.findById(req.params.id)
    const serviceVi = await Service.findOne({ 'name.vi': nameVi });
    const serviceEn = await Service.findOne({ 'name.en': nameEn });
    if(!currentService){
      return res.status(404).json({message: "Service does not exist!"});
    }
    if(!nameEn || !nameVi){
      return res.status(404).json({message: "Service name is a required field!"});
    }
    
    if((serviceVi && serviceVi.name.vi != currentService.name.vi) || (serviceEn && serviceEn.name.en != currentService.name.en)){
      return res.status(404).json({message: "Service already exists!"});
    }

    await Service.findByIdAndUpdate(req.params.id,{ 
      $set:{
        name: {
          vi:nameVi,
          en:nameEn
        }
      }
    });
    res.status(200).json({message: "Update successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const handleDeleteService = async (req, res, next) => {
  try {
    // Find all projects
    const projects = await Project.find();
    // Iterate through each project
    for (const project of projects) {
      // Check if the service ID exists in any of the project's services
      const serviceExists = project.services.some(service => service.name.toString() === req.params.id);
      // If the service exists in any project, return an error
      if (serviceExists) {
        return res.status(400).json({ message: "Cannot delete service. It is associated with one or more projects." });
      }
    }

    await Service.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

