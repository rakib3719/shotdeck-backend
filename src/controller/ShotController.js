import jwt from 'jsonwebtoken'
import Shot from "../models/shotModel.js";
import { resetPassword } from './authController.js';
import Service from '../models/servicesModel.js';
import { User } from '../models/userModel.js';
import { use } from 'react';


// sd

// Backend API endpoint (Node.js/Express example)
export const updateShot = async (req, res) => {
  try {
    const data = req.body;



    console.log(data, 'salar kuryem er udpate data')
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Shot ID is required',
      });
    }

    // Clean and validate data
    const updateData = { ...data };
    
    // Handle simulatorTypes if present
    if (updateData.simulatorTypes) {
      Object.keys(updateData.simulatorTypes).forEach(key => {
        if (Array.isArray(updateData.simulatorTypes[key])) {
          updateData.simulatorTypes[key] = updateData.simulatorTypes[key]
            .filter(item => item && typeof item === 'string');
        }
      });
    }

    // Handle tags if present
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = [];
    }

    // Handle timecodes if present
    if (updateData.timecodes && !Array.isArray(updateData.timecodes)) {
      updateData.timecodes = [];
    }

    const updatedShot = await Shot.findByIdAndUpdate(
      id, 
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedShot) {
      return res.status(404).json({
        success: false,
        message: 'Shot not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Shot updated successfully',
      data: updatedShot
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update shot',
      error: error.message
    });
  }
};




