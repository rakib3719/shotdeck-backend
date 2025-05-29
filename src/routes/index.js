import { Router } from "express";
import userRouter from './userRoutes.js'
import shotRouter from './shotRoutes.js'
import collectionRouter from './collectionRoute.js'





const router = Router();

router.use('/user',userRouter);
router.use('/shot', shotRouter);
router.use('/collection', collectionRouter)






export default router;