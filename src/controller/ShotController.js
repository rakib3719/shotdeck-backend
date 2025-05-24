import jwt from 'jsonwebtoken'
import Shot from "../models/shotModel.js";
import { resetPassword } from './authController.js';







export const createShot = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let user;

    try {
      user = jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
      console.log(user, 'user atat')
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token', err });
    }

    const data = req.body;
  data.status = user.role === 'admin' ? "active" : "pending";

  

if(user){
      const resp = await Shot.create(data);
      return res.status(201).json({
      message: 'Shot created successfully',
      data: resp
    });
}

    

  } catch (error) {
    console.error('Shot creation error:', error.message);
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message 
    });
  }
};

  



export const deleteShot = async(req, res)=>{
  try {
    const id = req.params.id;
    
    const filter = {_id:id};
    const resp = await Shot.deleteOne(filter);
    res.status(201).json({
      message:'Sucess',
      data:resp
    })
  } catch (error) {
    res.status(401).json({
      message:'Something went worng!',
      error
    })
  }
}

 const parseArrayParam = (param) => {
      if (!param) return undefined;
      return Array.isArray(param) ? param : param.split(',');
    };

export const getShot = async(req, res)=>{
  try {


    const {
  search,
  title,
  description,
  imageUrl,
  youtubeLink,
  gallery,
  mediaType,
  genre,
  releaseYear,
  timePeriod,
  color,
  roscoColor,
  customColor,
  aspectRatio,
  opticalFormat,
  labProcess,
  format,
  locationType,
  timeOfDay,
  numberOfPeople,
  gender,
  ageGroup,
  ethnicity,
  frameSize,
  shotType,
  composition,
  lensType,
  lightingStyle,
  lightingType,
  director,
  cinematographer,
  productionDesigner,
  costumeDesigner,
  editor,
  age,
  interiorExterior,
  camera,
  lens,
  shotTime,
  set,
  storyLocation,
  filmingLocation,
  tags,
  keywords,
} = req.query;

console.log(mediaType, 'this is')
const filter = {};
console.log(search, 'this is genre')

if (title) filter.title = title;
if (description) filter.description = description;
if (imageUrl) filter.imageUrl = imageUrl;
if (youtubeLink) filter.youtubeLink = youtubeLink;
if (gallery) filter.gallery = { $in: gallery };
if (mediaType) filter.mediaType = { $in: parseArrayParam(mediaType) };
if (genre) filter.genre = { $in: parseArrayParam(genre) };
if (releaseYear) filter.releaseYear = releaseYear;
if (timePeriod) filter.timePeriod = { $in: parseArrayParam(timePeriod) };
if (color) filter.color = { $in: parseArrayParam(color) };
if (roscoColor) filter.roscoColor = { $in: parseArrayParam(roscoColor) };
if (customColor) filter.customColor = { $in: parseArrayParam(customColor) };
if (aspectRatio) filter.aspectRatio = { $in: parseArrayParam(aspectRatio) };
if (opticalFormat) filter.opticalFormat = { $in: parseArrayParam(opticalFormat) };
if (labProcess) filter.labProcess = { $in: parseArrayParam(labProcess) };
if (format) filter.format = { $in: parseArrayParam(format) };
if (locationType) filter.locationType ={ $in: parseArrayParam(locationType) };
if (timeOfDay) filter.timeOfDay = { $in: parseArrayParam(timeOfDay) };
if (numberOfPeople) filter.numberOfPeople = { $in: parseArrayParam(numberOfPeople) };
if (gender) filter.gender = { $in: parseArrayParam(gender) };
if (ageGroup) filter.ageGroup = { $in: parseArrayParam(ageGroup) };
if (age) filter.age = { $in: parseArrayParam(age) };
if (ethnicity) filter.ethnicity = { $in: parseArrayParam(ethnicity) };
if (interiorExterior) filter.interiorExterior = { $in: parseArrayParam(interiorExterior) };
if (frameSize) filter.frameSize = { $in: parseArrayParam(frameSize) };
if (shotType) filter.shotType = { $in: parseArrayParam(shotType) };
if (composition) filter.composition = { $in: parseArrayParam(composition) };
if (lensType) filter.lensType = { $in: parseArrayParam(lensType) };
if (lightingStyle) filter.lightingStyle = { $in: parseArrayParam(lightingStyle) };
if (lightingType) filter.lightingType = { $in: parseArrayParam(lightingType) };
if (director) filter.director = { $in: parseArrayParam(director) };
if (cinematographer) filter.cinematographer = { $in: parseArrayParam(cinematographer) };
if (productionDesigner) filter.productionDesigner = { $in: parseArrayParam(productionDesigner) };
if (costumeDesigner) filter.costumeDesigner = { $in: parseArrayParam(costumeDesigner) };
if (editor) filter.editor = { $in: parseArrayParam(editor) };
if (camera) filter.camera = { $in: parseArrayParam(camera) };
if (lens) filter.lens = { $in: parseArrayParam(lens) };
if (shotTime) filter.shotTime = { $in: parseArrayParam(shotTime) };
if (set) filter.set = { $in: parseArrayParam(set) };
if (storyLocation) filter.storyLocation = { $in: parseArrayParam(storyLocation) };
if (filmingLocation) filter.filmingLocation = { $in: parseArrayParam(filmingLocation) };
if (tags) filter.tags = { $in: parseArrayParam(tags) };
if (keywords) filter.keywords = { $in: parseArrayParam(keywords) };


    const resp = await Shot.find(filter);
    res.status(201).json({
      message:'Sucess',
      data:resp
    })
    
  } catch (error) {
    res.status(401).json({
      message:'Something went wrong!',
      error
    })
    
  }
};


export const getRequestedShot = async(req, res)=>{
  try {
  const skip = req.query.skip;
  const limit = req.query.limit;
  const data =await Shot.find({status: 'pending'}).skip(skip).limit(limit);
  res.status(201).json({
    message:'Sucess',
    data
  })

  
  } catch (error) {
    res.status(401).json({
      message:'Somethin went worng!',
      error
    })
  }
}

export const statusChange = async(req, res)=>{
  try {
    const status = req.body.status
    const id = req.params.id;
     const updatedShot = await Shot.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    )
    res.status(201).json({
      message:'Success',
      data:updatedShot
    })
    
  } catch (error) {
    res.status(401).json({
      message:'Somethnig went worng!',
      error
    })
  }
}





// export const overView = async(req, res)=>{
//   try {
//     const totalShot = await Sh
    
//   } catch (error) {
//     res.status(500).json({
//       message:'Something went worng!',
//       error
//     })
//   }
// }