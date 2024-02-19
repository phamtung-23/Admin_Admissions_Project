import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import Customer from '../../models/Customer.js';
import Project from '../../models/Project.js';
import { createError } from '../../utils/error.js';


export const getListCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.find();
    const user  = await User.findOne({_id: req.user.id})
    res.render('customer/listCustomer', 
    {
      user: mongooseToObject(user),
      customer: mutipleMongooseTonObject(customer),
      activeSideBar: 'customer'
    });
  } catch (err) {
    next(err);
  }
}

export const getCreateCustomer = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    res.render('customer/createCustomer',{
      user: mongooseToObject(user),
      activeSideBar: 'customer'
    });
  } catch (err) {
    next(err);
  }
}

export const handleCreateCustomer = async (req, res, next) => {
  try {
    const {nameVi, nameEn} = req.body
    const existNameVi = await Customer.findOne({'name.vi': nameVi})
    const existNameEn = await Customer.findOne({'name.en': nameEn})

    if(!nameVi || !nameEn){
      return res.status(404).json({message: "Client name is a required field!"});
    }
    if(existNameVi || existNameEn){
      return res.status(404).json({message: "Client already exists!"});
    }
    const customer = new Customer({
      name:{
        vi: nameVi,
        en: nameEn
      }
    });
    await customer.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(500).json({message: "An error occurred while creating the account!"});
  }
}

export const getEditCustomer = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const customerEdit = await Customer.findById(req.params.id)
    res.render('customer/editCustomer', {
      customer:mongooseToObject(customerEdit), 
      user: mongooseToObject(user),
      activeSideBar: 'customer'})
  } catch (error) {
    next();
  }
}

export const handleUpdateCustomer = async (req, res, next) => {
  try {
    const {nameVi, nameEn} = req.body
    let currentCustomer = await Customer.findById(req.params.id)
    const existNameVi = await Customer.findOne({'name.vi': nameVi})
    const existNameEn = await Customer.findOne({'name.en': nameEn})

    if(!nameVi || !nameEn){
      return res.status(404).json({message: "Client name is a required field!"});
    }

    if((existNameVi && existNameVi.name.vi != currentCustomer.name.vi) || (existNameEn && existNameEn.name.en != currentCustomer.name.en)){
      return res.status(404).json({message: "Client already exists!"});
    }

    await Customer.findByIdAndUpdate(req.params.id, {
      $set: {
        name:{
          vi: nameVi,
          en: nameEn
        }
      }
    })
    res.status(200).json({message: "Update successful!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred while updating!"});
  }
}

export const handleDeleteCustomer = async (req, res, next) => {
  try {
    // Check if the customer ID exists in any project
    const projectsWithCustomer = await Project.find({ customer: req.params.id });
    if (projectsWithCustomer.length > 0) {
      return res.status(400).json({
        message: "Cannot delete client. It is associated with one or more projects."
      });
    }
    await Customer.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful!"});
  } catch (error) {
    res.status(500).json({message: "An error occurred while deleting!"});
  }
}

