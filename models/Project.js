import mongoose from 'mongoose';
const { Schema } = mongoose;


const ProjectSchema = new mongoose.Schema({
  name: {
    vi: {
      type: String,
      unique: true
    },
    en: {
      type: String,
      unique: true
    } 
  },

  icon: {
    type: mongoose.Types.ObjectId, 
    ref: 'Icon'
  },

  latLong: {
    type: [Number],
    required: true
  },

  image: {
    type: String
  },

  location: {
    vi: {
      type: String
    },
    en: {
      type: String
    }
  },

  time: {
    vi: {
      type: String
    },
    en: {
      type: String
    }
  },

  customer: {
    type: mongoose.Types.ObjectId, 
    ref: "Customer"
  },

  scopeOfWork: {
    vi: {
      type: String
    }, 
    en: {
      type: String
    }
  },

  services: [{
    name: {
      type: mongoose.Types.ObjectId,  ref: 'Service'
    },
    icon: {
      type: mongoose.Types.ObjectId,  ref: 'Icon'
    },
    description:{
      vi: {
        type: String
      }, 
      en: {
        type: String
      }
    },
    imageCover: {
      type: String
    },
    images: {
      type: [String]
    }
  }],

  oilField: {
    type: mongoose.Types.ObjectId,
    ref: 'Field',
    default: undefined
  }
},{timestamps: true})

export default mongoose.model("Project", ProjectSchema)