
import { use } from "react";
import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken'



export const updateUserActiveStatus = async (req, res) => {
    
    
    try {
       
        const { isActive, userId } = req.body;

        // Validate input
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isActive value (must be boolean)'
            });
        }

     
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true, runValidators: true }
        ).select('-pin -password -__v');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedUser
        });

    } catch (error) {
        console.error('Update user active status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};


export const updateAgentApprovalStatus = async (req, res) => {
    try {
        const { isApproved, userId } = req.body;

        // Validate input
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isApproved value (must be boolean)'
            });
        }

        // Find the user first to check account type
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is an agent
        if (user.accountType !== 'agent') {
            return res.status(400).json({
                success: false,
                message: 'Approval status can only be updated for agents'
            });
        }

        // Prepare update data
        const updateData = { isApproved };
        
        // Add balance if being approved and wasn't approved before
        if (isApproved && !user.isApproved) {
            updateData.$inc = { balance: 100000 };
        }

        // Update agent
        const updatedAgent = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-pin -password -__v');

        // Create transaction record if approved
        if (isApproved && !user.isApproved) {
            const transaction = new Transaction({
                   amount: 100000,
                                agent: user.mobileNumber,
                                sender:'Admin',
                                type:"agent-bonus"
                
            });
            await transaction.save();
        }

        res.status(200).json({
            success: true,
            message: `Agent ${isApproved ? 'approved' : 'disapproved'} successfully`,
            data: updatedAgent,
            balanceAdded: isApproved && !user.isApproved ? 100000 : 0
        });

    } catch (error) {
        console.error('Update agent approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update agent approval status',
            error: error.message
        });
    }
};

export const getAllUsers = async(req, res)=>{


    try {
        const data = await User.find();
        res.status(201).json({
            message:'Sucess', 
            data
        })
        
    } catch (error) {
        res.status(500).json({
            message:'Somethng went wrong!',
            error
        })
    }
}








export const getSingleUser = async (req, res) => {
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

    const findUser = await User.findById(userPayload.id);
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Success',
      data: findUser,
    });
  } catch (error) {
    res.status(201).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};



export const updateUser = async(req, res)=>{
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

    const findUser = await User.findById(userPayload.id);
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

        const {email, name, phone , primaryIndustry, primaryOccupation,  others, companyName, schoolName, otherDetails} = req.body;

        console.log(req.body, 'account er kuryem er matha')
        const response = await User.updateOne({_id:findUser._id}, {email:email, name:name, phone:phone || '', primaryOccupation: primaryOccupation, primaryIndustry: primaryIndustry , others: others, companyName: companyName, schoolName: schoolName, otherDetails: otherDetails});
        res.status(201).json({
            message:'Success',
            data: response
        })
        
    } catch (error) {
        res.status(500).json({
            message:'Something went wrong!',
            error
        })
    }
}


export const deleteUser = async(req, res)=>{
    
}