import { Router } from "express";
import {     changePassword, login,    logout, otpVerification, register, resetPassword } from "../controller/authController.js";
import { saveOtp } from "../controller/otpController.js";
import { getAllUsers, getSingleUser, updateUser } from "../controller/userController.js";
import { isAdmin, verifyToken } from "../middleware/middleware.js";


const router = Router();





router.get('/',verifyToken,isAdmin,  getAllUsers)

// router.get('/getUserOne', getUserController)
router.post('/login', login)
router.get('/getUser', getAllUsers)
router.post('/otp', saveOtp)
router.post('/otp-verification',otpVerification)
router.post('/create', register)
router.post('/reset-pass', resetPassword)
router.get('/login', login)
router.get('/single-user', getSingleUser)
router.post('/change-password', changePassword)
router.patch('/update', updateUser)

export default router