export const createShot = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    let user = null;
    let email = 'Unknown';
    let userId = 'null';

    if (token) {
      try {
        user = jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
        const foundUser = await User.findById(user.id);

        if (foundUser) {
          email = foundUser.email || 'Unknown';
          userId = foundUser._id || 'null';
        }
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token', error: err.message });
      }
    }

    const data = req.body;
    data.status = user?.role === 'admin' ? 'active' : 'pending';
    data.email = email;
    data.userId = userId;

    const resp = await Shot.create(data);
    return res.status(201).json({
      message: 'Shot created successfully',
      data: resp,
    });
  } catch (error) {
    console.error('Shot creation error:', error.message);
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
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

export const getShot = async (req, res) => {
  try {
    const {
      search,
      sortBy,
      // Basic filters
      director,
      focalLength,
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
      particles,
      // Crew filters
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
      // New FX filters
      rigidbodies,
      keywords,
      softBodies,
      clothgroom,
      magicAbstract,
      pyroVolumetrics,
      LiquidsFluids,

      crowd,
      mechanicsTech,
      compositing,
      simulationSize,
      simulationStyle,
      motionStyle,
      emitterSpeed,
      simulationSoftware,
      lightingConditions,
      videoType,
      referenceType,
      videoSpeed,
      videoQuality
    } = req.query;


// if(rigidbodies === 'rigidbodies'){
//   console.log('yes this is rigid boodies')
// }
// else{
//   console.log('na ata arekta')
// }
    // console.log(req.query, 'ay baba kuryem')

    // console.log(tags, 'Searcht tomi asco')
    // console.log(search, 'seqarch o asca abar khela hbe')



    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const parseArrayParam = (param) => {
      if (!param) return [];
      return Array.isArray(param) ? param : param.split(',').map((item) => item.trim());
    };

    const filter = { status: 'active' };

    // Handle search with regex
    if (search && search.trim() !== '') {
      const regex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: regex },
        { description: regex },
        { genre: regex },
        { mediaType: regex },
        { timePeriod: regex },
        { color: regex },
        { roscoColor: regex },
        { customColor: regex },
        { aspectRatio: regex },
        { opticalFormat: regex },
        { labProcess: regex },
        { format: regex },
        { locationType: regex },
        { timeOfDay: regex },
        { numberOfPeople: regex },
        { gender: regex },
        { ageGroup: regex },
        { ethnicity: regex },
        { frameSize: regex },
        { shotType: regex },
        { composition: regex },
        { lensType: regex },
        { lightingStyle: regex },
        { lightingType: regex },
        { director: regex },
        { cinematographer: regex },
        { productionDesigner: regex },
        { costumeDesigner: regex },
        { editor: regex },
        { age: regex },
        { interiorExterior: regex },
        { camera: regex },
        { lens: regex },
        { shotTime: regex },
        { set: regex },
        { storyLocation: regex },
        { filmingLocation: regex },
        { keywords: regex },
        { particles: regex },
        { rigidbodies: regex },
        { softBodies: regex },
        { clothgroom: regex },
        { magicAbstract: regex },
        { pyroVolumetrics: regex },
        { LiquidsFluids: regex },

        { crowd: regex },
        { mechanicsTech: regex },
        { compositing: regex },
        { simulationSize: regex },
        { simulationStyle: regex },
        { motionStyle: regex },
        { emitterSpeed: regex },
        { simulationSoftware: regex },
        { focalLength: regex },
        { lightingConditions: regex },
        { videoType: regex },
        {referenceType: regex },
        {videoSpeed: regex },
    
        {videoQuality: regex },
        {
          tags:regex
        }
    
      ];
    }
// console.log(parseArrayParam(focalLength), 'hea ami focal length')
    // Apply other filters
    if (title) filter.title = title;
    if (description) filter.description = description;
    if (imageUrl) filter.imageUrl = imageUrl;
    if (youtubeLink) filter.youtubeLink = youtubeLink;
    if (gallery) filter.gallery = { $in: parseArrayParam(gallery) };
    if (mediaType) filter.mediaType = { $in: parseArrayParam(mediaType) };
    if (focalLength) filter.focalLength = { $in: parseArrayParam(focalLength) };
    if (lightingConditions) filter.lightingConditions = { $in: parseArrayParam(lightingConditions) };
    if (videoType) filter.videoType = { $in: parseArrayParam(videoType) };
    if (videoQuality) filter.videoType = { $in: parseArrayParam(videoQuality) };
    if (referenceType) filter.referenceType = { $in: parseArrayParam(referenceType) };
    if (videoSpeed) filter.videoSpeed = { $in: parseArrayParam(videoSpeed) };
    if (releaseYear) filter.releaseYear = releaseYear;
    if (timePeriod) filter.timePeriod = { $in: parseArrayParam(timePeriod) };
    if (color) filter.color = { $in: parseArrayParam(color) };
    if (roscoColor) filter.roscoColor = { $in: parseArrayParam(roscoColor) };
    if (customColor) filter.customColor = { $in: parseArrayParam(customColor) };
    if (aspectRatio) filter.aspectRatio = { $in: parseArrayParam(aspectRatio) };
    if (opticalFormat) filter.opticalFormat = { $in: parseArrayParam(opticalFormat) };
    if (labProcess) filter.labProcess = { $in: parseArrayParam(labProcess) };
    if (format) filter.format = { $in: parseArrayParam(format) };
    if (locationType) filter.locationType = { $in: parseArrayParam(locationType) };
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
    if (keywords) filter.keywords = { $in: parseArrayParam(keywords) };
    if (simulationSize) filter.simulationSize = { $in: parseArrayParam(simulationSize) };
    if (simulationStyle) filter.simulationStyle = { $in: parseArrayParam(simulationStyle) };
    
    if (motionStyle) filter.motionStyle = { $in: parseArrayParam(motionStyle) };
    if (emitterSpeed) filter.emitterSpeed = { $in: parseArrayParam(emitterSpeed) };
    if (simulationSoftware) filter.simulationSoftware = { $in: parseArrayParam(simulationSoftware) };
    
    // New FX filters
    if (particles) filter['simulatorTypes.particles'] = { $in: parseArrayParam(particles) };
    if (rigidbodies) filter['simulatorTypes.rigidbodies'] = { $in: parseArrayParam(rigidbodies) };
    if (softBodies) filter['simulatorTypes.softBodies'] = { $in: parseArrayParam(softBodies) };
    if (clothgroom) filter['simulatorTypes.clothgroom'] = { $in: parseArrayParam(clothgroom) };
    if (magicAbstract) filter['simulatorTypes.magicAbstract'] = { $in: parseArrayParam(magicAbstract) };
    if (pyroVolumetrics) filter['simulatorTypes.pyroVolumetrics'] = { $in: parseArrayParam(pyroVolumetrics) };
    if (LiquidsFluids) filter['simulatorTypes.LiquidsFluids'] = { $in: parseArrayParam(LiquidsFluids) };
    if (crowd) filter['simulatorTypes.crowd'] = { $in: parseArrayParam(crowd) };
    if (mechanicsTech) filter['simulatorTypes.mechanicsTech'] = { $in: parseArrayParam(mechanicsTech) };
    if (compositing) filter['simulatorTypes.compositing'] = { $in: parseArrayParam(compositing) };



    console.log(sortBy, '<----sortBy haha bandor')



    // Handle sorting
    let query;
    switch (sortBy) {
      case 'releaseDateDesc':
        query = Shot.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        break;
      case 'releaseDateAsc':
        query = Shot.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit);
        break;
      case 'recentlyAdded':
        query = Shot.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        break;
      case 'random':
        query = Shot.aggregate([
          { $match: filter },
          { $sample: { size: limit } },
          { $skip: skip },
          { $limit: limit }
        ]);
        break;
      case 'alphabetical':
        query = Shot.find(filter).sort({ title: 1 }).skip(skip).limit(limit);
        break;
      default:
        query = Shot.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    }

    const resp = await query;


    res.status(200).json({
      message: 'Success',
      data: resp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
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




export const updateClick = async (req, res) => {
  try {
    const id = req.params.id;

    const update = await Shot.updateOne(
      { _id: id },
      { $inc: { click: 1 } } 
    );

    res.status(200).json({
      message: 'Click updated successfully!',
      update,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error,
    });
  }
};


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





export const trendingShot = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); 

    const shots = await Shot.find({
      createdAt: { $gte: oneMonthAgo },
    })
      .sort({ click: -1 }) 
      .limit(12); 

    res.status(200).json({
      message: 'Trending shots retrieved successfully!',
      data: shots,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve trending shots.',
      error,
    });
  }
};

