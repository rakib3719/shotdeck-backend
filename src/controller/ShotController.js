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