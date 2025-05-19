import { Router } from "express";
import { getAllUsers,   getUser,   login,   logout, register } from "../controller/authController.js";


const router = Router();





router.get('/',  getAllUsers)

// router.get('/getUserOne', getUserController)
router.post('/login', login)
router.post('/getUser', getUser)
export default router