// services page

export const getServices = async(req, res)=>{
  try {
    const data = await Service.find();
    res.status(201).json({
      message:'Success',
      data

    })
    
  } catch (error) {
    res.status(500).json({
       message:'Something went wrong!',
       error
    })
    
  }
}

export const getSingleServices = async (req, res) => {
  console.log('Hit')
  const id = req.params.id
  console.log(id, 'this is id')

  try {
    const data = await Service.findById(id) // better than find({ _id: id })
    
    if (!data) {
      return res.status(404).json({
        message: 'Service not found'
      })
    }

    res.status(200).json({
      message: 'Success',
      data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message
    })
  }
};



export const getShotById = async(req, res)=>{
  try {
    
         const authHeader = req.headers['authorization'];
    
        if (!authHeader || !authHeader.startsWith('Bearer')) {
          return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }
    
        const token = authHeader.split(' ')[1];
        console.log(token, 'this is token');
    
        let userPayload;
        try {
          userPayload = jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
          console.log(userPayload, 'this is userPayload');
        } catch (err) {
            console.log('invalid token')
          return res.status(201).json({ message: 'Invalid or expired token', error: err.message });
        }

        const data = await Shot.find({userId:userPayload.id});
        
    res.status(200).json({
      message: 'Trending shots retrieved successfully!',
      data,
    });

  } catch (error) {
    
    res.status(500).json({
      message:'Sucess',
      error
    })
  }
};



export const shotCount = async(req, res)=>{
  try {
    const data =await Shot.countDocuments({status:'active'});
    res.status(201).json({
      message:'Success',
      count:data
    })
    
  } catch (error) {
    res.status(500).json({

      message:'Something Went Wrong!',
      error
   
    })
    
  }
}






// Single shot getting

