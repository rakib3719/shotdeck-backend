import Collection from "../models/collectionModel.js";
import CollectionName from "../models/collectionNameModal.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";





export const createCollection = async (req, res) => {
    try {
        // Authentication check
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
        
        // Check if the user making the request matches the userId in the request
        if (decoded.id !== req.body.userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized - userId mismatch' 
            });
        }

        // Extract data from request body
        const { 
            collectionName: currentClc, 
            data: currentShotForCollections, 
            shotId, 
            userId: Userid 
        } = req.body;

        // Validate required fields
        if (!currentClc || !currentShotForCollections || !shotId || !Userid) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: collectionName, data, shotId, or userId' 
            });
        }

        // Check if the shot already exists in this collection
        const existingItem = await Collection.findOne({
            userId: Userid,
            collectionName: currentClc,
            shotId: shotId
        });

        if (existingItem) {
            return res.status(409).json({
                success: false,
                message: 'This shot already exists in the collection',
                data: existingItem
            });
        }

        // Create new collection item
        const newCollectionItem = await Collection.create({
            userId: Userid,
            collectionName: currentClc,
            shotId: shotId,
            data: currentShotForCollections
        });

        res.status(201).json({
            success: true,
            message: 'Shot added to collection successfully',
            data: newCollectionItem
        });

    } catch (error) {
        console.error('Error adding to collection:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry detected',
                error: error.keyValue
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getCollection = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await CollectionName.find({ userId: id }); 

    res.status(200).json({
      message: 'Success',
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message || error,
    });
  }
};

export const deleteCollection = async(req, res)=>{
    try {


        const id = req.params.id;
        const resp =await Collection.deleteOne({_id:id});
        res.status(201).json({
            message:'Success',
            data:resp
        })
        
    } catch (error) {
         res.status(500).json({

             message:'Something went wrong!',
            error
        })
    }
}











export const saveCollection = async (req, res) => {
  try {
    const data = req.body;
    const resp = await CollectionName.create(data);
    res.status(201).json({
      message: 'Success',
      data: resp
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error
    });
  }
}







export const getCollectionSingle = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Collection.find({ userId: id }); 

    res.status(200).json({
      message: 'Success',
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message || error,
    });
  }
};



export const getCollectionAll = async (req, res)=>{
  try {

   const id = req.params.id;

   const data = await CollectionName.find({ userId: id }); 

    res.status(200).json({
      message: 'Success',
      data,
    });CollectionName.find({ userId: id }); 

    res.status(200).json({
      message: 'Success',
      data,
    });
    
  } catch (error) {

    res.status(500).json({
      message:'Something went wrong!'
    })
    
  }
}





export const deleteCollections = async (req, res) => {



  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Name and userId are required' 
      });
    }

    const result = await CollectionName.deleteOne({ 
      name: name,
      userId: userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
}