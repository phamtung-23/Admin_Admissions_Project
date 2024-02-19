import { mongooseToObject, mutipleMongooseTonObject } from '../../utils/mongooses.js'
import User from '../../models/User.js';
import Service from '../../models/Service.js'
import Project from '../../models/Project.js'
import { createError } from '../../utils/error.js';
import Icon from '../../models/Icon.js';
import Customer from '../../models/Customer.js';
import Field from '../../models/Field.js';


export const getListProject = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("icon").populate("customer");
    const user  = await User.findOne({_id: req.user.id})
    res.render('project/listProject', 
    {
      user: mongooseToObject(user),
      projects: mutipleMongooseTonObject(projects),
      activeSideBar: 'project'
    });
  } catch (err) {
    next(err);
  }
}

export const getCreateProject = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const icons = await Icon.find()
    const customers = await Customer.find()
    const fields = await Field.find()
    const services = await Service.find()

    res.render('project/createProject',{
      user: mongooseToObject(user),
      icons: mutipleMongooseTonObject(icons),
      customers: mutipleMongooseTonObject(customers),
      fields: mutipleMongooseTonObject(fields),
      services: mutipleMongooseTonObject(services),
      activeSideBar: 'project'
    });
  } catch (err) {
    next(err);
  }
}

function hasObjectWithFieldname(array, fieldNameToCheck) {
  if (array.some(item => item.fieldname === fieldNameToCheck)){
    return true 
  }else{
    return false
  }
}

