import Project from "../models/Project.js";
import {
  mongooseToObject
} from "../utils/mongooses.js";



export const getProjectsVi = async (req, res, next) => {
  try {
    const projects = await Project.find()
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
    const modifiedProjects = projects.map(project => {
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
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
      let arrayServiceVi = []
      let arrayServiceEn = []
      services.map(service => {
        arrayServiceVi.push({
          name: service.name.name.vi,
          icon: {
            // _id: service.icon._id,
            name: service.icon.name,
            imageUrl: service.icon.imageUrl,
          },
          description: service.description.vi,
          imageCover: service.imageCover,
          images: service.images,
        })
        arrayServiceEn.push({
          name: service.name.name.en,
          icon: {
            // _id: service.icon._id,
            name: service.icon.name,
            imageUrl: service.icon.imageUrl,
          },
          description: service.description.en,
          imageCover: service.imageCover,
          images: service.images,
        }) 
      })

      const localizedOilField = {
        id: oilField._id,
        fieldId: oilField.fieldId,
        colorCodeBg: oilField.colorCodeBg,
        colorCodeLine: oilField.colorCodeLine,
        colorImage: oilField.colorImage,
        location: oilField.location.coordinates
      }

      const localizedData = {
          id: _id,
          name: name.vi,
          location: location.vi,
          time: time.vi,
          scopeOfWork: scopeOfWork.vi,
          icon: iconProject,
          latLong,
          image,
          customer: localizedCustomer.vi,
          services: arrayServiceVi,
          oilField: localizedOilField,
          ...rest
      };
      return localizedData;
    });

    res.status(200).json(modifiedProjects);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getProjectsEn = async (req, res, next) => {
  try {
    const projects = await Project.find()
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
    const modifiedProjects = projects.map(project => {
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
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
      let arrayServiceVi = []
      let arrayServiceEn = []
      services.map(service => {
        arrayServiceVi.push({
          name: service.name.name.vi,
          icon: {
            // _id: service.icon._id,
            name: service.icon.name,
            imageUrl: service.icon.imageUrl,
          },
          description: service.description.vi,
          imageCover: service.imageCover,
          images: service.images,
        })
        arrayServiceEn.push({
          name: service.name.name.en,
          icon: {
            // _id: service.icon._id,
            name: service.icon.name,
            imageUrl: service.icon.imageUrl,
          },
          description: service.description.en,
          imageCover: service.imageCover,
          images: service.images,
        }) 
      })

      const localizedOilField = {
        id: oilField._id,
        fieldId: oilField.fieldId,
        colorCodeBg: oilField.colorCodeBg,
        colorCodeLine: oilField.colorCodeLine,
        colorImage: oilField.colorImage,
        location: oilField.location.coordinates
      }

      const localizedData = {
          id: _id,
          name: name.en,
          location: location.en,
          time: time.en,
          scopeOfWork: scopeOfWork.en,
          icon: iconProject,
          latLong,
          image,
          customer: localizedCustomer.en,
          services: arrayServiceEn,
          oilField: localizedOilField,
          ...rest
      };
      return localizedData;
    });

    res.status(200).json(modifiedProjects);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getDetailProjectVi = async (req, res) => {
  try {
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
    let arrayServiceEn = [];

    services.forEach(service => {
      arrayServiceVi.push({
        name: service.name.name.vi,
        icon: {
          name: service.icon.name,
          imageUrl: service.icon.imageUrl,
        },
        description: service.description.vi,
        imageCover: service.imageCover,
        images: service.images,
      });

      arrayServiceEn.push({
        name: service.name.name.en,
        icon: {
          name: service.icon.name,
          imageUrl: service.icon.imageUrl,
        },
        description: service.description.en,
        imageCover: service.imageCover,
        images: service.images,
      });
    });

    const localizedOilField = {
      id: oilField._id,
      fieldId: oilField.fieldId,
      colorCodeBg: oilField.colorCodeBg,
      colorCodeLine: oilField.colorCodeLine,
      colorImage: oilField.colorImage,
      location: oilField.location.coordinates
    };

    const localizedData = {
        id: _id,
        name: name.vi,
        location: location.vi,
        time: time.vi,
        scopeOfWork: scopeOfWork.vi,
        icon: iconProject,
        latLong,
        image,
        customer: localizedCustomer.vi,
        services: arrayServiceVi,
        oilField: localizedOilField,
        ...rest
    };

    res.status(200).json(localizedData);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}


export const getDetailProjectEn = async (req, res) => {
  try {
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
    let arrayServiceEn = [];

    services.forEach(service => {
      arrayServiceVi.push({
        name: service.name.name.vi,
        icon: {
          name: service.icon.name,
          imageUrl: service.icon.imageUrl,
        },
        description: service.description.vi,
        imageCover: service.imageCover,
        images: service.images,
      });

      arrayServiceEn.push({
        name: service.name.name.en,
        icon: {
          name: service.icon.name,
          imageUrl: service.icon.imageUrl,
        },
        description: service.description.en,
        imageCover: service.imageCover,
        images: service.images,
      });
    });

    const localizedOilField = {
      id: oilField._id,
      fieldId: oilField.fieldId,
      colorCodeBg: oilField.colorCodeBg,
      colorCodeLine: oilField.colorCodeLine,
      colorImage: oilField.colorImage,
      location: oilField.location.coordinates
    };

    const localizedData = {
        id: _id,
        name: name.en,
        location: location.en,
        time: time.en,
        scopeOfWork: scopeOfWork.en,
        icon: iconProject,
        latLong,
        image,
        customer: localizedCustomer.en,
        services: arrayServiceEn,
        oilField: localizedOilField,
        ...rest
    };

    res.status(200).json(localizedData);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}


