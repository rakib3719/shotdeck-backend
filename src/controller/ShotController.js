import Shot from "../models/shotModel.js";






export const createShot = async(req, res)=>{
  try {


    const data = req.body;
    const resp = await Shot.create(data);
    res.status(201).json({
      message:'Shot create sucessfully',
      data:resp
    })
    
  } catch (error) {
    res.status(401).json({
      message:'Something went worng!',
      error
    })
  }
}




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

if (title) filter.title = title;
if (description) filter.description = description;
if (imageUrl) filter.imageUrl = imageUrl;
if (youtubeLink) filter.youtubeLink = youtubeLink;
if (gallery) filter.gallery = { $in: gallery };

if (mediaType) filter.mediaType = mediaType;
if (genre) filter.genre = { $in: genre };
if (releaseYear) filter.releaseYear = releaseYear;
if (timePeriod) filter.timePeriod = timePeriod;
    if (color) filter.color = { $in: parseArrayParam(queryParams.color) };
if (roscoColor) filter.roscoColor = roscoColor;
if (customColor) filter.customColor = customColor;

if (aspectRatio) filter.aspectRatio = aspectRatio;
if (opticalFormat) filter.opticalFormat = opticalFormat;
if (labProcess) filter.labProcess = { $in: labProcess };
if (format) filter.format = format;
if (locationType) filter.locationType = locationType;
if (timeOfDay) filter.timeOfDay = timeOfDay;
if (numberOfPeople) filter.numberOfPeople = numberOfPeople;
if (gender) filter.gender = { $in: gender };
if (ageGroup) filter.ageGroup = { $in: ageGroup };
if (ethnicity) filter.ethnicity = { $in: ethnicity };

if (frameSize) filter.frameSize = frameSize;
if (shotType) filter.shotType = { $in: shotType };
if (composition) filter.composition = composition;
if (lensType) filter.lensType = lensType;

if (lightingStyle) filter.lightingStyle = { $in: lightingStyle };
if (lightingType) filter.lightingType = { $in: lightingType };

if (director) filter.director = director;
if (cinematographer) filter.cinematographer = cinematographer;
if (productionDesigner) filter.productionDesigner = productionDesigner;
if (costumeDesigner) filter.costumeDesigner = costumeDesigner;
if (editor) filter.editor = { $in: editor };

if (camera) filter.camera = camera;
if (lens) filter.lens = { $in: lens };

if (shotTime) filter.shotTime = shotTime;
if (set) filter.set = set;
if (storyLocation) filter.storyLocation = storyLocation;
if (filmingLocation) filter.filmingLocation = filmingLocation;

if (tags) filter.tags = { $in: tags };
if (keywords) filter.keywords = { $in: keywords };


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
}