export const getSingleShot = async(req, res)=>{

  try {

    const id = req.params.id;
    const data = await Shot.findById(id);
    res.status(201).json({
      message:'Success',
      data
    })
    
  } catch (error) {
    res.status(500).json({
      message:'Something Went Wrong!',
      error
    })
  }
}


// Update shot

export const updateSingleShot = async(req, res)=>{
  try {
    
  } catch (error) {
    
  }
}















// get s hot


// export const getShot = async (req, res) => {
//   try {
//     const {
//       search,
//       sortBy,
//       // Basic filters
//       director,
//       focalLength,
//       title,
//       description,
//       imageUrl,
//       youtubeLink,
//       gallery,
//       mediaType,
//       genre,
//       releaseYear,
//       timePeriod,
//       color,
//       roscoColor,
//       customColor,
//       aspectRatio,
//       opticalFormat,
//       labProcess,
//       format,
//       locationType,
//       timeOfDay,
//       numberOfPeople,
//       gender,
//       ageGroup,
//       ethnicity,
//       frameSize,
//       shotType,
//       composition,
//       lensType,
//       lightingStyle,
//       lightingType,
//       particles,
//       // Crew filters
//       cinematographer,
//       productionDesigner,
//       costumeDesigner,
//       editor,
//       age,
//       interiorExterior,
//       camera,
//       lens,
//       shotTime,
//       set,
//       storyLocation,
//       filmingLocation,
//       tags,
//       // New FX filters
//       rigidbodies,
//       keywords,
//       softBodies,
//       clothgroom,
//       magicAbstract,
//       pyroVolumetrics,
//       LiquidsFluids,
//       crowd,
//       mechanicsTech,
//       compositing,
//       simulationSize,
//       simulationStyle,
//       motionStyle,
//       emitterSpeed,
//       simulationSoftware,
//       lightingConditions,
//       videoType,
//       referenceType,
//       videoSpeed,
//       videoQuality
//     } = req.query;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;
//     const skip = (page - 1) * limit;

//     const parseArrayParam = (param) => {
//       if (!param) return [];
//       return Array.isArray(param) ? param : param.split(',').map((item) => item.trim());
//     };

//     const filter = { status: 'active' };

//     // Handle search with regex across all fields
//     if (search && search.trim() !== '') {
//       const regex = { $regex: search.trim(), $options: 'i' };
//       filter.$or = [
//         { title: regex },
//         { description: regex },
//         { genre: regex },
//         { mediaType: regex },
//         { timePeriod: regex },
//         { color: regex },
//         { roscoColor: regex },
//         { customColor: regex },
//         { aspectRatio: regex },
//         { opticalFormat: regex },
//         { labProcess: regex },
//         { format: regex },
//         { locationType: regex },
//         { timeOfDay: regex },
//         { numberOfPeople: regex },
//         { gender: regex },
//         { ageGroup: regex },
//         { ethnicity: regex },
//         { frameSize: regex },
//         { shotType: regex },
//         { composition: regex },
//         { lensType: regex },
//         { lightingStyle: regex },
//         { lightingType: regex },
//         { director: regex },
//         { cinematographer: regex },
//         { productionDesigner: regex },
//         { costumeDesigner: regex },
//         { editor: regex },
//         { age: regex },
//         { interiorExterior: regex },
//         { camera: regex },
//         { lens: regex },
//         { shotTime: regex },
//         { set: regex },
//         { storyLocation: regex },
//         { filmingLocation: regex },
//         { keywords: regex },
//         { particles: regex },
//         { rigidbodies: regex },
//         { softBodies: regex },
//         { clothgroom: regex },
//         { magicAbstract: regex },
//         { pyroVolumetrics: regex },
//         { LiquidsFluids: regex },
//         { crowd: regex },
//         { mechanicsTech: regex },
//         { compositing: regex },
//         { simulationSize: regex },
//         { simulationStyle: regex },
//         { motionStyle: regex },
//         { emitterSpeed: regex },
//         { simulationSoftware: regex },
//         { focalLength: regex },
//         { lightingConditions: regex },
//         { videoType: regex },
//         { referenceType: regex },
//         { videoSpeed: regex },
//         { videoQuality: regex },
//         { tags: regex }
//       ];
//     }

