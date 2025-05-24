import { Router } from "express";
import { createShot, deleteShot, getRequestedShot, getShot, statusChange } from "../controller/ShotController.js";



const router = Router();





router.post('/create',  createShot);
router.delete('/delete/:id', deleteShot)
router.get('/', getShot);
router.get('/shot-request', getRequestedShot);
router.patch('/update-status/:id', statusChange);



export default router


