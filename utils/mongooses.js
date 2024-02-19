
export const mutipleMongooseTonObject = function (mongoose){
    return mongoose.map(mongoose => mongoose.toObject())
  }

export const mongooseToObject = function (mongoose){
    return mongoose ? mongoose.toObject() : mongoose
  }