//     // Apply other filters
//     if (title) filter.title = title;
//     if (description) filter.description = description;
//     if (imageUrl) filter.imageUrl = imageUrl;
//     if (youtubeLink) filter.youtubeLink = youtubeLink;
//     if (gallery) filter.gallery = { $in: parseArrayParam(gallery) };
//     if (mediaType) filter.mediaType = { $in: parseArrayParam(mediaType) };
//     if (focalLength) filter.focalLength = { $in: parseArrayParam(focalLength) };
//     if (tags) filter.tags = { $in: parseArrayParam(tags) };
//     if (lightingConditions) filter.lightingConditions = { $in: parseArrayParam(lightingConditions) };
//     if (videoType) filter.videoType = { $in: parseArrayParam(videoType) };
//     if (videoQuality) filter.videoQuality = { $in: parseArrayParam(videoQuality) };
//     if (referenceType) filter.referenceType = { $in: parseArrayParam(referenceType) };
//     if (videoSpeed) filter.videoSpeed = { $in: parseArrayParam(videoSpeed) };
//     if (releaseYear) filter.releaseYear = releaseYear;
//     if (timePeriod) filter.timePeriod = { $in: parseArrayParam(timePeriod) };
//     if (color) filter.color = { $in: parseArrayParam(color) };
//     if (roscoColor) filter.roscoColor = { $in: parseArrayParam(roscoColor) };
//     if (customColor) filter.customColor = { $in: parseArrayParam(customColor) };
//     if (aspectRatio) filter.aspectRatio = { $in: parseArrayParam(aspectRatio) };
//     if (opticalFormat) filter.opticalFormat = { $in: parseArrayParam(opticalFormat) };
//     if (labProcess) filter.labProcess = { $in: parseArrayParam(labProcess) };
//     if (format) filter.format = { $in: parseArrayParam(format) };
//     if (locationType) filter.locationType = { $in: parseArrayParam(locationType) };
//     if (timeOfDay) filter.timeOfDay = { $in: parseArrayParam(timeOfDay) };
//     if (numberOfPeople) filter.numberOfPeople = { $in: parseArrayParam(numberOfPeople) };
//     if (gender) filter.gender = { $in: parseArrayParam(gender) };
//     if (ageGroup) filter.ageGroup = { $in: parseArrayParam(ageGroup) };
//     if (age) filter.age = { $in: parseArrayParam(age) };
//     if (ethnicity) filter.ethnicity = { $in: parseArrayParam(ethnicity) };
//     if (interiorExterior) filter.interiorExterior = { $in: parseArrayParam(interiorExterior) };
//     if (frameSize) filter.frameSize = { $in: parseArrayParam(frameSize) };
//     if (shotType) filter.shotType = { $in: parseArrayParam(shotType) };
//     if (composition) filter.composition = { $in: parseArrayParam(composition) };
//     if (lensType) filter.lensType = { $in: parseArrayParam(lensType) };
//     if (lightingStyle) filter.lightingStyle = { $in: parseArrayParam(lightingStyle) };
//     if (lightingType) filter.lightingType = { $in: parseArrayParam(lightingType) };
//     if (director) filter.director = { $in: parseArrayParam(director) };
//     if (cinematographer) filter.cinematographer = { $in: parseArrayParam(cinematographer) };
//     if (productionDesigner) filter.productionDesigner = { $in: parseArrayParam(productionDesigner) };
//     if (costumeDesigner) filter.costumeDesigner = { $in: parseArrayParam(costumeDesigner) };
//     if (editor) filter.editor = { $in: parseArrayParam(editor) };
//     if (camera) filter.camera = { $in: parseArrayParam(camera) };
//     if (lens) filter.lens = { $in: parseArrayParam(lens) };
//     if (shotTime) filter.shotTime = { $in: parseArrayParam(shotTime) };
//     if (set) filter.set = { $in: parseArrayParam(set) };
//     if (storyLocation) filter.storyLocation = { $in: parseArrayParam(storyLocation) };
//     if (filmingLocation) filter.filmingLocation = { $in: parseArrayParam(filmingLocation) };
//     if (keywords) filter.keywords = { $in: parseArrayParam(keywords) };
//     if (simulationSize) filter.simulationSize = { $in: parseArrayParam(simulationSize) };
//     if (simulationStyle) filter.simulationStyle = { $in: parseArrayParam(simulationStyle) };
//     if (motionStyle) filter.motionStyle = { $in: parseArrayParam(motionStyle) };
//     if (emitterSpeed) filter.emitterSpeed = { $in: parseArrayParam(emitterSpeed) };
//     if (simulationSoftware) filter.simulationSoftware = { $in: parseArrayParam(simulationSoftware) };
    
