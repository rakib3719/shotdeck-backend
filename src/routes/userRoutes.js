import { Router } from "express";
import {     login,    logout, otpVerification, register, resetPassword } from "../controller/authController.js";
import { saveOtp } from "../controller/otpController.js";
import { getAllUsers } from "../controller/userController.js";


const router = Router();





router.get('/',  getAllUsers)

// router.get('/getUserOne', getUserController)
router.post('/login', login)
router.get('/getUser', getAllUsers)
router.post('/otp', saveOtp)
router.post('/otp-verification',otpVerification)
router.post('/create', register)
router.post('/reset-pass', resetPassword)
router.get('/login', login)

export default router
