import jwt from 'jsonwebtoken'
import Shot from "../models/shotModel.js";
import { resetPassword } from './authController.js';
import Service from '../models/servicesModel.js';
import { User } from '../models/userModel.js';
import { use } from 'react';








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
      director,
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

          const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const parseArrayParam = (param) => {
      if (!param) return [];
      return Array.isArray(param) ? param : param.split(',').map((item) => item.trim());
    };

    const filter = {status:'active'};

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
        // { tags: regex }, // Assuming tags are strings
      ];
    }

    // Apply other filters
    if(opticalFormat){
      console.log(opticalFormat, 'this is optical format')
    }
    if (title) filter.title = title;
    if (description) filter.description = description;
    if (imageUrl) filter.imageUrl = imageUrl;
    if (youtubeLink) filter.youtubeLink = youtubeLink;
    if (gallery) filter.gallery = { $in: parseArrayParam(gallery) };
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
    // if (tags) filter.tags = { $in: parseArrayParam(tags) }; // Assuming tags are strings
    if (keywords) filter.keywords = { $in: parseArrayParam(keywords) };

    // Handle sortingdf
    let sort = {};
    let query;
    switch (sortBy) {
      case 'releaseDateDesc':
        sort = { releaseYear: -1 }; 
        query = Shot.find(filter).sort(sort).skip(skip).limit(limit);;
        break;
      case 'releaseDateAsc':
        sort = { releaseYear: 1 }; 
        query = Shot.find(filter).sort(sort).skip(skip).limit(limit);;
        break;
      case 'recentlyAdded':
        sort = { createdAt: -1 }; 
        query = Shot.find(filter).sort(sort).skip(skip).limit(limit);;
        break;
      case 'random':
        query = Shot.aggregate([
          { $match: filter },
          { $sample: { size: 100 } }, 
        ]);
        break;
      case 'alphabetical':
        sort = { title: 1 }; 
        query = Shot.find(filter).sort(sort).skip(skip).limit(limit);;
        break;
      default:
        sort = { createdAt: -1 }; 
        query = Shot.find(filter).sort(sort).skip(skip).limit(limit);;
    }

    // console.log(filter, 'this is filter');
    // console.log(sortBy, 'this is sortBy');
    // console.log(sort, 'this is sort');

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


