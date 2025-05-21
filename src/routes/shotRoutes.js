import { Router } from "express";
import { createShot, deleteShot, getShot } from "../controller/ShotController.js";



const router = Router();





router.post('/create',  createShot);
router.delete('/delete/:id', deleteShot)
router.get('/', getShot)


export default router


