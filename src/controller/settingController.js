import Setting from "../models/settingModel.js";

export const updateSetting = async(req, res)=>{
    try {

          const data = req.body;

          console.log(data,'oi kire oi kire data asca to ')

        const updateData = await Setting.updateOne({_id:data.id} , data);
        res.status(201).json({
            message:'Success',
            data:updateData
        })
        
    } catch (error) {

      
        
        res.status(500).json({
            message:'Something went worng!',
            error
        })
    }
}


export const getSettings = async(req, res)=>{
    try {
        const data = await Setting.find();
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