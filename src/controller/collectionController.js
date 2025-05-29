import Collection from "../models/collectionModel.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const createCollection = async(req,res)=>{

    console.log('first huy')
       const authHeader = req.headers['authorization'];
         if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return res.status(401).json({ message: 'No token provided' });
         }
     
         const token = authHeader.split(' ')[1];
         console.log(token , 'This is token')
    try {
        
       const authHeader = req.headers['authorization'];
         if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return res.status(401).json({ message: 'No token provided' });
         }
     
         const token = authHeader.split(' ')[1];
         let user;
     
 
           user = jwt.verify(token, 'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6');
           console.log(user, 'user atat')
       
         const data = req.body;
      
     
       const findUser = await User.findById(user.id);
       data.email = findUser.email;
       data.userId = findUser._id;
     


        const resp = await Collection.create(data);
        res.status(201).json({
      message: 'Shot created successfully',
      data: resp})
    } catch (error) {
        
        res.status(500).json({
            message:'Something went wrong!',
            error

        })
    }
};


export const getCollection = async (req, res) => {
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