export const handleCreateProject = async (req, res, next) => {
    // console.log(req.files)
  try {
    let {nameVi, nameEn, icon, customer, nameService, latLong, oilField, locationEn, locationVi, timeVi, timeEn, scopeOfWorkVi, scopeOfWorkEn} = req.body
    // console.log(nameService)
    
    const existNameVi = await Project.findOne({'name.vi':nameVi})
    const existNameEn = await Project.findOne({'name.en':nameEn})
    // check name project
    if (!nameVi || !nameEn){
      return res.status(404).json({message: "Project name is a required field!"});
    }
    if (existNameVi || existNameEn){
      return res.status(404).json({message: "Project name already exists!"});
    }
    // check icon
    if (!icon){
      return res.status(404).json({message: "Icon is a required field!"});
    }
    // check customer
    if (!customer){
      return res.status(404).json({message: "Customer is a required field!"});
    }
    // check latLong
    if (!latLong){
      return res.status(404).json({message: "Coordinates are a required field!"});
    }
    // check format latLong [1,1] and check exist number
    if (!latLong.match(/^\[[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+\]$/)){
        return res.status(400).json({message: "Coordinates format is invalid!"});
    }
    // convert string '[1,1]' to array
    const latLongArr = latLong.slice(1, -1).split(',').map(item => Number(item))
    
    // check oil field
    if (!oilField){
      req.body.oilField = null
    }
    

    const imageListForm = req.files

    // check image of project
    let imageProject
    if (hasObjectWithFieldname(imageListForm, 'ImageProject')) {
      imageListForm.map((item)=>{
        if (item.fieldname === 'ImageProject') {
          const domain = req.get("host");
          let protocol
          if (req.protocol === "https") {
            protocol = "https"
          }
          else {
            protocol = "http"
          }
          imageProject = protocol+"://"+domain+"/"+item.originalname
        }
      })
    } else {
      return res.status(404).json({message: "Please choose an image for the project!"});
    }
    
    // check name service
    if (!nameService){
      return res.status(404).json({message: "Service name is a required field!"});
    }
    
    let iconServiceArray = []
    if (typeof nameService == 'string'){
      nameService = [nameService]
    }
    // nameService = ['65ae1f154b3843d2c24f8296','65b2216c5cc7ebd69796532d']
    if (nameService){
      let hasError = false
      let message

      nameService.forEach((item) => {
        let iconId
        let imageCover
        let desVi
        let desEn
        let imageGallery = []
        if (!hasError){
          const iconNameService = 'iconService_'+item
          if (iconNameService in req.body) {
            iconId = req.body[iconNameService];
            if (iconId == ""){
              hasError = true
              message = `Please choose an icon for the service!`
            }
          } else {
            hasError = true
            message = `Please choose an icon for the service!`
          }
        }
        // check description
        if (!hasError){
          const desViService = 'desVi_'+item
          if (desViService in req.body) {
            desVi = req.body[desViService];
          }
        }
        if (!hasError){
          const desEnService = 'desEn_'+item
          if (desEnService in req.body) {
            desEn = req.body[desEnService];
          }
        }

        if (!hasError){ 
          const imgCoverService = 'imageServiceCover_'+item
          if (hasObjectWithFieldname(imageListForm, imgCoverService)) {
            imageListForm.map((img)=>{
              if (img.fieldname === imgCoverService) {
                const domain = req.get("host");
                let protocol
                if (req.protocol === "https") {
                  protocol = "https"
                }
                else {
                  protocol = "http"
                }
                imageCover = protocol+"://"+domain+"/"+img.originalname
              }
            })
          } else {
            hasError = true
            message = `Please choose a cover image for the service!`
          }
        }

        if (!hasError){ 
          const imgGalleryService = 'imageServiceGallery_'+item
          if (hasObjectWithFieldname(imageListForm, imgGalleryService)) {
            imageListForm.map((img)=>{
              if (img.fieldname === imgGalleryService) {
                const domain = req.get("host");
                let protocol
                if (req.protocol === "https") {
                  protocol = "https"
                }
                else {
                  protocol = "http"
                }
                imageGallery.push(protocol+"://"+domain+"/"+img.originalname)
              }
            })
            if (imageGallery.length > 5){
              hasError = true
              message = `Please choose a maximum of 5 images for the service gallery!`
            }
          }else{
            hasError = true
            message = `Please choose gallery images for the service!`
          }
        }
        if (!hasError){
          iconServiceArray.push({
            name: item,
            icon: iconId,
            description: {
              vi: desVi,
              en: desEn
            },
            imageCover: imageCover,
            images: imageGallery
          })
        }
      })

      if (hasError){
        hasError = false
        return res.status(404).json({message: message});
      }
    } 
 
    const newProject = new Project({
      ...req.body,
      name: {
        vi:nameVi,
        en:nameEn
      },
      location: {
        vi:locationVi,
        en:locationEn
      },
      image:imageProject,
      icon: icon,
      customer: customer,
      time: {
        vi:timeVi,
        en:timeEn
      },
      scopeOfWork: {
        vi:scopeOfWorkVi,
        en:scopeOfWorkEn
      },
      latLong: latLongArr,
      services:iconServiceArray

    });

    await newProject.save();
    res.status(200).json({message: "Create successful!"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

export const getServicesSelect = async  (req, res, next) => {
  const {selectedValues} = req.body
  // loop selectedValues and get data and return json all data
  try {
    const services = await Service.find({_id: {$in: selectedValues}})
    res.status(200).json({services: mutipleMongooseTonObject(services)});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
export const getServicesSelectProject = async  (req, res, next) => {
  const {selectedValues} = req.body
  // console.log(selectedValues)
  // loop selectedValues and get data and return json all data
  try {
    const servicesClient = await Service.find({_id: {$in: selectedValues}})
    const project = await Project.findById(req.params.id)
      .populate("icon")
      .populate("customer")
      .populate({
        path: "services",
        populate: {
          path: "name"
        },
      })
      .populate({
        path: "services",
        populate: {
          path: "icon"
        },
      })
      .populate("oilField");
    // get all sẻvices of project
    const { services } = project.toObject();

    const icons = await Icon.find()
    // Filter services based on selectedValues array
    const filteredServices = services.filter(service =>
      selectedValues.includes(service.name._id.toString())
    );
    // filter services not in selectedValues array 
    const missingServiceIds = selectedValues.filter(
      (selectedId) => !services.some((service) => service.name._id.toString() === selectedId)
    );

    const responseData = [];
    services.forEach(service => {
      // check service id in filteredServices then push data include idName, name, data of filteredServices with service id
      if (filteredServices.some((item) => item.name._id.toString() === service.name._id.toString())) {
        responseData.push({
          idName: service.name._id.toString(),
          name: service.name.name.vi,
          data: filteredServices.find((item) => item.name._id.toString() === service.name._id.toString()),
          icons
      })}
    });

    const servicesClientNotData = await Service.find({_id: {$in: missingServiceIds}})
    servicesClientNotData.forEach(i => {
      responseData.push({
        idName: i._id.toString(),
        name: i.name.vi,
        data: null,
        icons
      })
    })
    // console.log(servicesClientNotData)
    // console.log(responseData)

    res.status(200).json({services: responseData});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const getDetailProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("icon").populate("customer");
    // console.log(project)
    const user  = await User.findOne({_id: req.user.id})
    res.render('project/detailProject', 
    {
      user: mongooseToObject(user),
      project: mongooseToObject(project)
    });
  } catch (err) {
    next(err);
  }
}

export const getEditProject = async (req, res, next) => {
  try {
    
    const user  = await User.findOne({_id: req.user.id})
    const project = await Project.findById(req.params.id)
      .populate("icon")
      .populate("customer")
      .populate({
        path: "services",
        populate: {
          path: "name"
        },
      })
      .populate({
        path: "services",
        populate: {
          path: "icon"
        },
      })
      .populate("oilField");
    // Chia dữ liệu thành hai ngôn ngữ: vi (Vietnamese) và en (English)
    const {
      _id,
      createdAt,
      updatedAt,
      __v,
      name,
      location,
      time,
      scopeOfWork,
      icon,
      latLong,
      image,
      customer,
      services,
      oilField,
      ...rest
    } = project.toObject();

    const iconProject = {
      _id: icon._id,
      name: icon.name,
      imageUrl: icon.imageUrl,
    };

    const localizedCustomer = {
      vi: {
        name: customer.name.vi,
      },
      en: {
        name: customer.name.en,
      },
    };

    let arrayServiceVi = [];
    let arrayServiceSelect = [];

    services.forEach(service => {
      arrayServiceVi.push({
        _id: service._id.toString(),
        name: {
          vi:service.name.name.vi,
          _id: service.name._id.toString()
        },
        icon: {
          _id: service.icon._id.toString(),
          name: service.icon.name,
          imageUrl: service.icon.imageUrl,
        },
        description: service.description,
        imageCover: service.imageCover,
        images: service.images,
      });

      arrayServiceSelect.push({
        idName: service.name._id.toString(),
        idServiceProject: service._id.toString()
      });
    });
 
    // console.log(project)
    let localizedOilField
    if (oilField){
      localizedOilField = {
        id: oilField._id,
        fieldId: oilField.fieldId,
        colorCodeBg: oilField.colorCodeBg,
        // colorCodeLine: oilField.colorCodeLine,
        colorImage: oilField.colorImage,
        location: oilField.location.coordinates
      };  
    }
    

    const icons = await Icon.find()
    const customers = await Customer.find()
    const fields = await Field.find()
    const servicesList = await Service.find()

    const idSelected  = iconProject._id.toString()
    const strLatLong = JSON.stringify(latLong)

    const localizedData = {
        id: _id,
        name: {
          vi: name.vi,
          en: name.en,
        },
        location: {
          vi: location.vi,
          en: location.en,
        },
        time: {
          vi: time.vi,
          en: time.en,
        },
        scopeOfWork: {
          vi: scopeOfWork.vi,
          en: scopeOfWork.en,
        },
        icon: iconProject,
        latLong,
        image,
        customer: {
          vi: localizedCustomer.vi,
          en: localizedCustomer.en,
        },
        services: {
          arrayServiceVi:arrayServiceVi,
          icons:icons},
        oilField: localizedOilField,
        ...rest
    };
    const serviceNameSelected = services.map(item => item.name._id.toString())

    const listServiceMain = [];
    servicesList.forEach(item => {
      const matchingService = arrayServiceSelect.find(ob => ob.idName === item._id.toString());
    
      if (matchingService) {
        listServiceMain.push({
          idName: matchingService.idName,
          name: item.name.vi, // Assuming you want to use the Vietnamese name
          idServiceProject: matchingService.idServiceProject,
        });
      }else {
        listServiceMain.push({
          idName: item._id.toString(),
          name: item.name.vi, // Assuming you want to use the Vietnamese name
        });
      }
    });
    
    // console.log(localizedData)
    // console.log(serviceNameSelected)
    // console.log(listServiceMain)
    let fieldCurrent
    if (oilField){
      fieldCurrent = {
        data: mutipleMongooseTonObject(fields),
        idSelected: oilField._id.toString()
      }
    }else{
      fieldCurrent = {
        data: mutipleMongooseTonObject(fields),
      }
    }
    
    res.render('project/editProject', { 
      user: mongooseToObject(user),
      activeSideBar: 'project',
      icons: {
        data: mutipleMongooseTonObject(icons),
        idSelected: idSelected},
      customers: {
        data: mutipleMongooseTonObject(customers),
        idSelected: customer._id.toString()},
      fields:fieldCurrent,
      services: {
        data: listServiceMain,
        idSelected: serviceNameSelected
      },
      project: localizedData,
      strLatLong
    })
  } catch (error) {
    next();
  }
}

export const handleUpdateProject = async (req, res, next) => {
    // console.log(req.files)
    try {
      const projectEdit = await Project.findById(req.params.id)
      .populate("icon")
      .populate("customer")
      .populate({
        path: "services",
        populate: {
          path: "name"
        },
      })
      .populate({
        path: "services",
        populate: {
          path: "icon"
        },
      })
      .populate("oilField");
      
      let {nameVi, nameEn, icon, customer, nameService, latLong, oilField, locationEn, locationVi, timeVi, timeEn, scopeOfWorkVi, scopeOfWorkEn} = req.body
      
      // console.log(projectEdit.services)
      // console.log(req.body)
      // console.log(req.files)
      
      const existNameVi = await Project.findOne({'name.vi':nameVi})
      const existNameEn = await Project.findOne({'name.en':nameEn})
      // check name project
      if (!nameVi || !nameEn){
        return res.status(404).json({message: "Project name is a required field!"});
      }
      
      if ((existNameVi && existNameVi.name.vi != projectEdit.name.vi) || (existNameEn && existNameEn.name.en != projectEdit.name.en)){
        return res.status(404).json({message: "Project name already exists!"});
      }

      // check icon
      if (!icon){
        icon = projectEdit.icon._id.toString()
      }
      // check customer
      if (!customer){
        customer = projectEdit.customer._id.toString()
      }

      // check latLong
      let latLongArr
      if (latLong){
        // convert string '[1,1]' to array
        latLongArr = latLong.slice(1, -1).split(',').map(item => Number(item))
      }else{
        latLongArr = projectEdit.latLong
      }
      
      // check oil field
      // if (!oilField){
      //   oilField = undefined
      //   console.log(oilField)
      //   if(projectEdit.oilField){
      //     oilField = projectEdit.oilField._id.toString()
      //   }
      // }

      const imageListForm = req.files
  
      // check image of project
      let imageProject
      if (hasObjectWithFieldname(imageListForm, 'ImageProject')) {
        imageListForm.map((item)=>{
          if (item.fieldname === 'ImageProject') {
            const domain = req.get("host");
            let protocol
            if (req.protocol === "https") {
              protocol = "https"
            }
            else {
              protocol = "http"
            }
            imageProject = protocol+"://"+domain+"/"+item.originalname
          }
        })
      } 
      else {
        imageProject = projectEdit.image
      }
      
      // update project
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: {
              vi: nameVi,
              en: nameEn
            },
            location: {
              vi: locationVi,
              en: locationEn
            },
            time: {
              vi: timeVi,
              en: timeEn
            },
            scopeOfWork: {
              vi: scopeOfWorkVi,
              en: scopeOfWorkEn
            },
            image: imageProject,
            icon: icon,
            customer: customer,
            latLong: latLongArr,
            oilField: oilField ? oilField : null
          }
        },
        { new: true }
      );

      // check name service
      if (!nameService){
        return res.status(404).json({message: "Service name is a required field!"});
      }
      
      let iconServiceArray = []

      if (typeof nameService == 'string'){
        nameService = [nameService]
      }

      // Update services data
      const protocol = req.protocol;
      const domain = req.get('host');

      // const updatedServices = await Promise.all(
      //   req.body.nameService.map(async (serviceId, index) => {
      //     const serviceData = {
      //       name: serviceId,
      //       icon:req.body[`iconService_${serviceId}`],
      //       imageCover: `${protocol}://${domain}/${imageListForm[index * 2 + 1].filename}`,
      //       images: imageListForm
      //         .filter((item) => item.fieldname === `imageServiceGallery_${serviceId}`)
      //         .map((item) => `${protocol}://${domain}/${item.filename}`)
      //     };
      //     return serviceData;
      //   })
      // );
      let newServiceList = []
      let hasError = false
      let message
      const updatedServices = await Promise.all(
        nameService.map(async (serviceId, index) => {
          const existingService = updatedProject.services.find((service) =>
            service.name.equals(serviceId)
          );
          // console.log(existingService)
          if (existingService) {
            // If service already exists, update its properties and add new images to the existing array
            
            existingService.name = serviceId;
            existingService.icon = req.body[`iconService_${serviceId}`];
            existingService.description.vi = req.body[`desVi_${serviceId}`];
            existingService.description.en = req.body[`desEn_${serviceId}`];

            const existImgCover = imageListForm.find((item) => item.fieldname === `imageServiceCover_${serviceId}`)
            if (existImgCover){
              existingService.imageCover = `${protocol}://${domain}/${existImgCover.filename}`;
            }
            
            existingService.images.push(
              ...imageListForm
                .filter((item) => item.fieldname === `imageServiceGallery_${serviceId}`)
                .map((item) => `${protocol}://${domain}/${item.filename}`)
            );
            if (existingService.images.length > 5){
              hasError = true
              message = `Please choose a maximum of 5 images (including existing ones) for the service gallery!`
            }
            newServiceList.push(existingService)
          } else {
            // If service does not exist, create a new service with new images
            if (!hasError){
              if (!req.body[`iconService_${serviceId}`]){
                hasError = true
                message = `Please choose an icon for the service!`
              }
            }
            let newImgCover
            if (!hasError){
              const existImgCover = imageListForm.find((item) => item.fieldname === `imageServiceCover_${serviceId}`)
              if (existImgCover){
                newImgCover = `${protocol}://${domain}/${existImgCover.filename}`;
              }else{
                hasError = true
                message = `Please choose a cover image for the service!`
              }
            }
            const newImages = imageListForm
              .filter((item) => item.fieldname === `imageServiceGallery_${serviceId}`)
              .map((item) => `${protocol}://${domain}/${item.filename}`);
            if (!hasError){
              if (newImages.length == 0) {
                hasError = true
                message = `Please choose gallery images for the service!`
              }else if (newImages.length > 5){
                hasError = true
                message = `Please choose a maximum of 5 images for the service gallery!`
              }
            }
            if (!hasError){
              const newServiceData = {
                name: serviceId,
                icon: req.body[`iconService_${serviceId}`],
                description: {
                  vi: req.body[`desVi_${serviceId}`],
                  en: req.body[`desEn_${serviceId}`]
                },
                imageCover: newImgCover,
                images: newImages
              };
              newServiceList.push(newServiceData)
            }
            // updatedProject.services.push(newServiceData);
          }
        })
      );
      if (hasError){
        hasError = false
        return res.status(400).json({message})
      }

      updatedProject.services = newServiceList
      // console.log(projectEdit)
      await updatedProject.save();
      res.status(200).json({message: "Update successful!"});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
}

export const handleDeleteProject = async (req, res, next) => {
  try {
    await Project.deleteOne({_id: req.params.id});
    res.status(200).json({message: "Delete successful"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const handleDeleteImage = async (req, res, next) => {
  try {
    const idService = req.params.id
    const indexImage = req.params.index
    const project = await Project.findOne({ 'services': { $elemMatch: { _id: idService } } })
    const { services } = project.toObject();
    // find service with idService
    const service = services.find(item => item._id.toString() === idService)
    // remove image with indexImage
    service.images.splice(indexImage, 1)
    // update project
    await Project.findOneAndUpdate({ 'services': { $elemMatch: { _id: idService } } }, { $set: { services: services } })
    res.status(200).json({message: "Image deleted!"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
