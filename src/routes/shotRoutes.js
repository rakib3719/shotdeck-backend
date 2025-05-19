import { Router } from "express";
import { createShot, deleteShot } from "../controller/ShotController.js";



const router = Router();





router.post('/create',  createShot);
router.delete('/delete/:id', deleteShot)


export default router


