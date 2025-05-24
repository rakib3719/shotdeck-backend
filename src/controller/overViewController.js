import Shot from "../models/shotModel.js"
import { User } from "../models/userModel.js";

export const overView = async(req, res)=>{
    try {

    const totalShot = await Shot.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingShot = await Shot.countDocuments({status:'pending'});
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59, 999)
    const totalShotToday = await Shot.countDocuments({createdAt: {$gte:startOfDay, $lte:endOfDay}});
    const totalUserToday = await User.countDocuments({createdAt: {$gte:startOfDay, $lte:endOfDay}})
const totalPendingShotToday = await Shot.countDocuments({
  createdAt: { 
    $gte: startOfDay, 
    $lte: endOfDay 
  },
  status: 'pending'
});
    const overView = {
        totalShot,
        totalUsers,
        pendingShot,
        totalShotToday,
      totalPendingShotToday, 
      totalUserToday
    }

    res.status(201).json({
        message:'Sucess',
        overView
    })
        
    } catch (error) {
        res.status(500).json({
            message:'Something went worng!',
            error
        })
    }
}