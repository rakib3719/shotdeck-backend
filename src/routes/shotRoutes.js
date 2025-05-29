import { Router } from "express";
import { createShot, deleteShot, getRequestedShot, getServices, getShot, getShotById, getSingleServices, shotCount, statusChange, trendingShot, updateClick } from "../controller/ShotController.js";
import { overView } from "../controller/overViewController.js";
import { createCollection, deleteCollection, getCollection } from "../controller/collectionController.js";
import { isAdmin, verifyToken } from "../middleware/middleware.js";
import { getSettings, updateSetting } from "../controller/settingController.js";



const router = Router();





router.post('/create',  createShot);
router.delete('/delete/:id', deleteShot)
router.get('/', getShot);
router.get('/shot-request', getRequestedShot);
router.patch('/update-status/:id', statusChange);
router.get('/overview', overView);
router.patch('/click/:id', updateClick);
router.get('/treanding', trendingShot);
router.get('/services', getServices);
router.get('/services/:id', getSingleServices);
router.get('/shot-by-id', getShotById);
router.post('/collection', createCollection);
router.get('/collection/:id', getCollection);
router.delete('/collection/:id', deleteCollection);
router.patch('/website', updateSetting);
router.get('/website', getSettings);
router.get('/shot-count', shotCount);




export default router