//     // New FX filters
//     if (particles) filter['simulatorTypes.particles'] = { $in: parseArrayParam(particles) };
//     if (rigidbodies) filter['simulatorTypes.rigidbodies'] = { $in: parseArrayParam(rigidbodies) };
//     if (softBodies) filter['simulatorTypes.softBodies'] = { $in: parseArrayParam(softBodies) };
//     if (clothgroom) filter['simulatorTypes.clothgroom'] = { $in: parseArrayParam(clothgroom) };
//     if (magicAbstract) filter['simulatorTypes.magicAbstract'] = { $in: parseArrayParam(magicAbstract) };
//     if (pyroVolumetrics) filter['simulatorTypes.pyroVolumetrics'] = { $in: parseArrayParam(pyroVolumetrics) };
//     if (LiquidsFluids) filter['simulatorTypes.LiquidsFluids'] = { $in: parseArrayParam(LiquidsFluids) };
//     if (crowd) filter['simulatorTypes.crowd'] = { $in: parseArrayParam(crowd) };
//     if (mechanicsTech) filter['simulatorTypes.mechanicsTech'] = { $in: parseArrayParam(mechanicsTech) };
//     if (compositing) filter['simulatorTypes.compositing'] = { $in: parseArrayParam(compositing) };

//     // Handle sorting
//     let query;
//     switch (sortBy) {
//       case 'releaseDateDesc':
//         query = Shot.find(filter).sort({ releaseYear: -1 }).skip(skip).limit(limit);
//         break;
//       case 'releaseDateAsc':
//         query = Shot.find(filter).sort({ releaseYear: 1 }).skip(skip).limit(limit);
//         break;
//       case 'recentlyAdded':
//         query = Shot.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
//         break;
//       case 'random':
//         query = Shot.aggregate([
//           { $match: filter },
//           { $sample: { size: limit } },
//           { $skip: skip },
//           { $limit: limit }
//         ]);
//         break;
//       case 'alphabetical':
//         query = Shot.find(filter).sort({ title: 1 }).skip(skip).limit(limit);
//         break;
//       default:
//         query = Shot.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
//     }

//     const resp = await query;

//     res.status(200).json({
//       message: 'Success',
//       data: resp,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Something went wrong!',
//       error: error.message,
//     });
//   }
// };



export const getAllTag = async (req, res) => {

  console.log('hitig the middle')
  try {
    const shots = await Shot.find({}, 'tags'); // শুধু tags ফিল্ড নেবো

    const tagMap = new Map();

    // সব tags ঘুরে দেখবো
    shots.forEach(shot => {
      shot.tags?.forEach(tag => {
        if (tagMap.has(tag)) {
          tagMap.set(tag, tagMap.get(tag) + 1);
        } else {
          tagMap.set(tag, 1);
        }
      });
    });

    // ফাইনাল আউটপুট বানাবো
    const result = Array.from(tagMap.entries()).map(([tag, count]) => ({
      tag,
      label: `${tag} (${count})`
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something Went Wrong!',
    });
  }
};
