import Banner from '../models/Banner.js';

function getFullUrlImg(req,image){
  const domain = req.get("host");
  let protocol  
  if (req.protocol === "https") {
    protocol = "https"
  } else {
    protocol = "http"
  }
  return protocol+"://"+domain+"/"+image
}

export const handleGetBanner = async (req, res, next) => {
  try {
    const bannerAll = await Banner.find();
    const localizedBanner = bannerAll.map(item => {
      const { _id, createdAt, updatedAt, name, imageUrl, status, __v } = item.toObject();

      return {
          name: name,
          imageUrl: getFullUrlImg(req, imageUrl),
      };
    });
    res.status(200).json(localizedBanner); 
  } catch (error) {
    res.status(500).json({message: err.message});
  }
}


